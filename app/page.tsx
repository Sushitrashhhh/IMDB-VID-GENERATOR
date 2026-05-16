"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  {
    label: "Shawshank",
    value: "https://www.imdb.com/title/tt0111161/",
  },
  {
    label: "Inception",
    value: "https://www.imdb.com/title/tt1375666/",
  },
  {
    label: "Parasite",
    value: "Parasite 2019",
  },
];

const FEATURES = [
  {
    step: "01",
    title: "Paste IMDB link",
    desc: "Drop a URL or search by title — we pull ratings, cast, and plot from OMDB.",
  },
  {
    step: "02",
    title: "AI writes your script",
    desc: "Gemini crafts a tight 2-minute hook-to-verdict script tuned for video.",
  },
  {
    step: "03",
    title: "Watch & download",
    desc: "Remotion composes cinematic slides with animated text and your poster.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/generate?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <main className="min-h-screen bg-cinematic-bg">
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,196,122,0.08)_0%,transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="mb-4 font-body text-xs uppercase tracking-[0.3em] text-cinematic-gold">
            IMDB → 2-Minute Video
          </p>
          <h1 className="font-display text-5xl font-semibold leading-tight text-cinematic-text md:text-6xl">
            Turn any film into a cinematic short
          </h1>
          <p className="mt-4 font-body text-cinematic-muted">
            Paste an IMDB URL or movie title. AI writes the script; Remotion
            builds the video.
          </p>

          <form onSubmit={handleSubmit} className="mt-10">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="IMDB URL or movie title…"
              className="w-full rounded-xl border border-white/10 bg-cinematic-surface px-5 py-4 font-body text-lg text-cinematic-text placeholder:text-cinematic-muted outline-none transition focus:border-cinematic-gold/50 focus:ring-1 focus:ring-cinematic-gold/30"
            />
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => setQuery(ex.value)}
                  className="rounded-full border border-white/10 px-4 py-1.5 font-body text-xs text-cinematic-muted transition hover:border-cinematic-gold/40 hover:text-cinematic-gold"
                >
                  {ex.label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="btn-shimmer mt-6 w-full rounded-xl px-8 py-4 font-body text-base font-semibold text-black shadow-lg transition hover:opacity-95"
            >
              Generate Video
            </button>
          </form>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.step}
              className="rounded-xl border border-white/[0.08] bg-cinematic-surface p-6"
            >
              <span className="font-display text-3xl text-cinematic-gold/60">
                {f.step}
              </span>
              <h3 className="mt-3 font-display text-xl text-cinematic-text">
                {f.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-cinematic-muted">
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
