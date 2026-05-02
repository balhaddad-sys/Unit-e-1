"use client";

import Avatar from "./Avatar";
import { useGame } from "@/engine/store";
import { progressionTitle } from "@/data/milestones";
import { currentAct } from "@/engine/progression";

export default function Header() {
  const s = useGame((g) => g.state);

  const score = s.stats.wasta + s.stats.rep + (s.questsDone || 0) * 10;
  const title = progressionTitle(score).en;
  const act = currentAct(s);
  const fullName =
    `${s.honorific ? s.honorific + " " : ""}${s.givenName || "—"}`.trim();

  return (
    <header className="px-4 pt-4 pb-3 border-b border-line/60 bg-cream sticky top-0 z-20 backdrop-blur">
      <div className="max-w-page mx-auto flex items-center gap-3">
        <Avatar appearance={s.appearance} accent={s.accent} size={48} ring />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="display text-lg leading-tight truncate">{fullName}</h1>
            <span className="chip">{title}</span>
          </div>
          <div className="text-xs text-ash mt-0.5 truncate">
            <span className="arabic mr-1">{act.arabic}</span>
            <span>· Act {act.n} · {act.title}</span>
            <span className="mx-1.5 opacity-50">·</span>
            <span>Day {s.day}</span>
          </div>
        </div>
      </div>

      <div className="max-w-page mx-auto mt-3 grid grid-cols-4 gap-2">
        <Stat label="Wasta" value={s.stats.wasta} />
        <Stat label="Rep" value={s.stats.rep} />
        <Stat label="KD" value={s.stats.money} />
        <Stat label="Energy" value={s.stats.energy} />
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center bg-card rounded-xl border border-line/70 py-1.5 px-1">
      <div className="stat-num text-sm font-semibold text-ink">{value}</div>
      <div className="text-[10px] tracking-wide uppercase text-muted">{label}</div>
    </div>
  );
}
