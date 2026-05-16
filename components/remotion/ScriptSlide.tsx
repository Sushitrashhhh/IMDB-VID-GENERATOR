import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";
import type { MovieData } from "@/lib/types";

interface ScriptSlideProps {
  movie: MovieData;
  label: string;
  text: string;
  durationInFrames: number;
}

export const ScriptSlide: React.FC<ScriptSlideProps> = ({
  movie,
  label,
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(/\s+/);
  const wordsToShow = Math.min(
    words.length,
    Math.floor(
      interpolate(frame, [15, durationInFrames - 15], [0, words.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const visibleText = words.slice(0, wordsToShow).join(" ");
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <AbsoluteFill style={{ opacity: 0.25 }}>
        <Img
          src={movie.poster}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.95) 100%)",
          padding: 100,
          justifyContent: "center",
        }}
      >
        <p
          style={{
            color: "#e8c47a",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 32,
            fontFamily: "sans-serif",
          }}
        >
          {label}
        </p>
        <p
          style={{
            color: "#f5f5f5",
            fontSize: 42,
            lineHeight: 1.5,
            maxWidth: 1400,
            fontFamily: "Georgia, serif",
          }}
        >
          {visibleText}
          {wordsToShow < words.length && (
            <span style={{ opacity: 0.5 }}>|</span>
          )}
        </p>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 100,
            right: 100,
            height: 4,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#e8c47a",
              borderRadius: 2,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
