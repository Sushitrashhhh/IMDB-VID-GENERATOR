import "server-only";
import axios from "axios";
import type { MovieData } from "./types";

const IMDB_ID_REGEX = /tt\d{7,8}/i;

function getOmdbApiKey(): string {
  const raw = process.env.OMDB_API_KEY?.trim().replace(/^["']|["']$/g, "") ?? "";
  if (!raw) {
    throw new Error(
      "OMDB_API_KEY is not configured. Add your key to .env.local (key only, not a URL)."
    );
  }

  const fromUrl = raw.match(/[?&]apikey=([a-zA-Z0-9]+)/i);
  if (fromUrl) return fromUrl[1];

  if (/omdbapi\.com/i.test(raw)) {
    throw new Error(
      "OMDB_API_KEY should be the key string only (e.g. abcd1234), not the full omdbapi.com URL."
    );
  }

  return raw;
}

export function parseImdbId(input: string): string | null {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(IMDB_ID_REGEX);
  if (urlMatch) return urlMatch[0].toLowerCase();
  return null;
}

export function isImdbUrl(input: string): boolean {
  return /imdb\.com/i.test(input) || IMDB_ID_REGEX.test(input);
}

interface OmdbResponse {
  Response: string;
  Error?: string;
  imdbID?: string;
  Title?: string;
  Year?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Plot?: string;
  Poster?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Awards?: string;
  Runtime?: string;
  Ratings?: { Source: string; Value: string }[];
}

function mapOmdbToMovie(data: OmdbResponse): MovieData {
  const tomato = data.Ratings?.find((r) =>
    r.Source.toLowerCase().includes("rotten")
  );
  return {
    imdbId: data.imdbID ?? "",
    title: data.Title ?? "Unknown",
    year: data.Year ?? "",
    genre: data.Genre ?? "",
    director: data.Director ?? "N/A",
    actors: data.Actors ?? "",
    plot: data.Plot ?? "",
    poster:
      data.Poster && data.Poster !== "N/A"
        ? data.Poster
        : "https://via.placeholder.com/300x450?text=No+Poster",
    imdbRating: data.imdbRating ?? "N/A",
    imdbVotes: data.imdbVotes ?? "",
    tomatoRating: tomato?.Value,
    awards: data.Awards ?? "N/A",
    runtime: data.Runtime,
  };
}

export async function fetchByImdbId(imdbId: string): Promise<MovieData> {
  const apiKey = getOmdbApiKey();

  const { data } = await axios.get<OmdbResponse>(
    "https://www.omdbapi.com/",
    {
      params: { i: imdbId, apikey: apiKey },
      timeout: 15000,
    }
  );

  if (data.Response === "False") {
    throw new Error(data.Error ?? "Movie not found");
  }

  return mapOmdbToMovie(data);
}

export async function fetchByTitle(title: string): Promise<MovieData> {
  const apiKey = getOmdbApiKey();

  const { data } = await axios.get<OmdbResponse>(
    "https://www.omdbapi.com/",
    {
      params: { t: title.trim(), apikey: apiKey },
      timeout: 15000,
    }
  );

  if (data.Response === "False") {
    throw new Error(data.Error ?? "Movie not found");
  }

  return mapOmdbToMovie(data);
}

export async function fetchMovie(input: string): Promise<MovieData> {
  const imdbId = parseImdbId(input);
  if (imdbId) return fetchByImdbId(imdbId);
  if (!input.trim()) throw new Error("Please enter a movie title or IMDB URL");
  return fetchByTitle(input);
}
