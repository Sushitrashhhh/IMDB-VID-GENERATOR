import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { MovieData, ScriptData } from "./types";

export const buildScriptPrompt = (movie: MovieData): string => `
You are a professional YouTube video scriptwriter specializing in movie reviews and recommendations.

Write a compelling 2-minute video script (approximately 300 words) for the following movie:

MOVIE DATA:
- Title: ${movie.title} (${movie.year})
- Genre: ${movie.genre}
- Director: ${movie.director}
- Cast: ${movie.actors}
- Plot: ${movie.plot}
- IMDB Rating: ${movie.imdbRating}/10 (${movie.imdbVotes} votes)
- Rotten Tomatoes: ${movie.tomatoRating || "N/A"}
- Awards: ${movie.awards}

SCRIPT REQUIREMENTS:
1. Hook (15 seconds, ~40 words): Start with a bold, attention-grabbing question or statement
2. Plot Overview (30 seconds, ~75 words): Describe the premise without spoilers
3. What Makes It Special (30 seconds, ~75 words): Unique elements, direction, performances
4. Key Themes (20 seconds, ~50 words): Deeper meaning, why it resonates
5. Verdict & CTA (25 seconds, ~60 words): Rating, who it's for, call to action

TONE: Engaging, cinematic, conversational — like a passionate film lover talking to a friend.

Respond ONLY with valid JSON in this exact format:
{
  "title": "movie title",
  "hook": "hook text...",
  "sections": [
    { "id": "plot", "label": "The Story", "text": "...", "durationSeconds": 30 },
    { "id": "special", "label": "What Makes It Special", "text": "...", "durationSeconds": 30 },
    { "id": "themes", "label": "Themes & Depth", "text": "...", "durationSeconds": 20 }
  ],
  "cta": "cta text...",
  "totalWords": 300,
  "estimatedDuration": 120
}
`;

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export function parseScriptJson(raw: string): ScriptData {
  const cleaned = stripMarkdownFences(raw);
  const parsed = JSON.parse(cleaned) as ScriptData;
  if (!parsed.hook || !parsed.sections?.length) {
    throw new Error("Invalid script structure from AI");
  }
  return parsed;
}

/** Retired 1.5 IDs 404 on v1beta — try current models in order. */
const DEFAULT_GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash-preview-05-20",
  "gemini-flash-latest",
  "gemini-3-flash-preview",
];

function getGeminiApiKey(): string {
  const raw = process.env.GEMINI_API_KEY?.trim().replace(/^["']|["']$/g, "") ?? "";
  if (!raw) throw new Error("GEMINI_API_KEY is not configured");
  return raw;
}

function getModelCandidates(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  const models = preferred
    ? [preferred, ...DEFAULT_GEMINI_MODELS]
    : DEFAULT_GEMINI_MODELS;
  return [...new Set(models)];
}

function isModelNotFoundError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /404/.test(msg) && /not found|not supported/i.test(msg);
}

export async function generateScript(movie: MovieData): Promise<ScriptData> {
  const genAI = new GoogleGenerativeAI(getGeminiApiKey());
  const prompt = buildScriptPrompt(movie);
  let lastError: Error | null = null;

  for (const modelName of getModelCandidates()) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return parseScriptJson(result.response.text());
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (!isModelNotFoundError(err)) throw lastError;
    }
  }

  throw lastError ?? new Error("No supported Gemini model available for your API key");
}

export function mockScript(movie: MovieData): ScriptData {
  return {
    title: movie.title,
    hook: `What if I told you ${movie.title} isn't just another ${movie.genre.split(",")[0]} film — it's a masterpiece waiting for you?`,
    sections: [
      {
        id: "plot",
        label: "The Story",
        text: movie.plot || "A gripping story that keeps you on the edge of your seat.",
        durationSeconds: 30,
      },
      {
        id: "special",
        label: "What Makes It Special",
        text: `Directed by ${movie.director} and starring ${movie.actors.split(",").slice(0, 2).join(" and ")}, this film delivers performances that stay with you long after the credits roll.`,
        durationSeconds: 30,
      },
      {
        id: "themes",
        label: "Themes & Depth",
        text: "Beyond the spectacle lies a story about hope, resilience, and what it means to be human.",
        durationSeconds: 20,
      },
    ],
    cta: `Rated ${movie.imdbRating}/10 on IMDB — if you haven't seen ${movie.title} yet, add it to your watchlist tonight.`,
    totalWords: 280,
    estimatedDuration: 120,
  };
}
