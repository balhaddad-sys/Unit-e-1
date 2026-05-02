"use client";

import { useGameStore } from "@/lib/store";
import { zones } from "@/lib/data/zones";
import { storyQuests } from "@/lib/data/quests/story";
import { acts } from "@/lib/data/acts";
import { npcs } from "@/lib/data/npcs";

export default function HomePage() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  const here = zones.find((z) => z.id === state.location)!;
  const currentActId = acts.find((a) => !state.actsCompleted.includes(a.id))?.id;
  const sqMeta = storyQuests.find((q) => q.act === currentActId);
  const sqProg = state.storyQuests.find((q) => q.id === sqMeta?.id);

  return (
    <div className="space-y-5">
      {/* Current place card */}
      <section>
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
          أنت هنا
        </div>
        <div className="bg-surface-2 rounded-2xl p-4 flex items-center gap-3">
          <div className="text-3xl">{here.icon}</div>
          <div className="flex-1">
            <div className="font-bold">{here.nameAr}</div>
            <div className="text-xs text-ink-3 mt-0.5">{here.descAr}</div>
          </div>
        </div>
      </section>

      {/* Story quest (if active) */}
      {sqMeta && sqProg && !sqProg.completed && (
        <section>
          <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
            القصة
          </div>
          <div className="bg-surface rounded-2xl p-5 border border-surface-3">
            <div className="text-[10px] text-accent font-semibold uppercase tracking-wider mb-1">
              الفصل {acts.find((a) => a.id === sqMeta.act)?.n} ·{" "}
              {acts.find((a) => a.id === sqMeta.act)?.titleEmotional}
            </div>
            <div className="text-lg font-bold mb-1">{sqMeta.title}</div>
            <div className="text-xs text-ink-3 mb-3">
              مع {npcs.find((n) => n.id === sqMeta.npc)?.nameAr ?? sqMeta.npc}
            </div>
            <p className="text-sm text-ink-2 leading-relaxed mb-3">{sqMeta.desc}</p>
            <div className="text-xs text-ink-3">
              {sqProg.started
                ? `الخطوة ${sqProg.stepsCompleted.filter(Boolean).length + 1} من ${sqMeta.steps.length}`
                : "لسا ما بدت — افتح تبويب «المهام»"}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
          مهامك
        </div>
        <div className="bg-surface-2 rounded-2xl p-5 text-center text-ink-3 italic text-sm">
          {state.sideQuests.filter((q) => q.accepted && !q.done).length === 0
            ? "ما في مهام نشطة بعد. الشريط الأخضر فوق يخبرك إيش تسوي."
            : `${state.sideQuests.filter((q) => q.accepted && !q.done).length} مهام نشطة`}
        </div>
      </section>
    </div>
  );
}
