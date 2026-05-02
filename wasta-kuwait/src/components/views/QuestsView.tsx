"use client";

import { useGame } from "@/engine/store";
import { storyQuests } from "@/data/storyQuests";
import { personalChains } from "@/data/personalChains";
import { currentAct } from "@/engine/progression";
import { hasTrait } from "@/engine/traits";

export default function QuestsView() {
  const state = useGame((s) => s.state);
  const act = currentAct(state);

  const acts = storyQuests.map((q) => {
    const e = state.storyQuests.find((x) => x.id === q.id);
    return { q, e };
  });

  return (
    <div className="px-4 pt-4 pb-24 max-w-page mx-auto fade-in">
      <h2 className="display text-xl mb-3">Story Quests</h2>
      <div className="grid gap-2 mb-5">
        {acts.map(({ q, e }) => {
          const isCurrent = q.act === act.id;
          return (
            <div
              key={q.id}
              className={`panel ${isCurrent ? "border-[var(--accent)]/40" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="display text-sm">{q.title}</div>
                <span className="arabic text-xs text-ash">{q.arabic}</span>
              </div>
              <div className="text-[11px] text-muted">
                Act ·{" "}
                {e?.completed
                  ? "complete"
                  : isCurrent
                  ? "in progress"
                  : state.actsCompleted.includes(q.act)
                  ? "skipped"
                  : "future"}
              </div>
              <div className="text-[12px] text-ash mt-1 line-clamp-2">{q.desc}</div>
            </div>
          );
        })}
      </div>

      <h2 className="display text-xl mb-3">Personal Chains</h2>
      <div className="grid gap-2">
        {Object.values(personalChains).map((ch) => {
          const p = state.personalProgress[ch.npc];
          const blocked =
            (ch.requiresTrait && !hasTrait(state, ch.requiresTrait)) ||
            (ch.forbidsTrait && hasTrait(state, ch.forbidsTrait));
          return (
            <div
              key={ch.npc}
              className={`panel ${blocked ? "opacity-50" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="display text-sm">{ch.title}</div>
                <span className="arabic text-xs text-ash">{ch.arabic}</span>
              </div>
              <div className="text-[11px] text-muted">
                {ch.npc} ·{" "}
                {p?.completed
                  ? "complete"
                  : p?.unlocked
                  ? `step ${p.step + 1}/${ch.steps.length}`
                  : blocked
                  ? "locked"
                  : `relationship ${state.relationships[ch.npc] || 0} / 50`}
              </div>
              <div className="text-[12px] text-ash mt-1 line-clamp-2">{ch.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
