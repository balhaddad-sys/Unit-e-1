"use client";

import { useGame } from "@/engine/store";
import type { StoryQuest } from "@/lib/types";
import { hasTrait } from "@/engine/traits";
import { applyReward } from "@/engine/rewards";
import { addTrait } from "@/engine/traits";
import { ensureStoryQuestEntry } from "@/engine/progression";

export default function StoryQuestPanel({
  quest,
  onChoiceMade,
}: {
  quest: StoryQuest;
  onChoiceMade: () => void;
}) {
  const setState = useGame((s) => s.setState);
  const state = useGame((s) => s.state);

  const entry = state.storyQuests.find((q) => q.id === quest.id);
  const allDone = entry?.stepsCompleted.every((b) => b);
  const completed = entry?.completed;

  function choose(optionId: string) {
    const opt = quest.branch?.options.find((o) => o.id === optionId);
    if (!opt) return;
    if (opt.requiresTrait && !hasTrait(state, opt.requiresTrait)) return;
    if (opt.forbidsTrait && hasTrait(state, opt.forbidsTrait)) return;

    setState((s) => {
      const e = ensureStoryQuestEntry(s, quest.id);
      if (e) {
        e.branchChoice = optionId;
        e.completed = true;
      }
      applyReward(s, quest.rewards);
      opt.effect(s);
      if (opt.gainsTrait) addTrait(s, opt.gainsTrait);
      s.story.push({ day: s.day, time: s.time, text: `${quest.title}: ${opt.label}` });
    });

    onChoiceMade();
  }

  return (
    <section className="panel mb-3 border-[var(--accent)]/40">
      <div className="flex items-baseline justify-between mb-1">
        <div className="display text-base">★ {quest.title}</div>
        <span className="arabic text-sm text-ash">{quest.arabic}</span>
      </div>
      <p className="text-sm text-ash leading-relaxed mb-3">{quest.desc}</p>

      <ol className="space-y-1.5 mb-3">
        {quest.steps.map((step, i) => {
          const ok = entry?.stepsCompleted[i] || false;
          return (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span
                className={`mt-0.5 inline-block w-3.5 h-3.5 rounded-full border ${
                  ok ? "bg-[var(--accent)] border-[var(--accent)]" : "border-line"
                }`}
              />
              <span className={ok ? "text-ash line-through" : "text-ink"}>{step.label}</span>
            </li>
          );
        })}
      </ol>

      {completed && (
        <p className="text-sm italic text-ash leading-relaxed">{quest.closing}</p>
      )}

      {allDone && !completed && quest.branch && (
        <div className="mt-3 border-t border-line/70 pt-3">
          <div className="text-xs uppercase tracking-wide text-muted mb-2">
            {quest.branch.prompt}
          </div>
          <div className="grid gap-2">
            {quest.branch.options.map((opt) => {
              const blocked =
                (opt.requiresTrait && !hasTrait(state, opt.requiresTrait)) ||
                (opt.forbidsTrait && hasTrait(state, opt.forbidsTrait));
              return (
                <button
                  key={opt.id}
                  onClick={() => choose(opt.id)}
                  disabled={!!blocked}
                  className={`text-left p-3 rounded-xl border ${
                    blocked
                      ? "opacity-40 border-line bg-cream"
                      : "border-line bg-card hover:bg-[var(--accent-bg)]"
                  }`}
                >
                  <div className="text-sm text-ink">{opt.label}</div>
                  {opt.gainsTrait && (
                    <div className="text-[11px] text-[var(--accent)] mt-0.5">
                      gains: {opt.gainsTrait}
                    </div>
                  )}
                  {blocked && (
                    <div className="text-[10px] text-muted mt-0.5">
                      requires: {opt.requiresTrait || `not ${opt.forbidsTrait}`}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
