"use client";

import type { Stats } from "@/lib/types";

interface Props {
  stats: Stats;
}

/**
 * StatsBar — the four core stats, persistent at top of every game screen.
 */
export function StatsBar({ stats }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-3" dir="rtl">
      <Stat label="واسطة" value={stats.wasta} icon="★" tint="text-accent" />
      <Stat label="فلوس" value={stats.money} icon="د.ك" tint="text-gold" />
      <Stat label="سمعة" value={stats.rep} icon="◐" tint="text-ink" />
      <Stat label="طاقة" value={stats.energy} icon="⌇" tint="text-accent" />
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  tint,
}: {
  label: string;
  value: number;
  icon: string;
  tint: string;
}) {
  return (
    <button className="bg-surface rounded-xl py-2.5 px-2 flex flex-col items-center gap-0.5 active:scale-95 transition-transform">
      <div className={`text-[13px] ${tint} font-semibold`}>{icon}</div>
      <div className="text-base font-bold text-ink">{value}</div>
      <div className="text-[10px] text-ink-3">{label}</div>
    </button>
  );
}
