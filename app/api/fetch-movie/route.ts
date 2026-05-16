import { NextResponse } from "next/server";
import { fetchMovie } from "@/lib/omdb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body?.query as string | undefined;
    if (!query?.trim()) {
      return NextResponse.json(
        { error: "Movie title or IMDB URL is required" },
        { status: 400 }
      );
    }

    const movie = await fetchMovie(query);
    return NextResponse.json({ movie });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch movie";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
