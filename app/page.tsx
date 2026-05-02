"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";

/**
 * / — landing page.
 * If a save exists, offer to continue. Otherwise, start new game.
 */
export default function Landing() {
  const router = useRouter();
  const hydrate = useGameStore((s) => s.hydrate);
  const state = useGameStore((s) => s.state);
  const reset = useGameStore((s) => s.reset);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-10" dir="rtl">
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full">
        <div className="text-[120px] leading-none text-accent font-bold mb-4 text-center font-ar">
          ٱ
        </div>
        <h1 className="text-4xl font-bold text-center text-ink">واسطة</h1>
        <p className="text-base text-ink-3 text-center mt-1 font-sans italic">Wasta</p>

        <p className="text-sm text-ink-2 leading-loose text-center mt-8">
          كويتي يرجع البيت بعد سنين. ابن من؟ ابن أيّ اسم؟ القصة تبدا الحين.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-2.5 mb-8">
        {state ? (
          <>
            <button
              onClick={() => router.push("/play")}
              className="w-full bg-accent text-white font-semibold py-3.5 rounded-full active:scale-[0.98] transition-transform"
            >
              كمل اللعبة (اليوم {state.day})
            </button>
            <button
              onClick={() => {
                if (confirm("متأكد؟ كل التقدم راح يضيع.")) {
                  reset();
                  router.push("/new");
                }
              }}
              className="w-full bg-surface-2 text-ink-2 text-sm font-medium py-3 rounded-full"
            >
              بداية جديدة
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/new")}
            className="w-full bg-accent text-white font-semibold py-3.5 rounded-full active:scale-[0.98] transition-transform"
          >
            ابدأ اللعبة
          </button>
        )}
      </div>
    </main>
  );
}
