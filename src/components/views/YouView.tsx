"use client";

import Avatar from "@/components/Avatar";
import { useGame } from "@/engine/store";
import { TRAIT_LABELS } from "@/engine/traits";
import { milestones, progressionTitle } from "@/data/milestones";
import { classes } from "@/data/classes";
import { backgrounds } from "@/data/backgrounds";
import { personalities } from "@/data/personalities";
import { accents } from "@/data/accents";
import { determineEnding } from "@/data/endings";

export default function YouView() {
  const setState = useGame((s) => s.setState);
  const reset = useGame((s) => s.reset);
  const state = useGame((s) => s.state);

  const cls = classes.find((c) => c.id === state.classId);
  const bg = state.bg ? backgrounds[state.classId]?.find((b) => b.id === state.bg) : null;
  const personality = personalities.find((p) => p.id === state.personality);

  const score = state.stats.wasta + state.stats.rep + (state.questsDone || 0) * 10;
  const title = progressionTitle(score).en;

  const ending = state.actsCompleted.length >= 5 ? determineEnding(state) : null;

  return (
    <div className="px-4 pt-4 pb-24 max-w-page mx-auto fade-in">
      <section className="panel mb-4">
        <div className="flex items-center gap-3">
          <Avatar appearance={state.appearance} accent={state.accent} size={84} ring />
          <div className="flex-1 min-w-0">
            <div className="display text-xl">
              {state.honorific ? state.honorific + " " : ""}
              {state.givenName || "—"}
            </div>
            <div className="text-xs text-ash">
              {cls?.en} · {bg?.name} · {personality?.name}
            </div>
            <div className="text-xs text-[var(--accent)] mt-0.5">{title}</div>
          </div>
        </div>
      </section>

      <Section title="Traits" arabic="السمات">
        {state.traits.length === 0 ? (
          <p className="text-sm text-ash">
            Your character is undefined. The choices you make will shape who you become.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {state.traits.map((t) => {
              const label = TRAIT_LABELS[t];
              return (
                <div key={t} className="panel py-2 px-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-sm">{label.name}</div>
                    <span className="arabic text-xs text-ash">{label.ar}</span>
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">{label.desc}</div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Factions">
        <div className="grid grid-cols-2 gap-2">
          {(["merchants", "government", "tribal", "religious"] as const).map((k) => (
            <div key={k} className="panel py-2 px-3">
              <div className="flex items-baseline justify-between">
                <div className="text-sm capitalize">{k}</div>
                <div className="stat-num text-sm">{state.factions[k]}</div>
              </div>
              <div className="mt-1 h-1.5 bg-line/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)]"
                  style={{ width: `${Math.max(0, Math.min(100, (state.factions[k] + 30) * 1.6))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Milestones">
        <div className="grid grid-cols-2 gap-2">
          {milestones.map((m) => {
            const ok = state.milestonesUnlocked.includes(m.id);
            return (
              <div
                key={m.id}
                className={`panel py-2 px-3 text-sm ${ok ? "" : "opacity-50"}`}
              >
                <div className="flex items-baseline justify-between gap-1">
                  <span>{ok ? "✓" : "○"}</span>
                  <span className="flex-1 text-xs">{m.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Favors">
        {state.favors.length === 0 ? (
          <p className="text-sm text-ash">The ledger is empty.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {state.favors.slice(-12).map((f, i) => (
              <li key={i} className="flex items-baseline gap-2">
                <span
                  className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${
                    f.kind === "owedToYou"
                      ? "border-[var(--accent)]/50 text-[var(--accent)]"
                      : "border-line text-ash"
                  }`}
                >
                  {f.kind === "owedToYou" ? "owed" : "owe"}
                </span>
                <span className="flex-1 truncate">
                  {f.who} <span className="text-muted">({f.weight})</span>
                </span>
                {f.reason && (
                  <span className="text-[11px] text-ash truncate max-w-[40%]">
                    {f.reason}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Accent">
        <div className="grid grid-cols-3 gap-2">
          {accents.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setState((s) => {
                  s.accent = a.id;
                });
                if (typeof window !== "undefined") {
                  document.documentElement.style.setProperty("--accent", a.c);
                  document.documentElement.style.setProperty("--accent2", a.c2);
                  document.documentElement.style.setProperty("--accent-bg", a.bg);
                }
              }}
              className={`panel py-2 ${state.accent === a.id ? "shadow-glow border-[var(--accent)]" : ""}`}
            >
              <div
                className="w-7 h-7 rounded-full mx-auto mb-1"
                style={{ background: `linear-gradient(135deg, ${a.c}, ${a.c2})` }}
              />
              <div className="text-xs text-center">{a.name}</div>
            </button>
          ))}
        </div>
      </Section>

      {ending && (
        <Section title={`Ending: ${ending.title}`} arabic={ending.arabic}>
          <p className="serif text-sm leading-relaxed whitespace-pre-line">
            {ending.epilogue}
          </p>
          <button onClick={reset} className="btn btn-primary mt-3">
            Begin again
          </button>
        </Section>
      )}

      <Section title="Save">
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm("Erase save and start over?")) reset();
            }}
            className="btn btn-danger"
          >
            Reset everything
          </button>
        </div>
      </Section>
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
    <section className="mb-5">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="display text-lg">{title}</h3>
        {arabic && <span className="arabic text-sm text-ash">{arabic}</span>}
      </div>
      {children}
    </section>
  );
}
