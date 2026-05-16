export interface MovieData {
  imdbId: string;
  title: string;
  year: string;
  genre: string;
  director: string;
  actors: string;
  plot: string;
  poster: string;
  imdbRating: string;
  imdbVotes: string;
  tomatoRating?: string;
  awards: string;
  runtime?: string;
}

export interface ScriptSection {
  id: string;
  label: string;
  text: string;
  durationSeconds: number;
}

export interface ScriptData {
  title: string;
  hook: string;
  sections: ScriptSection[];
  cta: string;
  totalWords: number;
  estimatedDuration: number;
}

export type GenerationStep =
  | "idle"
  | "fetching"
  | "scripting"
  | "composing"
  | "rendering"
  | "done"
  | "error";
