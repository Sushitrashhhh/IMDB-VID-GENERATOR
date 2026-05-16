"use client";

import dynamic from "next/dynamic";
import type { MovieData, ScriptData } from "@/lib/types";
import { TOTAL_FRAMES } from "@/lib/video-constants";

const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false }
);

const MovieVideo = dynamic(
  () =>
    import("@/components/remotion/MovieVideo").then((m) => ({
      default: m.MovieVideo,
    })),
  { ssr: false }
);

interface VideoPlayerProps {
  movie: MovieData;
  script: ScriptData;
  narrationUrl?: string | null;
  downloadUrl?: string | null;
}

export function VideoPlayer({
  movie,
  script,
  narrationUrl,
  downloadUrl,
}: VideoPlayerProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black">
        <Player
          component={
            MovieVideo as unknown as React.ComponentType<Record<string, unknown>>
          }
          inputProps={{ movie, script, narrationUrl: narrationUrl ?? undefined }}
          durationInFrames={TOTAL_FRAMES}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          style={{ width: "100%", aspectRatio: "16/9" }}
          controls
          autoPlay={false}
          loop
        />
      </div>
      {downloadUrl && (
        <a
          href={downloadUrl}
          download
          className="inline-flex items-center gap-2 rounded-lg bg-cinematic-gold px-6 py-3 font-body text-sm font-medium text-black transition hover:bg-cinematic-gold/90"
        >
          Download MP4
        </a>
      )}
      {narrationUrl ? (
        <p className="font-body text-xs text-cinematic-muted">
          Press play — narration starts after the title card. Turn up volume if
          needed.
        </p>
      ) : (
        <p className="font-body text-xs text-cinematic-muted">
          Narration unavailable for this run. Regenerate to retry voice-over.
        </p>
      )}
    </div>
  );
}
