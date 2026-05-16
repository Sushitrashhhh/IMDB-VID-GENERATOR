import "server-only";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import type { ScriptData } from "./types";

const DEFAULT_VOICE = "en-US-AndrewNeural";

export function buildNarrationText(script: ScriptData): string {
  const parts = [
    script.hook,
    ...script.sections.map((s) => s.text),
    script.cta,
  ];
  return parts.filter(Boolean).join("\n\n");
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("No narration text to synthesize");

  const { MsEdgeTTS, OUTPUT_FORMAT } = await import("msedge-tts");
  const tts = new MsEdgeTTS();
  const voice = process.env.TTS_VOICE?.trim() || DEFAULT_VOICE;
  await tts.setMetadata(
    voice,
    OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
  );

  const { audioStream } = await tts.toStream(trimmed);
  return streamToBuffer(audioStream);
}

export function getNarrationDir(): string {
  return path.join(process.cwd(), "public", "narration");
}

export async function saveNarrationMp3(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const dir = getNarrationDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), buffer);
  return `/narration/${fileName}`;
}
