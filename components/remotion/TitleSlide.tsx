import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import type { MovieData } from "@/lib/types";

interface TitleSlideProps {
  movie: MovieData;
  durationInFrames: number;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({
  movie,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.35,
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={movie.poster}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(8px) brightness(0.4)",
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          opacity,
          textAlign: "center",
          padding: 80,
          zIndex: 1,
        }}
      >
        <Img
          src={movie.poster}
          style={{
            width: 280,
            borderRadius: 8,
            boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            marginBottom: 40,
          }}
        />
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 72,
            color: "#f5f5f5",
            margin: 0,
            fontWeight: 600,
          }}
        >
          {movie.title}
        </h1>
        <p style={{ color: "#e8c47a", fontSize: 32, marginTop: 16 }}>
          {movie.year} · {movie.genre.split(",")[0]}
        </p>
      </div>
    </AbsoluteFill>
  );
};
