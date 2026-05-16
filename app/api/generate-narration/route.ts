import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  buildNarrationText,
  saveNarrationMp3,
  synthesizeSpeech,
} from "@/lib/tts";
import type { ScriptData } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const script = body?.script as ScriptData | undefined;
    if (!script?.hook) {
      return NextResponse.json({ error: "Script is required" }, { status: 400 });
    }

    const text = buildNarrationText(script);
    const audio = await synthesizeSpeech(text);
    const url = await saveNarrationMp3(audio, `${randomUUID()}.mp3`);

    return NextResponse.json({ url, textLength: text.length });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Narration generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
