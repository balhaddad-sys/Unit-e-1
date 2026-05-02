"use client";

import { useState } from "react";
import { useGame } from "@/engine/store";
import { classes } from "@/data/classes";
import { backgrounds } from "@/data/backgrounds";
import { personalities } from "@/data/personalities";
import { accents } from "@/data/accents";
import Avatar from "@/components/Avatar";
import IntroAppearance from "./IntroAppearance";

type Step = "name" | "class" | "background" | "personality" | "appearance" | "accent";

const steps: Step[] = ["name", "class", "background", "personality", "appearance", "accent"];

export default function Intro({ onDone }: { onDone: () => void }) {
  const setState = useGame((s) => s.setState);
  const state = useGame((s) => s.state);

  const [step, setStep] = useState<Step>("name");
  const [givenName, setGivenName] = useState(state.givenName || "");
  const [honorific, setHonorific] = useState<"Bu" | "Umm" | "">(state.honorific || "Bu");
  const [classId, setClassId] = useState(state.classId || "");
  const [bgId, setBgId] = useState<string | null>(state.bg || null);
  const [personality, setPersonality] = useState(state.personality || "");
  const [accent, setAccent] = useState(state.accent || "emerald");

  const idx = steps.indexOf(step);
  const back = () => idx > 0 && setStep(steps[idx - 1]);
  const next = () => idx < steps.length - 1 && setStep(steps[idx + 1]);

  const cls = classes.find((c) => c.id === classId);
  const bgList = classId ? backgrounds[classId] || [] : [];

  function commitAndStart() {
    if (!cls || !bgId || !personality || !givenName.trim()) return;
    const bg = bgList.find((b) => b.id === bgId);
    if (!bg) return;

    setState((s) => {
      s.givenName = givenName.trim();
      s.honorific = honorific;
      s.classId = cls.id;
      s.personality = personality;
      s.accent = accent;
      // Apply class baseline
      s.stats = { ...cls.stats };
      s.factions = { merchants: 0, government: 0, tribal: 0, religious: 0 };
      for (const k of Object.keys(cls.factions) as ("merchants" | "government" | "tribal" | "religious")[]) {
        s.factions[k] = cls.factions[k] || 0;
      }
      // Apply background — sets s.bg internally
      bg.apply(s);
      // First story entry
      s.story.push({ day: 1, time: 8, text: `You arrive. The diwaniya does not yet know your name.` });
    });

    onDone();
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="px-4 pt-6 pb-3">
        <div className="max-w-page mx-auto flex items-center justify-between">
          <h1 className="display text-2xl">Wasta Kuwait</h1>
          <div className="text-xs text-ash">
            Step {idx + 1} of {steps.length}
          </div>
        </div>
        <div className="max-w-page mx-auto mt-2 h-1 bg-line/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all"
            style={{ width: `${((idx + 1) / steps.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-page mx-auto px-4 pb-32">
        {step === "name" && (
          <Section title="Your name" arabic="اسمك">
            <p className="text-sm text-ash mb-3">
              In Kuwait, the honorific tells your story before you speak. Bu Khalid is the father of Khalid. Umm Latifa is the mother of Latifa.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(["Bu", "Umm", ""] as const).map((h) => (
                <button
                  key={h || "none"}
                  className={`btn ${honorific === h ? "btn-primary" : ""}`}
                  onClick={() => setHonorific(h)}
                >
                  {h || "(none)"}
                </button>
              ))}
            </div>
            <label className="block text-sm text-ash mb-1">Given name</label>
            <input
              autoFocus
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              placeholder="e.g. Khalid, Fahd, Latifa"
              className="w-full px-3 py-2.5 rounded-xl border border-line bg-card focus:outline-none focus:border-[var(--accent)]"
            />
          </Section>
        )}

        {step === "class" && (
          <Section title="Where you come from" arabic="الأصل">
            <div className="grid gap-2">
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClassId(c.id)}
                  className={`text-left panel transition-shadow ${
                    classId === c.id ? "shadow-glow border-[var(--accent)]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="display text-base">{c.en}</div>
                        <span className="arabic text-sm text-ash">{c.ar}</span>
                      </div>
                      <div className="text-xs text-ash mt-0.5">{c.descEn}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {step === "background" && (
          <Section title="Your background" arabic="الخلفية">
            {!classId ? (
              <p className="text-sm text-ash">Pick an origin first.</p>
            ) : (
              <div className="grid gap-2">
                {bgList.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBgId(b.id)}
                    className={`text-left panel ${
                      bgId === b.id ? "shadow-glow border-[var(--accent)]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{b.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="display text-base">{b.name}</div>
                        <div className="text-xs text-ash mt-0.5">{b.desc}</div>
                        <div className="text-[11px] mt-1 text-[var(--accent)]">{b.perk}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Section>
        )}

        {step === "personality" && (
          <Section title="How you carry yourself" arabic="الطبع">
            <div className="grid gap-2">
              {personalities.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id)}
                  className={`text-left panel ${
                    personality === p.id ? "shadow-glow border-[var(--accent)]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="display text-base">{p.name}</div>
                      <div className="text-xs text-ash mt-0.5">{p.desc}</div>
                      <div className="text-[11px] mt-1 text-[var(--accent)]">{p.perk}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {step === "appearance" && <IntroAppearance accent={accent} />}

        {step === "accent" && (
          <Section title="Choose your accent" arabic="اللون">
            <p className="text-sm text-ash mb-3">
              The color of the world around you. You can change this later.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {accents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setAccent(a.id);
                    if (typeof window !== "undefined") {
                      const root = document.documentElement;
                      root.style.setProperty("--accent", a.c);
                      root.style.setProperty("--accent2", a.c2);
                      root.style.setProperty("--accent-bg", a.bg);
                    }
                  }}
                  className={`panel py-3 ${accent === a.id ? "shadow-glow border-[var(--accent)]" : ""}`}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-1.5"
                    style={{ background: `linear-gradient(135deg, ${a.c}, ${a.c2})` }}
                  />
                  <div className="text-xs text-center">{a.name}</div>
                </button>
              ))}
            </div>

            <div className="panel mt-4">
              <div className="flex items-center gap-3">
                <Avatar
                  appearance={state.appearance}
                  accent={accent}
                  size={64}
                  ring
                />
                <div className="flex-1 min-w-0">
                  <div className="display text-lg">
                    {honorific ? honorific + " " : ""}
                    {givenName || "—"}
                  </div>
                  <div className="text-xs text-ash">
                    {classes.find((c) => c.id === classId)?.en}
                    {bgId && bgList.find((b) => b.id === bgId)
                      ? ` · ${bgList.find((b) => b.id === bgId)?.name}`
                      : ""}
                    {personality
                      ? ` · ${personalities.find((p) => p.id === personality)?.name}`
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </Section>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur border-t border-line/70 px-4 py-3">
        <div className="max-w-page mx-auto flex items-center justify-between">
          <button onClick={back} disabled={idx === 0} className="btn btn-ghost disabled:opacity-30">
            Back
          </button>
          {step !== "accent" ? (
            <button
              onClick={next}
              disabled={
                (step === "name" && !givenName.trim()) ||
                (step === "class" && !classId) ||
                (step === "background" && !bgId) ||
                (step === "personality" && !personality)
              }
              className="btn btn-primary disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={commitAndStart}
              disabled={
                !givenName.trim() || !classId || !bgId || !personality
              }
              className="btn btn-primary disabled:opacity-50"
            >
              Begin
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function Section({
  title,
  arabic,
  children,
}: {
  title: string;
  arabic?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-3 fade-in">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="display text-xl">{title}</h2>
        {arabic && <span className="arabic text-base text-ash">{arabic}</span>}
      </div>
      {children}
    </section>
  );
}
