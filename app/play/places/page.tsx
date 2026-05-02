"use client";

import { useGameStore } from "@/lib/store";
import { zones } from "@/lib/data/zones";
import { showStatDelta } from "@/components/ui/RewardStack";

export default function PlacesPage() {
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);
  if (!state) return null;

  function travel(zoneId: typeof zones[number]["id"], cost: number) {
    if (state!.location === zoneId) return;
    if (state!.stats.energy < cost) return;
    dispatch({ type: "TRAVEL", to: zoneId, energyCost: cost });
    dispatch({ type: "ADVANCE_TIME", hours: 1 });
    if (cost) showStatDelta("energy", -cost);
  }

  return (
    <div className="space-y-2.5">
      <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
        الأماكن
      </div>
      {zones.map((z) => {
        const isHere = state.location === z.id;
        const tooTired = state.stats.energy < z.cost && !isHere;
        return (
          <button
            key={z.id}
            onClick={() => travel(z.id, z.cost)}
            disabled={isHere || tooTired}
            className={`w-full text-right p-4 rounded-2xl flex items-center gap-3 transition-all ${
              isHere
                ? "bg-accent/10 border-2 border-accent"
                : tooTired
                  ? "bg-surface opacity-40"
                  : "bg-surface border border-surface-3 active:scale-[0.99]"
            }`}
          >
            <div className="text-2xl">{z.icon}</div>
            <div className="flex-1">
              <div className="font-bold">{z.nameAr}</div>
              <div className="text-xs text-ink-3 mt-0.5">{z.descAr}</div>
            </div>
            <div className="text-xs text-ink-3">
              {isHere ? <span className="text-accent font-semibold">هنا</span> : `⌇ ${z.cost}`}
            </div>
          </button>
        );
      })}
    </div>
  );
}
