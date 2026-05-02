"use client";

import { useGameStore } from "@/lib/store";
import { classes, personalities } from "@/lib/data/character";
import { acts } from "@/lib/data/acts";

export default function YouPage() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  const cls = classes.find((c) => c.id === state.character.classId);
  const pers = personalities.find((p) => p.id === state.character.personality);
  const currentActId = acts.find((a) => !state.actsCompleted.includes(a.id))?.id;
  const currentAct = acts.find((a) => a.id === currentActId);

  return (
    <div className="space-y-5">
      <div className="bg-surface rounded-2xl p-5 text-center border border-surface-3">
        <div className="text-3xl font-bold mb-1">
          {state.character.honorific ? `${state.character.honorific} ` : ""}
          {state.character.givenName}
        </div>
        <div className="text-sm text-ink-3">
          {cls?.nameAr} · {pers?.nameAr}
        </div>
        {currentAct && (
          <div className="mt-3 inline-flex bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full">
            الفصل {currentAct.n} · {currentAct.titleEmotional}
          </div>
        )}
      </div>

      <div>
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
          الصفات
        </div>
        {state.traits.length === 0 ? (
          <div className="bg-surface-2 rounded-2xl p-4 text-center text-ink-3 italic text-sm">
            ما زلت تتشكل. اللعب سيكشف من إنت.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {state.traits.map((t) => (
              <span
                key={t}
                className="bg-surface-2 text-ink text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                {traitAr(t)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
          الانتماءات
        </div>
        <div className="space-y-2">
          {Object.entries(state.factions).map(([f, v]) => (
            <div key={f} className="bg-surface rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="text-sm font-medium flex-1">{factionAr(f)}</div>
              <div className="text-sm font-bold">{v}</div>
              <div className="w-24 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${Math.min(100, v)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const traitArMap: Record<string, string> = {
  ruthless: "قاسي",
  honorable: "شريف",
  loyal: "وفي",
  calculating: "محسوب",
  pious: "متدين",
  secular: "علماني",
  diplomatic: "دبلوماسي",
  confrontational: "مواجه",
  trusted: "موثوق",
  feared: "مهيب",
  exiled: "منبوذ",
  married: "متزوج",
  hajji: "حاج",
  patron: "راعي",
  compromised: "مُفسد",
  betrayer: "خائن",
  grieving: "محزون",
};
function traitAr(t: string) {
  return traitArMap[t] ?? t;
}

const factionArMap: Record<string, string> = {
  tribal: "القبيلة",
  merchants: "التجار",
  government: "الحكومة",
  religious: "المتدينين",
};
function factionAr(f: string) {
  return factionArMap[f] ?? f;
}
