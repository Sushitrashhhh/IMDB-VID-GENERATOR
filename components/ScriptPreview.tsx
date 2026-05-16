"use client";

import { useState } from "react";
import type { ScriptData } from "@/lib/types";

interface ScriptPreviewProps {
  script: ScriptData;
  onChange?: (script: ScriptData) => void;
  editable?: boolean;
}

export function ScriptPreview({
  script,
  onChange,
  editable = true,
}: ScriptPreviewProps) {
  const [open, setOpen] = useState(true);

  const updateSection = (index: number, text: string) => {
    if (!onChange) return;
    const sections = [...script.sections];
    sections[index] = { ...sections[index], text };
    onChange({ ...script, sections });
  };

  const updateField = (field: "hook" | "cta", value: string) => {
    if (!onChange) return;
    onChange({ ...script, [field]: value });
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-cinematic-surface">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-display text-lg text-cinematic-text">
          Script Preview
        </span>
        <span className="font-body text-xs text-cinematic-muted">
          {script.totalWords} words · ~{script.estimatedDuration}s
        </span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-white/[0.08] px-5 pb-5 pt-2">
          <ScriptBlock
            label="Hook"
            text={script.hook}
            editable={editable}
            onChange={(t) => updateField("hook", t)}
          />
          {script.sections.map((section, i) => (
            <ScriptBlock
              key={section.id}
              label={section.label}
              text={section.text}
              editable={editable}
              onChange={(t) => updateSection(i, t)}
            />
          ))}
          <ScriptBlock
            label="Verdict & CTA"
            text={script.cta}
            editable={editable}
            onChange={(t) => updateField("cta", t)}
          />
        </div>
      )}
    </div>
  );
}

function ScriptBlock({
  label,
  text,
  editable,
  onChange,
}: {
  label: string;
  text: string;
  editable: boolean;
  onChange: (text: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 font-body text-xs uppercase tracking-wider text-cinematic-gold">
        {label}
      </p>
      {editable ? (
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-body text-sm text-cinematic-text outline-none focus:border-cinematic-gold/50"
        />
      ) : (
        <p className="font-body text-sm leading-relaxed text-cinematic-text/90">
          {text}
        </p>
      )}
    </div>
  );
}
