"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { classes, personalities, backgrounds } from "@/lib/data/character";
import type { ClassId, PersonalityId } from "@/lib/types";

/**
 * /new — character creation.
 * 4 steps: name → class → background → personality → start prologue.
 */
export default function NewGame() {
  const router = useRouter();
  const newGame = useGameStore((s) => s.newGame);

  const [step, setStep] = useState(1);
  const [givenName, setGivenName] = useState("بدر");
  const [classId, setClassId] = useState<ClassId | null>(null);
  const [bg, setBg] = useState<string | null>(null);
  const [pers, setPers] = useState<PersonalityId | null>(null);

  function start() {
    if (!classId || !bg || !pers) return;
    newGame({ givenName, classId, background: bg, personality: pers });
    router.push("/play/prologue");
  }

  return (
    <main
      className="min-h-screen bg-bg flex flex-col px-5 pt-[calc(var(--safe-top)+24px)] pb-[calc(var(--safe-bottom)+24px)]"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="text-[11px] text-ink-3 font-medium tracking-wider">
          {step} من ٤
        </div>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-ink-3"
        >
          رجوع
        </button>
      </div>

      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold mb-2">إيش اسمك؟</h2>
          <p className="text-sm text-ink-3 mb-6">الاسم يطلع في الديوانية.</p>
          <input
            value={givenName}
            onChange={(e) => setGivenName(e.target.value)}
            className="w-full bg-surface border border-surface-3 rounded-2xl px-4 py-3.5 text-lg text-right font-ar"
            dir="rtl"
          />
          <button
            disabled={!givenName.trim()}
            onClick={() => setStep(2)}
            className="mt-auto bg-accent text-white font-semibold py-3.5 rounded-full disabled:opacity-50"
          >
            تابع
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold mb-2">شنو شغلك؟</h2>
          <p className="text-sm text-ink-3 mb-6">يحدد إحصائياتك في البداية.</p>
          <div className="space-y-2.5 mb-6">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setClassId(c.id)}
                className={`w-full text-right p-4 rounded-2xl border-2 transition-all ${
                  classId === c.id ? "border-accent bg-accent/5" : "border-surface-3 bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{c.icon}</div>
                  <div>
                    <div className="font-bold text-base">{c.nameAr}</div>
                    <div className="text-xs text-ink-3 mt-0.5">{c.descAr}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            disabled={!classId}
            onClick={() => setStep(3)}
            className="mt-auto bg-accent text-white font-semibold py-3.5 rounded-full disabled:opacity-50"
          >
            تابع
          </button>
        </>
      )}

      {step === 3 && classId && (
        <>
          <h2 className="text-2xl font-bold mb-2">من وين جيت؟</h2>
          <p className="text-sm text-ink-3 mb-6">الخلفية تعطيك مكافأة بداية.</p>
          <div className="space-y-2.5 mb-6">
            {backgrounds[classId].map((b) => (
              <button
                key={b.id}
                onClick={() => setBg(b.id)}
                className={`w-full text-right p-4 rounded-2xl border-2 transition-all ${
                  bg === b.id ? "border-accent bg-accent/5" : "border-surface-3 bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{b.icon}</div>
                  <div>
                    <div className="font-bold text-base">{b.nameAr}</div>
                    <div className="text-xs text-ink-3 mt-0.5">{b.descAr}</div>
                    <div className="text-[11px] text-accent mt-1 font-semibold">
                      {b.perkAr}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            disabled={!bg}
            onClick={() => setStep(4)}
            className="mt-auto bg-accent text-white font-semibold py-3.5 rounded-full disabled:opacity-50"
          >
            تابع
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <h2 className="text-2xl font-bold mb-2">كيف طبعك؟</h2>
          <p className="text-sm text-ink-3 mb-6">يأثر على بونصاتك في اللعبة.</p>
          <div className="space-y-2.5 mb-6">
            {personalities.map((p) => (
              <button
                key={p.id}
                onClick={() => setPers(p.id)}
                className={`w-full text-right p-4 rounded-2xl border-2 transition-all ${
                  pers === p.id ? "border-accent bg-accent/5" : "border-surface-3 bg-surface"
                }`}
              >
                <div className="font-bold text-base">{p.nameAr}</div>
                <div className="text-xs text-accent mt-1 font-semibold">{p.descAr}</div>
              </button>
            ))}
          </div>
          <button
            disabled={!pers}
            onClick={start}
            className="mt-auto bg-accent text-white font-semibold py-3.5 rounded-full disabled:opacity-50"
          >
            ابدأ القصة
          </button>
        </>
      )}
    </main>
  );
}
