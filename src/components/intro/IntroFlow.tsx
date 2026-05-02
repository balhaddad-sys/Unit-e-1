"use client";

import { useState } from "react";
import { useGame } from "@/engine/store";
import { classes } from "@/data/classes";
import { backgrounds } from "@/data/backgrounds";
import { personalities } from "@/data/personalities";
import { AppearancePicker } from "@/components/intro/AppearancePicker";
import type { Appearance } from "@/lib/types";

const STEPS = ["Name", "Class", "Origin", "Personality", "Face"] as const;

const ACCENTS = [
  { id: "emerald",  name: "Emerald", hex: "#00713c" },
  { id: "crimson",  name: "Crimson", hex: "#a02437" },
  { id: "oud",      name: "Oud",     hex: "#7a4a1b" },
  { id: "khaleej",  name: "Khaleej", hex: "#1c4f7a" },
  { id: "dusk",     name: "Dusk",    hex: "#5e3a72" },
  { id: "ink",      name: "Ink",     hex: "#1a1612" },
];

export function IntroFlow({ onDone }: { onDone: () => void }) {
  const setStore = useGame((s) => s.set);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [honorific, setHonorific] = useState<"Bu" | "Umm">("Bu");
  const [classId, setClassId] = useState<string>(classes[0].id);
  const [bgId, setBgId] = useState<string>(backgrounds[0].id);
  const [pers, setPers] = useState<string>(personalities[0].id);
  const [accent, setAccent] = useState<string>("emerald");
  const [appearance, setAppearance] = useState<Appearance>({
    style: honorific === "Umm" ? "shayla" : "ghutra",
    skin: "s2",
    ghutra: "white",
    shayla: "black",
    beard: "trimmed",
    eyes: "dark",
    eyebrows: "natural",
    age: "adult",
    glasses: "none",
  });

  function commit() {
    const c = classes.find((x) => x.id === classId)!;
    const bg = backgrounds.find((x) => x.id === bgId)!;
    setStore((s) => {
      s.givenName = name.trim() || "Khalid";
      s.honorific = honorific;
      s.classId = classId;
      s.bg = bgId;
      s.personality = pers;
      s.accent = accent;
      s.appearance = appearance;
      // Apply class baseline
      s.stats = { ...c.stats };
      s.factions = {
        merchants: c.factions.merchants || 0,
        government: c.factions.government || 0,
        tribal: c.factions.tribal || 0,
        religious: c.factions.religious || 0,
      };
      // Apply background perk
      bg.apply(s);
    });
    onDone();
  }

  const stepValid = [
    name.trim().length > 0,
    !!classId,
    !!bgId,
    !!pers,
    true,
  ][step];

  return (
    <div className="max-w-screen mx-auto min-h-dvh px-4 py-6 pb-24">
      <div className="text-center mb-6">
        <div className="ar text-sm text-[var(--muted)]">وَسطة الكويت</div>
        <h1 className="serif text-3xl mt-1">Wasta Kuwait</h1>
        <p className="text-sm text-[var(--muted)] mt-1">A life. A name. The room watching.</p>
      </div>

      <div className="flex justify-center gap-1.5 mb-6">
        {STEPS.map((label, i) => (
          <div key={label} className={`h-1 rounded-full ${i <= step ? "bg-emerald" : "bg-[var(--line)]"} flex-1 max-w-12`} />
        ))}
      </div>

      <div className="card p-5 fade-in">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="serif text-xl">What name will the room remember?</h2>
            <p className="text-sm text-[var(--muted)]">
              Pick a given name. Honorifics in this country come later — earned, often through a son or daughter.
            </p>

            <div className="flex gap-2">
              <button
                className={`btn flex-1 text-center ${honorific === "Bu" ? "btn-primary" : ""}`}
                onClick={() => { setHonorific("Bu"); setAppearance({ ...appearance, style: appearance.style === "shayla" || appearance.style === "abaya" ? "ghutra" : appearance.style }); }}
              >Bu (Father of)</button>
              <button
                className={`btn flex-1 text-center ${honorific === "Umm" ? "btn-primary" : ""}`}
                onClick={() => { setHonorific("Umm"); setAppearance({ ...appearance, style: "shayla" }); }}
              >Umm (Mother of)</button>
            </div>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Khalid, Nasser, Hessa, Latifa…"
              className="w-full border border-[var(--line)] rounded-xl px-4 py-3 bg-white text-base"
            />

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Accent color</div>
              <div className="flex gap-2 flex-wrap">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.id)}
                    className={`w-9 h-9 rounded-full border-2 ${accent === a.id ? "border-ink" : "border-[var(--line)]"}`}
                    style={{ background: a.hex }}
                    title={a.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <h2 className="serif text-xl">What kind of life have you lived so far?</h2>
            <div className="space-y-2">
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClassId(c.id)}
                  className={`btn ${classId === c.id ? "ring-2 ring-emerald" : ""}`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg leading-none">{c.icon}</span>
                    <span className="font-semibold">{c.en}</span>
                    <span className="ar text-xs text-[var(--muted)]">{c.ar}</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">{c.descEn}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h2 className="serif text-xl">Where do you come from?</h2>
            <div className="space-y-2">
              {backgrounds.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBgId(b.id)}
                  className={`btn ${bgId === b.id ? "ring-2 ring-emerald" : ""}`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg leading-none">{b.icon}</span>
                    <span className="font-semibold">{b.name}</span>
                    <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{b.perk}</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">{b.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h2 className="serif text-xl">How do you carry yourself?</h2>
            <div className="space-y-2">
              {personalities.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPers(p.id)}
                  className={`btn ${pers === p.id ? "ring-2 ring-emerald" : ""}`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg leading-none">{p.icon}</span>
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{p.perk}</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h2 className="serif text-xl">Your face.</h2>
            <AppearancePicker appearance={appearance} onChange={setAppearance} />
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="btn flex-[0_0_30%] text-center"
          onClick={() => setStep((x) => Math.max(0, x - 1))}
          disabled={step === 0}
        >
          Back
        </button>
        <button
          className="btn btn-primary flex-1 text-center"
          disabled={!stepValid}
          onClick={() => {
            if (step === STEPS.length - 1) commit();
            else setStep((x) => x + 1);
          }}
        >
          {step === STEPS.length - 1 ? "Begin" : "Next"}
        </button>
      </div>
    </div>
  );
}
