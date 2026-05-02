"use client";

import { useGame } from "@/engine/store";
import { Avatar } from "@/components/Avatar";

export function Header() {
  const s = useGame((g) => g.state);
  const honorific = s.honorific && s.givenName ? `${s.honorific} ${s.givenName}` : s.givenName || "—";
  return (
    <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur border-b border-[var(--line)]">
      <div className="max-w-screen mx-auto px-4 py-3 flex items-center gap-3">
        <Avatar appearance={s.appearance} size={44} />
        <div className="flex-1 min-w-0">
          <div className="serif text-lg leading-tight truncate">{honorific}</div>
          <div className="text-[11px] text-[var(--muted)] flex gap-3">
            <span>Day {s.day}</span>
            <span>·</span>
            <span>{formatTime(s.time)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Pill label="Wasta" value={s.stats.wasta} />
          <Pill label="KD" value={s.stats.money} />
          <Pill label="Rep" value={s.stats.rep} />
          <Pill label="⚡" value={s.stats.energy} />
        </div>
      </div>
    </header>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-[11px] px-2 py-1 rounded-lg border border-[var(--line)] bg-white">
      <div className="text-[9px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className="font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function formatTime(t: number) {
  const h = Math.floor(t);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:00 ${ampm}`;
}
