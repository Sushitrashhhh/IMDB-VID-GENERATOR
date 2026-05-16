import { NextResponse } from "next/server";
import { generateScript, mockScript } from "@/lib/gemini";
import type { MovieData } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const movie = body?.movie as MovieData | undefined;
    if (!movie?.title) {
      return NextResponse.json({ error: "Movie data is required" }, { status: 400 });
    }

    const useMock = !process.env.GEMINI_API_KEY;
    const script = useMock
      ? mockScript(movie)
      : await generateScript(movie);

    return NextResponse.json({ script, mock: useMock });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate script";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
