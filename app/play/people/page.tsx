"use client";

import { useGameStore } from "@/lib/store";
import { npcs } from "@/lib/data/npcs";
import { relTier } from "@/lib/engine/initialState";
import { showStatDelta } from "@/components/ui/RewardStack";
import { showLevelUp } from "@/components/ui/LevelUpBanner";

export default function PeoplePage() {
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);
  const pushNotif = useGameStore((s) => s.pushNotif);

  if (!state) return null;

  const here = npcs.filter((n) => n.zone === state.location);

  function greet(npcId: string) {
    if (state!.stats.energy < 3) return;
    const before = state!.relationships[npcId] ?? 0;
    const repGain = state!.character.personality === "generous" ? 2 : 1;
    dispatch([
      { type: "STAT_DELTA", stat: "energy", amount: -3 },
      { type: "REL_DELTA", npc: npcId, amount: 1 },
      { type: "STAT_DELTA", stat: "rep", amount: repGain },
      { type: "REMEMBER_NPC", npc: npcId, text: "سلّمت عليه" },
      { type: "ADVANCE_TIME", hours: 1 },
    ]);
    showStatDelta("rep", repGain);
    const after = before + 1;
    if (relTier(after).n > relTier(before).n) {
      const npc = npcs.find((n) => n.id === npcId)!;
      showLevelUp(`${npc.nameAr} · ${relTier(after).name}`);
      pushNotif("✦", `${npc.nameAr} صار ${relTier(after).name}`, "milestone");
    }
  }

  function help(npcId: string) {
    if (state!.stats.energy < 8) return;
    const before = state!.relationships[npcId] ?? 0;
    const repGain = state!.character.personality === "generous" ? 2 : 1;
    dispatch([
      { type: "STAT_DELTA", stat: "energy", amount: -8 },
      { type: "REL_DELTA", npc: npcId, amount: 2 },
      { type: "STAT_DELTA", stat: "wasta", amount: 1 },
      { type: "STAT_DELTA", stat: "rep", amount: repGain },
      { type: "ADD_FAVOR", favor: { who: npcId, kind: "owedToYou", day: state!.day } },
      { type: "REMEMBER_NPC", npc: npcId, text: "ساعدته" },
      { type: "ADVANCE_TIME", hours: 2 },
    ]);
    showStatDelta("wasta", 1);
    showStatDelta("rep", repGain);
    const after = before + 2;
    const npc = npcs.find((n) => n.id === npcId)!;
    pushNotif("♥", `ساعدت ${npc.nameAr} · يَدين لك`, "positive");
    if (relTier(after).n > relTier(before).n) {
      showLevelUp(`${npc.nameAr} · ${relTier(after).name}`);
    }
    // Auto-unlock chain at 70+
    if (after >= 70 && !state!.personalChains[npcId]?.unlocked) {
      dispatch({ type: "UNLOCK_CHAIN", npc: npcId });
      showLevelUp(`قصة جديدة: ${npc.nameAr}`, "♥");
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
        من هنا · {here.length} {here.length === 1 ? "شخص" : "أشخاص"}
      </div>

      {here.length === 0 && (
        <div className="bg-surface-2 rounded-2xl p-6 text-center text-ink-3 italic text-sm">
          ما في أحد هنا. سافر مكان فيه ناس.
        </div>
      )}

      {here.map((n) => {
        const rel = state.relationships[n.id] ?? n.baseRel;
        const tier = relTier(rel);
        return (
          <div key={n.id} className="bg-surface rounded-2xl p-4 border border-surface-3">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white`}
                style={{ background: factionTint(n.faction) }}
              >
                {n.initial}
              </div>
              <div className="flex-1">
                <div className="font-bold">{n.nameAr}</div>
                <div className="text-xs text-ink-3">{n.roleAr}</div>
              </div>
              <div className="bg-surface-2 px-2.5 py-1 rounded-full text-xs font-medium">
                {tier.name}
              </div>
            </div>
            {/* Relationship bar */}
            <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${Math.min(100, rel)}%` }}
              />
            </div>
            <div className="text-xs text-ink-2 italic mb-3">{n.goalAr}</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => greet(n.id)}
                className="bg-surface-2 text-ink py-2 rounded-full text-sm font-medium active:scale-95"
              >
                سلّم
              </button>
              <button
                disabled={!state.favors.some((f) => f.who === n.id && f.kind === "owedToYou")}
                className="bg-surface-2 text-ink py-2 rounded-full text-sm font-medium active:scale-95 disabled:opacity-40"
              >
                اطلب خدمة
              </button>
              <button
                onClick={() => help(n.id)}
                className="bg-accent text-white py-2 rounded-full text-sm font-semibold active:scale-95"
              >
                ساعده
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function factionTint(faction: string) {
  switch (faction) {
    case "tribal": return "#a1654a";
    case "merchants": return "#9b6f2e";
    case "government": return "#4a6f9b";
    case "religious": return "#6f4a9b";
    default: return "#847f74";
  }
}
