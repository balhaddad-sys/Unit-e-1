"use client";

import type { Appearance } from "@/lib/types";
import { Avatar } from "@/components/Avatar";

const FIELDS: {
  key: keyof Appearance;
  label: string;
  options: string[];
}[] = [
  { key: "style",    label: "Style",     options: ["ghutra", "shemagh", "bare", "shayla", "abaya"] },
  { key: "skin",     label: "Skin",      options: ["s1", "s2", "s3", "s4", "s5"] },
  { key: "ghutra",   label: "Ghutra",    options: ["white", "red", "black", "emerald", "navy"] },
  { key: "shayla",   label: "Shayla",    options: ["black", "cream", "emerald", "crimson", "navy", "oud"] },
  { key: "beard",    label: "Beard",     options: ["none", "stubble", "trimmed", "full", "mustache"] },
  { key: "eyes",     label: "Eyes",      options: ["dark", "hazel", "light", "green", "grey"] },
  { key: "eyebrows", label: "Eyebrows",  options: ["natural", "thick", "thin", "arched"] },
  { key: "age",      label: "Age",       options: ["young", "adult", "mature", "elder"] },
  { key: "glasses",  label: "Glasses",   options: ["none", "reading", "square", "round"] },
];

export function AppearancePicker({
  appearance,
  onChange,
}: {
  appearance: Appearance;
  onChange: (a: Appearance) => void;
}) {
  function set<K extends keyof Appearance>(k: K, v: Appearance[K]) {
    onChange({ ...appearance, [k]: v });
  }
  function surprise() {
    const next = { ...appearance };
    for (const f of FIELDS) {
      const opts = f.options;
      (next as any)[f.key] = opts[Math.floor(Math.random() * opts.length)];
    }
    onChange(next);
  }
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar appearance={appearance} size={120} />
        <div className="flex-1 space-y-2">
          <p className="text-sm text-[var(--muted)]">
            How others see you. Tap to adjust. The face is yours.
          </p>
          <button className="btn btn-ghost text-sm" onClick={surprise}>✦ Surprise me</button>
        </div>
      </div>

      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">{f.label}</div>
            <div className="flex flex-wrap gap-1.5">
              {f.options.map((o) => (
                <button
                  key={o}
                  onClick={() => set(f.key as any, o as any)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    (appearance as any)[f.key] === o
                      ? "bg-emerald text-white border-transparent"
                      : "bg-white border-[var(--line)] text-[var(--ink)]"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
