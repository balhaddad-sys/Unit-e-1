"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "أهلاً يا بدر",
    text:
      "هذي اللعبة عن رجال كويتي راجع من برّا بعد سنين. تبني اسمك من الصفر — تعرف ناس، تسوي معاريف، تكسب واسطة. الواسطة هي العملة الحقيقية.",
  },
  {
    title: "الشريط الأخضر تحت الإحصائيات",
    text:
      "هذا اللي يقول لك شنو تسوي بعد. اضغط عليه يأخذك مباشرة. ما تحتار. الشريط يتغير على حسب وضعك.",
  },
  {
    title: "الناس هم اللعبة",
    text:
      "اضغط تبويب «الناس» وتعرف على اللي حولك. سلّم. اعمل معروف. لما تصير علاقتك مع شخص ٧٠+، تنفتح قصته الشخصية. هذي القصص هي الأهم.",
  },
  {
    title: "ارتح كل ما تعبت",
    text:
      "كل ٧ أيام تجيك لحظة تأمل تخبرك مين صرت. كل قرار تأخذه يبني هويتك. ما في صح وغلط — في إنت بس.",
  },
];

export function Tutorial({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const last = i === steps.length - 1;
  const s = steps[i];

  return (
    <div className="fixed inset-0 z-[3000] bg-black/85 flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-surface rounded-2xl max-w-sm w-full p-6"
        dir="rtl"
      >
        <div className="text-[11px] text-ink-3 font-semibold tracking-wider">
          {i + 1} من {steps.length}
        </div>
        <div className="text-xl font-bold text-ink mt-1.5 mb-3">{s.title}</div>
        <div className="text-sm leading-loose text-ink-2 mb-5">{s.text}</div>

        <div className="flex gap-2.5 justify-end">
          <button
            onClick={onDone}
            className="bg-surface-2 text-ink-2 text-sm font-semibold px-4 py-2.5 rounded-full active:scale-95 transition-transform"
          >
            تخطّى
          </button>
          <button
            onClick={() => (last ? onDone() : setI((x) => x + 1))}
            className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-full active:scale-95 transition-transform"
          >
            {last ? "ابدأ" : "فهمت"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
