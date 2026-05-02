"use client";

import { useGameStore } from "@/lib/store";
import { acts } from "@/lib/data/acts";
import { storyQuests } from "@/lib/data/quests/story";
import { personalChains } from "@/lib/data/chains";
import { npcs } from "@/lib/data/npcs";
import { zones } from "@/lib/data/zones";

export default function QuestsPage() {
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);

  if (!state) return null;

  const currentActId = acts.find((a) => !state.actsCompleted.includes(a.id))?.id;
  const sqMeta = storyQuests.find((q) => q.act === currentActId);
  const sqProg = state.storyQuests.find((q) => q.id === sqMeta?.id);

  function startStoryQuest() {
    if (!sqMeta) return;
    dispatch({ type: "START_STORY_QUEST", id: sqMeta.id });
  }

  return (
    <div className="space-y-6">
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
                    <span className={done ? "line-through text-ink-3" : ""}>{step.label}</span>
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
                return (
                  <div
                    key={prog.npc}
                    className="bg-surface rounded-2xl p-4 border border-surface-3"
                  >
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
                      disabled={!inZone}
                      className={`w-full py-2.5 rounded-full text-sm font-semibold ${
                        inZone
                          ? "bg-accent text-white active:scale-[0.99]"
                          : "bg-surface-2 text-ink-3"
                      }`}
                    >
                      {inZone ? "خذ هالخطوة" : `سافر ${targetZone?.nameAr} أول`}
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* === SIDE === */}
      <section>
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
          مهام جانبية
        </div>
        <div className="bg-surface-2 rounded-2xl p-5 text-center text-ink-3 italic text-sm">
          المهام الجانبية تظهر هنا مع تقدمك في اللعبة.
        </div>
      </section>
    </div>
  );
}
