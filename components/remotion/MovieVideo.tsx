import { AbsoluteFill, Audio, Sequence } from "remotion";
import type { MovieData, ScriptData } from "@/lib/types";
import { TITLE_FRAMES, TOTAL_FRAMES } from "@/lib/video-constants";
import { TitleSlide } from "./TitleSlide";
import { ScriptSlide } from "./ScriptSlide";
import { OutroSlide } from "./OutroSlide";

export interface MovieVideoProps {
  movie: MovieData;
  script: ScriptData;
  narrationUrl?: string;
}

const FPS = 30;

function secondsToFrames(seconds: number): number {
  return Math.round(seconds * FPS);
}

export const MovieVideo: React.FC<MovieVideoProps> = ({
  movie,
  script,
  narrationUrl,
}) => {
  const titleDuration = TITLE_FRAMES;
  const hookDuration = secondsToFrames(15);
  const sectionDurations = script.sections.map((s) =>
    secondsToFrames(s.durationSeconds)
  );
  const ctaDuration = secondsToFrames(25);
  const outroDuration = 20;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {narrationUrl && (
        <Sequence from={titleDuration} durationInFrames={TOTAL_FRAMES - titleDuration}>
          <Audio src={narrationUrl} volume={1} />
        </Sequence>
      )}
      <Sequence from={0} durationInFrames={titleDuration}>
        <TitleSlide movie={movie} durationInFrames={titleDuration} />
      </Sequence>

      <Sequence from={titleDuration} durationInFrames={hookDuration}>
        <ScriptSlide
          movie={movie}
          label="Hook"
          text={script.hook}
          durationInFrames={hookDuration}
        />
      </Sequence>

      {script.sections.map((section, i) => {
        const from = titleDuration + hookDuration + sectionDurations.slice(0, i).reduce((a, b) => a + b, 0);
        const dur = sectionDurations[i];
        return (
          <Sequence key={section.id} from={from} durationInFrames={dur}>
            <ScriptSlide
              movie={movie}
              label={section.label}
              text={section.text}
              durationInFrames={dur}
            />
          </Sequence>
        );
      })}

      <Sequence
        from={
          titleDuration +
          hookDuration +
          sectionDurations.reduce((a, b) => a + b, 0)
        }
        durationInFrames={ctaDuration}
      >
        <ScriptSlide
          movie={movie}
          label="Verdict"
          text={script.cta}
          durationInFrames={ctaDuration}
        />
      </Sequence>

      <Sequence
        from={
          titleDuration +
          hookDuration +
          sectionDurations.reduce((a, b) => a + b, 0) +
          ctaDuration
        }
        durationInFrames={outroDuration}
      >
        <OutroSlide movie={movie} durationInFrames={outroDuration} />
      </Sequence>
    </AbsoluteFill>
  );
};
