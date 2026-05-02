"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { acts } from "@/lib/data/acts";
import { storyQuests } from "@/lib/data/quests/story";
import { sideQuestTemplates } from "@/lib/data/quests/side";
import { personalChains } from "@/lib/data/chains";
import { npcs } from "@/lib/data/npcs";
import { zones } from "@/lib/data/zones";
import { showStatDelta, showReward } from "@/components/ui/RewardStack";
import { showLevelUp } from "@/components/ui/LevelUpBanner";
import type { GameEvent } from "@/lib/types";

export default function QuestsPage() {
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);
  const pushNotif = useGameStore((s) => s.pushNotif);

  const currentActId = state
    ? acts.find((a) => !state.actsCompleted.includes(a.id))?.id
    : undefined;
  const sqMeta = storyQuests.find((q) => q.act === currentActId);
  const sqProg = state?.storyQuests.find((q) => q.id === sqMeta?.id);

  // Auto-seed side quests for current zone if not present
  useEffect(() => {
    if (!state) return;
    const here = sideQuestTemplates.filter((q) => q.zone === state.location);
    const existingIds = new Set(state.sideQuests.map((q) => q.id));
    const toAdd = here.filter((t) => !existingIds.has(t.id));
    if (toAdd.length > 0) {
      const newQuests = toAdd.map((t) => ({
        id: t.id,
        accepted: false,
        done: false,
        progress: 0,
        need: t.need,
      }));
      // Phase 2 cleanup: add a SEED_SIDE_QUESTS reducer event
      const next = { ...state, sideQuests: [...state.sideQuests, ...newQuests] };
      useGameStore.setState({ state: next });
    }
  }, [state]);

  // Story quest auto-progression
  useEffect(() => {
    if (!state || !sqMeta || !sqProg || !sqProg.started || sqProg.completed) return;
    sqMeta.steps.forEach((step, i) => {
      if (!sqProg.stepsCompleted[i] && step.check(state)) {
        dispatch({ type: "COMPLETE_STORY_QUEST_STEP", id: sqMeta.id, stepIdx: i });
        showLevelUp(`خطوة ${i + 1}: ${step.label}`, "✓");
        pushNotif("✓", `${sqMeta.title} · خطوة ${i + 1} تمت`, "positive");
      }
    });
  }, [state, sqMeta, sqProg, dispatch, pushNotif]);

  if (!state) return null;

  function startStoryQuest() {
    if (!sqMeta) return;
    // Initialize the quest in state if it's not there yet
    const existing = state!.storyQuests.find((q) => q.id === sqMeta.id);
    if (!existing) {
      const next = {
        ...state!,
        storyQuests: [
          ...state!.storyQuests,
          {
            id: sqMeta.id,
            act: sqMeta.act,
            started: true,
            completed: false,
            stepsCompleted: sqMeta.steps.map(() => false),
          },
        ],
      };
      useGameStore.setState({ state: next });
    } else {
      dispatch({ type: "START_STORY_QUEST", id: sqMeta.id });
    }
    pushNotif("▶", `بدت القصة: ${sqMeta.title}`, "milestone");
    showLevelUp(`بدت قصة: ${sqMeta.title}`, "▶");
  }

  function acceptSideQuest(id: string) {
    dispatch({ type: "ACCEPT_QUEST", id });
    const tpl = sideQuestTemplates.find((t) => t.id === id);
    if (tpl) {
      pushNotif("📋", `قبلت: ${tpl.title}`, "neutral");
      showReward(`قبلت ${tpl.title}`, "neutral", "📋");
    }
  }

  function progressSideQuest(id: string) {
    if (!state) return;
    if (state.stats.energy < 5) {
      showReward("ما عندك طاقة كافية", "negative", "✕");
      return;
    }
    const q = state.sideQuests.find((x) => x.id === id);
    const tpl = sideQuestTemplates.find((t) => t.id === id);
    if (!q || !tpl) return;

    const events: GameEvent[] = [
      { type: "STAT_DELTA", stat: "energy", amount: -5 },
      { type: "PROGRESS_QUEST", id },
      { type: "ADVANCE_TIME", hours: 2 },
    ];
    dispatch(events);
    showStatDelta("energy", -5);

    if (q.progress + 1 >= q.need) {
      // Complete it on next render
      setTimeout(() => {
        const wastaBonus =
          state.character.personality === "ambitious" ? 2 : 0;
        dispatch([
          { type: "COMPLETE_QUEST", id },
          { type: "STAT_DELTA", stat: "wasta", amount: tpl.reward.wasta + wastaBonus },
          { type: "STAT_DELTA", stat: "money", amount: tpl.reward.money },
          { type: "STAT_DELTA", stat: "rep", amount: tpl.reward.rep },
        ]);
        showStatDelta("wasta", tpl.reward.wasta + wastaBonus);
        showStatDelta("money", tpl.reward.money);
        showStatDelta("rep", tpl.reward.rep);
        showLevelUp(`✦ ختمت: ${tpl.title}`, "✓");
        pushNotif("✓", `ختمت ${tpl.title}`, "milestone");
      }, 100);
    } else {
      showReward(`${q.progress + 1} من ${q.need}`, "neutral", "▶");
    }
  }

  return (
    <div className="space-y-6 font-ar">
      {/* === STORY === */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
            القصة
          </div>
          {currentActId && (
            <div className="text-[11px] text-ink-3">
              الفصل {acts.find((a) => a.id === currentActId)?.n} من ٥
            </div>
          )}
        </div>
        {sqMeta ? (
          <div className="bg-surface rounded-2xl p-5 border border-surface-3">
            <div className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-1">
              {acts.find((a) => a.id === sqMeta.act)?.titleEmotional}
            </div>
            <div className="text-lg font-bold mb-1">{sqMeta.title}</div>
            <div className="text-xs text-ink-3 mb-3">
              مع {npcs.find((n) => n.id === sqMeta.npc)?.nameAr ?? sqMeta.npc}
            </div>
            <p className="text-sm text-ink-2 leading-relaxed mb-4">{sqMeta.desc}</p>
            <ol className="space-y-2 mb-4">
              {sqMeta.steps.map((step, i) => {
                const done = sqProg?.stepsCompleted[i] ?? false;
                return (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`flex-shrink-0 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                        done ? "bg-accent text-white" : "bg-surface-2 text-ink-3"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span className={done ? "line-through text-ink-3" : ""}>
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {sqMeta.rewards.wasta && (
                <span className="bg-accent/10 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                  +{sqMeta.rewards.wasta} واسطة
                </span>
              )}
              {sqMeta.rewards.money && (
                <span className="bg-gold/10 text-gold text-xs font-semibold px-2.5 py-1 rounded-full">
                  +{sqMeta.rewards.money} د.ك
                </span>
              )}
              {sqMeta.rewards.rep && (
                <span className="bg-ink/10 text-ink text-xs font-semibold px-2.5 py-1 rounded-full">
                  +{sqMeta.rewards.rep} سمعة
                </span>
              )}
            </div>
            {!sqProg?.started && (
              <button
                onClick={startStoryQuest}
                className="w-full bg-accent text-white font-semibold py-3 rounded-full active:scale-[0.98] transition-transform"
              >
                ابدأ هالقصة
              </button>
            )}
          </div>
        ) : (
          <div className="bg-surface-2 rounded-2xl p-5 text-center text-ink-3 italic text-sm">
            انتظر — القصة تبدا قريب.
          </div>
        )}
      </section>

      {/* === PERSONAL CHAINS === */}
      <section>
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
          القصص الشخصية
        </div>
        {Object.values(state.personalChains).filter((c) => c.unlocked).length === 0 ? (
          <div className="bg-surface-2 rounded-2xl p-5 text-center text-ink-3 italic text-sm">
            ابني علاقاتك إلى ٧٠+ عشان تنفتح قصص الناس الشخصية.
          </div>
        ) : (
          <div className="space-y-2.5">
            {Object.values(state.personalChains)
              .filter((c) => c.unlocked)
              .map((prog) => {
                const chain = personalChains[prog.npc];
                if (!chain) return null;
                const npc = npcs.find((n) => n.id === prog.npc);
                if (prog.completed) {
                  return (
                    <div
                      key={prog.npc}
                      className="bg-surface rounded-2xl p-4 border border-surface-3 opacity-60"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold">{chain.title}</div>
                        <div className="text-[11px] bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full">
                          مكتملة
                        </div>
                      </div>
                      <div className="text-xs text-ink-3">مع {npc?.nameAr}</div>
                    </div>
                  );
                }
                const step = chain.steps[prog.step];
                const inZone = state.location === step.zone;
                const targetZone = zones.find((z) => z.id === step.zone);
                const canDo = inZone && state.stats.energy >= step.energy;
                return (
                  <div key={prog.npc} className="bg-surface rounded-2xl p-4 border border-surface-3">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <div className="font-bold">{chain.title}</div>
                        <div className="text-xs text-ink-3">مع {npc?.nameAr}</div>
                      </div>
                      <div className="text-[11px] bg-surface-2 font-medium px-2 py-0.5 rounded-full">
                        الخطوة {prog.step + 1}/{chain.steps.length}
                      </div>
                    </div>
                    <div className="text-sm font-semibold mt-2 mb-1">{step.title}</div>
                    <div className="text-xs text-ink-2 mb-3">{step.desc}</div>
                    <div className="flex items-center gap-3 text-[11px] text-ink-3 mb-3">
                      <span>📍 {targetZone?.nameAr}</span>
                      <span>⌇ {step.energy}</span>
                    </div>
                    <button
                      disabled={!canDo}
                      onClick={() => {
                        if (!canDo || !state) return;
                        const events: GameEvent[] = [
                          { type: "STAT_DELTA", stat: "energy", amount: -step.energy },
                          { type: "ADVANCE_TIME", hours: 3 },
                        ];
                        if (step.rewards.wasta)
                          events.push({ type: "STAT_DELTA", stat: "wasta", amount: step.rewards.wasta });
                        if (step.rewards.money)
                          events.push({ type: "STAT_DELTA", stat: "money", amount: step.rewards.money });
                        if (step.rewards.rep)
                          events.push({ type: "STAT_DELTA", stat: "rep", amount: step.rewards.rep });
                        if (step.rewards.faction && step.rewards.factionAmt)
                          events.push({
                            type: "FACTION_DELTA",
                            faction: step.rewards.faction,
                            amount: step.rewards.factionAmt,
                          });
                        dispatch(events);
                        if (step.rewards.wasta) showStatDelta("wasta", step.rewards.wasta);
                        if (step.rewards.money) showStatDelta("money", step.rewards.money);
                        if (step.rewards.rep) showStatDelta("rep", step.rewards.rep);

                        // Advance chain
                        const isLast = prog.step + 1 >= chain.steps.length;
                        if (isLast) {
                          dispatch({ type: "COMPLETE_CHAIN", npc: prog.npc });
                          showLevelUp(`✦ ${chain.title} · ختمت`, "✦");
                          pushNotif("✦", chain.completion, "milestone");
                        } else {
                          dispatch({ type: "ADVANCE_CHAIN", npc: prog.npc });
                          showLevelUp(`خطوة ${prog.step + 2}: ${chain.steps[prog.step + 1].title}`, "▶");
                          pushNotif("▶", `${chain.title} · خطوة ${prog.step + 2}`, "positive");
                        }
                      }}
                      className={`w-full py-2.5 rounded-full text-sm font-semibold ${
                        canDo
                          ? "bg-accent text-white active:scale-[0.99]"
                          : "bg-surface-2 text-ink-3"
                      }`}
                    >
                      {!inZone
                        ? `سافر ${targetZone?.nameAr} أول`
                        : state.stats.energy < step.energy
                          ? "تعبت — ارتح أول"
                          : "خذ هالخطوة"}
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* === SIDE === */}
      <section>
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
            مهام جانبية هنا
          </div>
        </div>
        <SideQuestsList
          quests={state.sideQuests.filter((q) => {
            const tpl = sideQuestTemplates.find((t) => t.id === q.id);
            return tpl?.zone === state.location && !q.done;
          })}
          onAccept={acceptSideQuest}
          onProgress={progressSideQuest}
        />
      </section>
    </div>
  );
}

function SideQuestsList({
  quests,
  onAccept,
  onProgress,
}: {
  quests: { id: string; accepted: boolean; done: boolean; progress: number; need: number }[];
  onAccept: (id: string) => void;
  onProgress: (id: string) => void;
}) {
  if (quests.length === 0) {
    return (
      <div className="bg-surface-2 rounded-2xl p-5 text-center text-ink-3 italic text-sm">
        ما في مهام هنا. سافر مكان ثاني.
      </div>
    );
  }
  return (
    <div className="space-y-2.5">
      {quests.map((q) => {
        const tpl = sideQuestTemplates.find((t) => t.id === q.id);
        if (!tpl) return null;
        return (
          <div key={q.id} className="bg-surface rounded-2xl p-4 border border-surface-3">
            <div className="flex items-baseline justify-between mb-1">
              <div className="font-bold text-sm">{tpl.title}</div>
              <div className="text-[10px] bg-surface-2 px-2 py-0.5 rounded-full font-medium">
                {q.accepted ? `${q.progress}/${q.need}` : "متاحة"}
              </div>
            </div>
            <div className="text-xs text-ink-2 mb-3 leading-relaxed">{tpl.desc}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="bg-accent/10 text-accent text-[11px] font-semibold px-2 py-0.5 rounded-full">
                +{tpl.reward.wasta} واسطة
              </span>
              <span className="bg-gold/10 text-gold text-[11px] font-semibold px-2 py-0.5 rounded-full">
                +{tpl.reward.money} د.ك
              </span>
              <span className="bg-ink/10 text-ink text-[11px] font-semibold px-2 py-0.5 rounded-full">
                +{tpl.reward.rep} سمعة
              </span>
            </div>
            {q.accepted && (
              <div className="h-1 bg-surface-2 rounded-full overflow-hidden mb-2.5">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${(q.progress / q.need) * 100}%` }}
                />
              </div>
            )}
            <button
              onClick={() => (q.accepted ? onProgress(q.id) : onAccept(q.id))}
              className="w-full bg-accent text-white font-semibold py-2.5 rounded-full active:scale-[0.99] text-sm"
            >
              {q.accepted ? "كمل (⌇5)" : "اقبل"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
