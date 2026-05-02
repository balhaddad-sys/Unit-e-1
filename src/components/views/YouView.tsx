"use client";

import { useGame } from "@/engine/store";
import { Avatar } from "@/components/Avatar";
import { TRAIT_LABELS } from "@/engine/traits";
import { classes } from "@/data/classes";
import { backgrounds } from "@/data/backgrounds";
import { personalities } from "@/data/personalities";
import { milestones } from "@/data/milestones";

export function YouView() {
  const s = useGame((g) => g.state);
  const reset = useGame((g) => g.reset);
  const cls = classes.find((c) => c.id === s.classId);
  const bg = backgrounds.find((b) => b.id === s.bg);
  const pers = personalities.find((p) => p.id === s.personality);

  const honorific = s.honorific && s.givenName ? `${s.honorific} ${s.givenName}` : s.givenName || "—";

  return (
    <div className="space-y-4 fade-in">
      <section className="card p-5">
        <div className="flex gap-4 items-start">
          <Avatar appearance={s.appearance} size={120} />
          <div className="flex-1 min-w-0">
            <div className="serif text-2xl">{honorific}</div>
            <div className="text-xs text-[var(--muted)]">{cls?.en} · {bg?.name} · {pers?.name}</div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <Stat label="Wasta" value={s.stats.wasta} />
              <Stat label="Money (KD)" value={s.stats.money} />
              <Stat label="Reputation" value={s.stats.rep} />
              <Stat label="Energy" value={s.stats.energy} />
            </div>
          </div>
        </div>
      </section>

      <section className="card p-4">
        <h3 className="serif text-base mb-3">Factions</h3>
        <div className="space-y-2">
          {(["merchants", "government", "tribal", "religious"] as const).map((f) => (
            <div key={f}>
              <div className="flex justify-between text-xs">
                <span className="capitalize">{f}</span>
                <span className="tabular-nums">{s.factions[f]}</span>
              </div>
              <div className="h-1.5 bg-[var(--line)] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-emerald" style={{ width: `${Math.max(0, Math.min(100, s.factions[f]))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h3 className="serif text-base mb-3">Who you are becoming</h3>
        {s.traits.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">You haven't yet been marked. Choices are coming.</p>
        ) : (
          <div className="space-y-2">
            {s.traits.map((t) => {
              const lab = TRAIT_LABELS[t];
              return (
                <div key={t} className="flex items-baseline gap-2">
                  <span className="font-semibold">{lab.name}</span>
                  <span className="ar text-xs text-[var(--muted)]">{lab.ar}</span>
                  <span className="text-xs text-[var(--muted)]">— {lab.desc}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card p-4">
        <h3 className="serif text-base mb-3">Favors</h3>
        {s.favors.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No outstanding favors. Yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {s.favors.map((f, i) => (
              <li key={i} className="text-sm">
                <span className={f.kind === "owedToYou" ? "text-emerald" : "text-[var(--muted)]"}>
                  {f.kind === "owedToYou" ? "Owed to you" : "You owe"}
                </span>
                {" · "}{f.who} · {f.weight}
                {f.reason && <span className="text-xs text-[var(--muted)]"> — {f.reason}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-4">
        <h3 className="serif text-base mb-3">Milestones</h3>
        <div className="space-y-1">
          {milestones.map((m) => (
            <div key={m.id} className="flex items-center gap-2 text-sm">
              <span className={`w-3.5 h-3.5 rounded-full ${s.milestonesUnlocked.includes(m.id) ? "bg-emerald" : "bg-[var(--line)]"}`} />
              <span className={s.milestonesUnlocked.includes(m.id) ? "" : "text-[var(--muted)]"}>{m.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h3 className="serif text-base mb-3">Settings</h3>
        <button
          className="btn"
          onClick={() => {
            if (typeof window !== "undefined" && window.confirm("Reset everything and start over?")) {
              reset();
              window.location.reload();
            }
          }}
        >
          Start over
          <div className="text-xs text-[var(--muted)] mt-0.5">Wipes your save. The face you've worn dissolves.</div>
        </button>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[var(--line)] rounded-lg px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className="font-semibold tabular-nums">{value}</div>
    </div>
  );
}
