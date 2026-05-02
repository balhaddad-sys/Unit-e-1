"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store";
import { npcs } from "@/lib/data/npcs";
import { relTier } from "@/lib/engine/initialState";
import { showStatDelta, showReward } from "@/components/ui/RewardStack";
import { showLevelUp } from "@/components/ui/LevelUpBanner";
import type { GameEvent } from "@/lib/types";

/**
 * The people page is the core loop.
 *
 * Action menu:
 *   • سلّم (greet)         — 3 energy → +2 rel, +1 rep
 *   • شرّب قهوة (coffee)    — 5 energy + 30 KD → +5 rel, +1 wasta
 *   • ساعده (help)         — 8 energy → +6 rel, +1 wasta, owed-favor
 *   • اعزمه (treat)        — 8 energy + 80 KD → +8 rel, +2 rep, +1 wasta
 *   • هدية (gift)          — 12 energy + 200 KD → +12 rel, +3 rep
 *   • تكلم بصراحة (deep)   — 10 energy → +10 rel  [unlocks at rel 50]
 *
 * Chain unlocks at 70 rel — reachable in 8-12 actions, not 35.
 */
export default function PeoplePage() {
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);
  const pushNotif = useGameStore((s) => s.pushNotif);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!state) return null;

  const here = npcs.filter((n) => n.zone === state.location);

  function performAction(
    npcId: string,
    relGain: number,
    energyCost: number,
    moneyCost: number,
    repGain: number,
    wastaGain: number,
    addsFavor: boolean,
    memoryText: string
  ) {
    if (!state) return;
    if (state.stats.energy < energyCost) {
      showReward("ما عندك طاقة كافية", "negative", "✕");
      return;
    }
    if (state.stats.money < moneyCost) {
      showReward("ما عندك فلوس كافية", "negative", "✕");
      return;
    }

    const before = state.relationships[npcId] ?? 0;
    const personalityRepBonus = state.character.personality === "generous" ? 1 : 0;
    const totalRep = repGain + personalityRepBonus;

    const events: GameEvent[] = [
      { type: "STAT_DELTA", stat: "energy", amount: -energyCost },
      { type: "REL_DELTA", npc: npcId, amount: relGain },
      { type: "REMEMBER_NPC", npc: npcId, text: memoryText },
      { type: "ADVANCE_TIME", hours: Math.max(1, Math.floor(energyCost / 4)) },
    ];
    if (moneyCost) events.push({ type: "STAT_DELTA", stat: "money", amount: -moneyCost });
    if (totalRep) events.push({ type: "STAT_DELTA", stat: "rep", amount: totalRep });
    if (wastaGain) events.push({ type: "STAT_DELTA", stat: "wasta", amount: wastaGain });
    if (addsFavor)
      events.push({
        type: "ADD_FAVOR",
        favor: { who: npcId, kind: "owedToYou", day: state.day },
      });

    dispatch(events);

    const npc = npcs.find((n) => n.id === npcId)!;
    showReward(`+${relGain} مع ${npc.nameAr}`, "positive", "♥");
    if (totalRep) showStatDelta("rep", totalRep);
    if (wastaGain) showStatDelta("wasta", wastaGain);
    if (moneyCost) showStatDelta("money", -moneyCost);

    const after = Math.min(100, before + relGain);
    if (relTier(after).n > relTier(before).n) {
      showLevelUp(`${npc.nameAr} · ${relTier(after).name}`);
      pushNotif("✦", `${npc.nameAr} صار ${relTier(after).name}`, "milestone");
    }
    if (after >= 70 && !state.personalChains[npcId]?.unlocked) {
      dispatch({ type: "UNLOCK_CHAIN", npc: npcId });
      showLevelUp(`قصة جديدة: ${npc.nameAr}`, "♥");
      pushNotif("♥", `قصة جديدة انفتحت مع ${npc.nameAr}`, "milestone");
    }

    setExpandedId(null);
  }

  function consumeFavor(npcId: string) {
    if (!state) return;
    const npc = npcs.find((n) => n.id === npcId)!;
    const moneyBonus = state.character.personality === "discreet" ? 50 : 0;
    dispatch([
      { type: "CONSUME_FAVOR", npc: npcId },
      { type: "STAT_DELTA", stat: "wasta", amount: 5 },
      { type: "STAT_DELTA", stat: "money", amount: 120 + moneyBonus },
    ]);
    showStatDelta("wasta", 5);
    showStatDelta("money", 120 + moneyBonus);
    pushNotif("✦", `${npc.nameAr} ردّ المعروف`, "positive");
    setExpandedId(null);
  }

  return (
    <div className="space-y-3 font-ar">
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
          من هنا
        </div>
        <div className="text-[11px] text-ink-3">
          {here.length} {here.length === 1 ? "شخص" : "أشخاص"}
        </div>
      </div>

      {here.length === 0 && (
        <div className="bg-surface-2 rounded-2xl p-6 text-center text-ink-3 italic text-sm">
          ما في أحد هنا. سافر مكان فيه ناس.
        </div>
      )}

      {here.map((n) => {
        const rel = state.relationships[n.id] ?? n.baseRel;
        const tier = relTier(rel);
        const owesYou = state.favors.some(
          (f) => f.who === n.id && f.kind === "owedToYou"
        );
        const isExpanded = expandedId === n.id;
        const memory = state.npcMemory[n.id] ?? [];

        return (
          <div
            key={n.id}
            className="bg-surface rounded-2xl border border-surface-3 overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : n.id)}
              className="w-full text-right p-4 active:bg-surface-2 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: factionTint(n.faction) }}
                >
                  {n.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold flex items-center gap-2">
                    {n.nameAr}
                    {owesYou && (
                      <span className="text-gold text-[11px]">★ يَدين لك</span>
                    )}
                  </div>
                  <div className="text-xs text-ink-3">{n.roleAr}</div>
                </div>
                <div className="bg-surface-2 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0">
                  {tier.name}
                </div>
              </div>

              <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${Math.min(100, rel)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-ink-3">
                <span>{rel} / 100</span>
                {rel < 70 && !state.personalChains[n.id]?.unlocked && (
                  <span>{70 - rel} للقصة</span>
                )}
                {state.personalChains[n.id]?.unlocked && (
                  <span className="text-accent font-semibold">القصة مفتوحة ♥</span>
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-surface-2 p-4 bg-surface-2/30">
                <div className="text-xs text-ink-2 italic mb-3 leading-relaxed">
                  {n.goalAr}
                </div>

                {memory.length > 0 && (
                  <div className="mb-3 pb-3 border-b border-surface-2/60">
                    <div className="text-[10px] text-ink-3 font-semibold uppercase tracking-wider mb-1.5">
                      آخر مرة شفته
                    </div>
                    {memory.slice(0, 2).map((m, i) => (
                      <div key={i} className="text-xs text-ink-2 mb-0.5">
                        <span className="text-ink-3">اليوم {m.day} ·</span> {m.text}
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2">
                  <ActionButton
                    label="سلّم"
                    sublabel="حديث قصير"
                    relGain={2}
                    energy={3}
                    money={0}
                    canAfford={state.stats.energy >= 3}
                    onClick={() =>
                      performAction(n.id, 2, 3, 0, 1, 0, false, "سلّمت عليه")
                    }
                  />
                  <ActionButton
                    label="شرّب قهوة"
                    sublabel="فنجان جنب الكورنيش"
                    relGain={5}
                    energy={5}
                    money={30}
                    canAfford={state.stats.money >= 30 && state.stats.energy >= 5}
                    onClick={() =>
                      performAction(
                        n.id,
                        5,
                        5,
                        30,
                        1,
                        1,
                        false,
                        "شربنا قهوة على الكورنيش"
                      )
                    }
                  />
                  <ActionButton
                    label="ساعده"
                    sublabel="معروف يَدين لك فيه بعدين"
                    relGain={6}
                    energy={8}
                    money={0}
                    highlight
                    canAfford={state.stats.energy >= 8}
                    onClick={() =>
                      performAction(n.id, 6, 8, 0, 1, 1, true, "ساعدته في موقف")
                    }
                  />
                  <ActionButton
                    label="اعزمه"
                    sublabel="غدا في مطعم زين"
                    relGain={8}
                    energy={8}
                    money={80}
                    canAfford={state.stats.money >= 80 && state.stats.energy >= 8}
                    onClick={() =>
                      performAction(n.id, 8, 8, 80, 2, 1, false, "عزمته على غدا")
                    }
                  />
                  {rel >= 30 && (
                    <ActionButton
                      label="هدية"
                      sublabel="شي يخصه — يستاهل"
                      relGain={12}
                      energy={12}
                      money={200}
                      canAfford={state.stats.money >= 200 && state.stats.energy >= 12}
                      onClick={() =>
                        performAction(
                          n.id,
                          12,
                          12,
                          200,
                          3,
                          0,
                          false,
                          "جبت له هدية تخصه"
                        )
                      }
                    />
                  )}
                  {rel >= 50 && (
                    <ActionButton
                      label="تكلم بصراحة"
                      sublabel="حديث طويل، صادق"
                      relGain={10}
                      energy={10}
                      money={0}
                      canAfford={state.stats.energy >= 10}
                      onClick={() =>
                        performAction(n.id, 10, 10, 0, 2, 1, false, "تحدثنا بصراحة")
                      }
                    />
                  )}
                  {owesYou && (
                    <button
                      onClick={() => consumeFavor(n.id)}
                      className="w-full bg-gold/20 border-2 border-gold text-ink p-3 rounded-xl active:scale-[0.98] transition-transform text-right"
                    >
                      <div className="font-bold text-sm">اطلب الخدمة ★</div>
                      <div className="text-[11px] text-ink-2">
                        +5 واسطة · +120 د.ك
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ActionButton({
  label,
  sublabel,
  relGain,
  energy,
  money,
  highlight,
  canAfford = true,
  onClick,
}: {
  label: string;
  sublabel: string;
  relGain: number;
  energy: number;
  money: number;
  highlight?: boolean;
  canAfford?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full text-right p-3 rounded-xl active:scale-[0.98] transition-all flex items-center justify-between ${
        !canAfford
          ? "bg-surface-2 opacity-40 cursor-not-allowed"
          : highlight
            ? "bg-accent text-white"
            : "bg-surface border border-surface-3"
      }`}
    >
      <div className="flex-1">
        <div className={`font-bold text-sm ${highlight ? "text-white" : "text-ink"}`}>
          {label}
        </div>
        <div className={`text-[11px] ${highlight ? "text-white/70" : "text-ink-3"}`}>
          {sublabel}
        </div>
      </div>
      <div className="flex flex-col items-start gap-0.5 ml-3">
        <div
          className={`text-[11px] font-bold ${
            highlight ? "text-white" : "text-accent"
          }`}
        >
          +{relGain} ♥
        </div>
        <div className={`text-[10px] ${highlight ? "text-white/60" : "text-ink-3"}`}>
          ⌇{energy}
          {money > 0 && ` · ${money} د.ك`}
        </div>
      </div>
    </button>
  );
}

function factionTint(faction: string) {
  switch (faction) {
    case "tribal":
      return "#a1654a";
    case "merchants":
      return "#9b6f2e";
    case "government":
      return "#4a6f9b";
    case "religious":
      return "#6f4a9b";
    default:
      return "#847f74";
  }
}
