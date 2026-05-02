"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { computeNextGoal } from "@/lib/engine/goalCompute";
import { GoalBar } from "@/components/ui/GoalBar";
import { StatsBar } from "@/components/ui/StatsBar";
import { TabBar } from "@/components/ui/TabBar";
import { RewardStack } from "@/components/ui/RewardStack";
import { LevelUpBanner } from "@/components/ui/LevelUpBanner";
import { NotifBell } from "@/components/ui/NotifFeed";

/**
 * /play/* — game shell.
 * Persists stats, goal bar, and tab bar across all game routes.
 */
export default function GameLayout({ children }: { children: React.ReactNode }) {
  const state = useGameStore((s) => s.state);
  const hydrate = useGameStore((s) => s.hydrate);
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    // If no save, send to landing
    if (state === null) {
      // small grace period for hydration
      const t = setTimeout(() => {
        if (useGameStore.getState().state === null) router.replace("/");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  if (!state) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-ink-3 text-sm">جاري التحميل...</div>
      </main>
    );
  }

  const goal = computeNextGoal(state);

  return (
    <div
      className="min-h-screen bg-bg pb-[calc(var(--safe-bottom)+72px)]"
      dir="rtl"
    >
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur-sm pt-[var(--safe-top)] border-b border-surface-3">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div>
            <div className="text-xs text-ink-3">صباح الخير</div>
            <div className="text-base font-bold">
              {state.character.honorific ? `${state.character.honorific} ` : ""}
              {state.character.givenName}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-surface-2 rounded-full px-3 py-1 text-xs font-medium text-ink-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>اليوم {state.day}</span>
              <span>·</span>
              <span>{String(state.time).padStart(2, "0")}:00</span>
            </div>
            <NotifBell />
          </div>
        </div>
        <StatsBar stats={state.stats} />
      </header>

      <main className="px-4 pt-3">
        {goal && (
          <GoalBar
            goal={goal}
            onTap={() => {
              if ("tab" in goal.target) router.push(`/play/${goal.target.tab === "home" ? "" : goal.target.tab}`);
              if ("rest" in goal.target) {
                useGameStore.getState().dispatch({ type: "REST" });
              }
              if ("travel" in goal.target) {
                // Travel handled in places page
                router.push("/play/places");
              }
            }}
          />
        )}
        {children}
      </main>

      <RewardStack />
      <LevelUpBanner />
      <TabBar />
    </div>
  );
}
