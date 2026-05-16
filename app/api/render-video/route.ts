import { NextResponse } from "next/server";
import type { MovieData, ScriptData } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const movie = body?.movie as MovieData | undefined;
    const script = body?.script as ScriptData | undefined;

    if (!movie || !script) {
      return NextResponse.json(
        { error: "Movie and script are required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      previewOnly: true,
      message:
        "Video ready for in-browser preview. Server MP4 export is optional for production.",
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Video render failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
