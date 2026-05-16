"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MovieCard } from "@/components/MovieCard";
import { ProgressStepper } from "@/components/ProgressStepper";
import { ScriptPreview } from "@/components/ScriptPreview";

const VideoPlayer = dynamic(
  () =>
    import("@/components/VideoPlayer").then((m) => ({ default: m.VideoPlayer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-white/[0.08] bg-black">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-cinematic-gold border-t-transparent" />
      </div>
    ),
  }
);
import type {
  GenerationStep,
  MovieData,
  ScriptData,
} from "@/lib/types";

function GenerateContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [step, setStep] = useState<GenerationStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [script, setScript] = useState<ScriptData | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [narrationUrl, setNarrationUrl] = useState<string | null>(null);

  const runPipeline = useCallback(async () => {
    if (!query) {
      setError("No movie specified");
      setStep("error");
      return;
    }

    setError(null);
    setDownloadUrl(null);
    setNarrationUrl(null);

    try {
      setStep("fetching");
      const movieRes = await fetch("/api/fetch-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const movieJson = await movieRes.json();
      if (!movieRes.ok) throw new Error(movieJson.error ?? "Fetch failed");
      setMovie(movieJson.movie);

      setStep("scripting");
      const scriptRes = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie: movieJson.movie }),
      });
      const scriptJson = await scriptRes.json();
      if (!scriptRes.ok) throw new Error(scriptJson.error ?? "Script failed");
      setScript(scriptJson.script);

      setStep("composing");
      const narrRes = await fetch("/api/generate-narration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptJson.script }),
      });
      const narrJson = await narrRes.json();
      if (!narrRes.ok) {
        throw new Error(narrJson.error ?? "Narration failed");
      }
      setNarrationUrl(narrJson.url);

      setStep("rendering");
      const renderRes = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie: movieJson.movie,
          script: scriptJson.script,
        }),
      });
      const renderJson = await renderRes.json();
      if (renderJson.url) setDownloadUrl(renderJson.url);

      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("error");
    }
  }, [query]);

  useEffect(() => {
    if (query) runPipeline();
  }, [query, runPipeline]);

  return (
    <main className="min-h-screen bg-cinematic-bg px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="font-body text-sm text-cinematic-muted transition hover:text-cinematic-gold"
        >
          ← Back
        </Link>

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-300">
            {error}
            <button
              type="button"
              onClick={runPipeline}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside>
            {movie ? (
              <MovieCard movie={movie} />
            ) : (
              <div className="h-96 animate-pulse rounded-xl bg-cinematic-surface" />
            )}
          </aside>

          <div className="space-y-8">
            <div className="rounded-xl border border-white/[0.08] bg-cinematic-surface p-6">
              <h2 className="font-display text-2xl text-cinematic-text">
                Generating your video
              </h2>
              <p className="mt-1 font-body text-sm text-cinematic-muted">
                {query}
              </p>
              <div className="mt-6">
                <ProgressStepper currentStep={step} />
              </div>
            </div>

            {script && (
              <ScriptPreview
                script={script}
                onChange={setScript}
                editable={step === "done"}
              />
            )}

            {movie && script && (step === "done" || step === "rendering") && (
              <div>
                <h3 className="mb-4 font-display text-xl text-cinematic-text">
                  Preview
                </h3>
                <VideoPlayer
                  movie={movie}
                  script={script}
                  narrationUrl={narrationUrl}
                  downloadUrl={downloadUrl}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-cinematic-bg">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-cinematic-gold border-t-transparent" />
        </main>
      }
    >
      <GenerateContent />
    </Suspense>
  );
}
