import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { MovieData } from "@/lib/types";

interface OutroSlideProps {
  movie: MovieData;
  durationInFrames: number;
}

export const OutroSlide: React.FC<OutroSlideProps> = ({
  movie,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 5, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <p
        style={{
          color: "#e8c47a",
          fontSize: 48,
          fontFamily: "Georgia, serif",
          textAlign: "center",
        }}
      >
        Watch Now on IMDB
      </p>
      <p style={{ color: "#6b6b6b", fontSize: 28, marginTop: 24 }}>
        {movie.title} · imdb.com/title/{movie.imdbId}
      </p>
    </AbsoluteFill>
  );
};
