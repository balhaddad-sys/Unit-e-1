"use client";

import Avatar from "@/components/Avatar";
import type { NPC } from "@/lib/types";
import { useGame } from "@/engine/store";
import { greet, askFavor, helpThem, chainAdvance } from "@/engine/actions";
import { npcAppearance } from "@/engine/npcAppearance";
import { repTier } from "@/data/milestones";
import { personalChains } from "@/data/personalChains";
import { useMemo } from "react";

export default function NpcCard({ npc }: { npc: NPC }) {
  const setState = useGame((s) => s.setState);
  const state = useGame((s) => s.state);
  const pushToast = useGame((s) => s.pushToast);
  const appearance = useMemo(() => npcAppearance(npc), [npc]);

  const rel = state.relationships[npc.name] ?? npc.baseRel;
  const tier = repTier(rel);
  const chain = personalChains[npc.name];
  const progress = state.personalProgress[npc.name];
  const hereWithMe = state.location === npc.zone;

  function call(fn: (s: any, name: string) => any) {
    setState((s) => {
      const r = fn(s, npc.name);
      if (!r.ok) pushToast(r.message);
      else s.story.push({ day: s.day, time: s.time, text: `${npc.name}: ${r.message}` });
    });
  }

  function advanceChain() {
    setState((s) => {
      const r = chainAdvance(s, npc.name);
      if (!r.ok) pushToast(r.message);
      else s.story.push({ day: s.day, time: s.time, text: `${npc.name}: ${r.message}` });
    });
  }

  return (
    <div className="panel">
      <div className="flex items-start gap-3">
        <Avatar appearance={appearance} accent={state.accent} size={56} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <div className="display text-base truncate">{npc.name}</div>
            <span className="chip">{tier.name}</span>
          </div>
          <div className="text-xs text-ash truncate">{npc.role}</div>
          <div className="text-[11px] text-muted mt-0.5 capitalize">
            {npc.faction} · {npc.zone}
          </div>
          <div className="text-xs text-ash mt-1.5 leading-snug italic">{npc.goal}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        <button
          className="btn btn-ghost text-xs"
          disabled={!hereWithMe}
          onClick={() => call(greet)}
        >
          Greet
        </button>
        <button
          className="btn btn-ghost text-xs"
          disabled={!hereWithMe}
          onClick={() => call(helpThem)}
        >
          Help
        </button>
        <button
          className="btn btn-ghost text-xs"
          disabled={!hereWithMe}
          onClick={() => call(askFavor)}
        >
          Ask favor
        </button>
        {chain && progress?.unlocked && !progress?.completed && (
          <button
            className="btn btn-primary text-xs"
            disabled={!hereWithMe || state.location !== chain.steps[progress.step].zone}
            onClick={advanceChain}
            title={chain.steps[progress.step].title}
          >
            ★ {chain.steps[progress.step].title}
          </button>
        )}
      </div>

      <div className="mt-2 h-1.5 bg-line/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all"
          style={{ width: `${Math.max(0, Math.min(100, rel))}%` }}
        />
      </div>
    </div>
  );
}
