"use client";

import Image from "next/image";
import type { MovieData } from "@/lib/types";

interface MovieCardProps {
  movie: MovieData;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-cinematic-surface">
      <div className="relative aspect-[2/3] w-full bg-black/40">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover"
          unoptimized
          sizes="(max-width: 768px) 100vw, 320px"
        />
      </div>
      <div className="p-5">
        <h2 className="font-display text-2xl text-cinematic-text">
          {movie.title}
        </h2>
        <p className="mt-1 font-body text-sm text-cinematic-muted">
          {movie.year} · {movie.genre}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-cinematic-gold/30 bg-cinematic-gold/10 px-3 py-1 font-body text-xs text-cinematic-gold">
            IMDB {movie.imdbRating}
          </span>
          {movie.tomatoRating && (
            <span className="rounded-full border border-white/10 px-3 py-1 font-body text-xs text-cinematic-muted">
              RT {movie.tomatoRating}
            </span>
          )}
        </div>
        <p className="mt-4 font-body text-xs leading-relaxed text-cinematic-muted line-clamp-3">
          {movie.plot}
        </p>
        <p className="mt-3 font-body text-xs text-cinematic-muted">
          <span className="text-cinematic-text/80">Director:</span> {movie.director}
        </p>
        <p className="mt-1 font-body text-xs text-cinematic-muted line-clamp-2">
          <span className="text-cinematic-text/80">Cast:</span> {movie.actors}
        </p>
      </div>
    </div>
  );
}
