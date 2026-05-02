"use client";

import type { NPC } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { appearanceForNpc } from "@/engine/npcAppearance";
import { useGame } from "@/engine/store";

export function NpcCard({
  npc,
  onClick,
}: {
  npc: NPC;
  onClick?: (npc: NPC) => void;
}) {
  const rel = useGame((g) => g.state.relationships[npc.name] || npc.baseRel);
  const appearance = appearanceForNpc(npc);
  return (
    <button className="card p-3 w-full text-left" onClick={() => onClick?.(npc)}>
      <div className="flex items-center gap-3">
        <Avatar appearance={appearance} size={56} />
        <div className="flex-1 min-w-0">
          <div className="serif text-base truncate">{npc.name}</div>
          <div className="text-xs text-[var(--muted)] truncate">{npc.role}</div>
          <div className="mt-1.5 h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
            <div className="h-full bg-emerald" style={{ width: `${Math.max(0, Math.min(100, rel))}%` }} />
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{relLabel(rel)}</div>
          <div className="text-sm tabular-nums">{Math.max(0, Math.min(100, rel))}</div>
        </div>
      </div>
    </button>
  );
}

function relLabel(v: number) {
  if (v >= 90) return "Family";
  if (v >= 70) return "Close";
  if (v >= 50) return "Friendly";
  if (v >= 30) return "Known";
  if (v >= 15) return "Acquainted";
  return "Stranger";
}
