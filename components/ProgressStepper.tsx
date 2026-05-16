"use client";

import type { GenerationStep } from "@/lib/types";

const STEPS: { key: GenerationStep; label: string }[] = [
  { key: "fetching", label: "Fetching movie data" },
  { key: "scripting", label: "AI writing script" },
  { key: "composing", label: "Voice-over & video composition" },
  { key: "rendering", label: "Rendering & export" },
];

const ORDER: GenerationStep[] = [
  "fetching",
  "scripting",
  "composing",
  "rendering",
  "done",
];

function stepIndex(step: GenerationStep): number {
  if (step === "idle" || step === "error") return -1;
  return ORDER.indexOf(step);
}

function stepStatus(
  stepKey: GenerationStep,
  current: GenerationStep
): "pending" | "active" | "done" {
  const currentIdx = stepIndex(current);
  const keyIdx = ORDER.indexOf(stepKey);
  if (current === "done") return "done";
  if (keyIdx < currentIdx) return "done";
  if (keyIdx === currentIdx) return "active";
  return "pending";
}

function StepCircle({
  status,
  index,
}: {
  status: "pending" | "active" | "done";
  index: number;
}) {
  return (
    <div
      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-all ${
        status === "done"
          ? "border-cinematic-gold bg-cinematic-gold/20 text-cinematic-gold"
          : status === "active"
            ? "border-cinematic-gold bg-cinematic-surface animate-pulse-glow text-cinematic-gold"
            : "border-white/10 bg-cinematic-surface text-cinematic-muted"
      }`}
    >
      {status === "done" ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : status === "active" ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cinematic-gold border-t-transparent" />
      ) : (
        <span className="text-xs">{index + 1}</span>
      )}
    </div>
  );
}

interface ProgressStepperProps {
  currentStep: GenerationStep;
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const activeIdx = stepIndex(currentStep);
  const fillPercent =
    currentStep === "done"
      ? 100
      : activeIdx <= 0
        ? 0
        : (activeIdx / (STEPS.length - 1)) * 100;

  return (
    <div className="flex gap-4">
      {/* Icon column — line centered with left-1/2 -translate-x-1/2 */}
      <div className="relative flex w-10 shrink-0 flex-col items-center">
        <div
          className="absolute left-1/2 top-5 bottom-5 w-px -translate-x-1/2 bg-white/10"
          aria-hidden
        >
          <div
            className="absolute inset-x-0 top-0 bg-cinematic-gold transition-all duration-700 ease-out"
            style={{ height: `${fillPercent}%` }}
          />
        </div>

        {STEPS.map((step, i) => (
          <div
            key={step.key}
            className={i < STEPS.length - 1 ? "mb-8" : undefined}
          >
            <StepCircle
              status={stepStatus(step.key, currentStep)}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* Labels aligned with each step */}
      <ul className="flex flex-col gap-8 pt-1.5">
        {STEPS.map((step) => {
          const status = stepStatus(step.key, currentStep);
          return (
            <li key={step.key} className="min-h-10 flex flex-col justify-center">
              <p
                className={`font-body text-sm font-medium leading-snug ${
                  status === "active"
                    ? "text-cinematic-text"
                    : status === "done"
                      ? "text-cinematic-gold"
                      : "text-cinematic-muted"
                }`}
              >
                {step.label}
              </p>
              {status === "active" && (
                <p className="mt-1 font-body text-xs text-cinematic-muted">
                  In progress…
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
