/**
 * Wasta · Data: Duels
 * Four duel types — gahwa, debate, falconry, brawl.
 *
 * Each is a stance-based mini-game. Stances form a triangle/diamond
 * where each beats one and loses to another (rock-paper-scissors).
 *
 * The ARENA UI (Phase 2) will render these as full-screen combat with
 * HP bars, damage numbers, and momentum streaks.
 */

import type { DuelType } from "@/lib/types";

export const duels: Record<DuelType["id"], DuelType> = {
  gahwa: {
    id: "gahwa",
    name: "نزال الفنجان",
    desc: "نزال كلامي على القهوة. كل واحد يختار موقفه. المواقف تكسر بعض في مثلث.",
    rounds: 1,
    stanceTitle: "اختر موقفك",
    stances: [
      { id: "wit", name: "ذكاء", desc: "حادّ، يقطع بسرعة", icon: "⚡", beats: "wisdom" },
      { id: "wisdom", name: "حكمة", desc: "هادئ، يثقل", icon: "☾", beats: "patience" },
      { id: "patience", name: "صبر", desc: "ساكن، يتحمّل", icon: "⌒", beats: "wit" },
    ],
    statBonus: (s) =>
      Math.floor(s.stats.rep / 8) + (s.character.personality === "discreet" ? 2 : 0),
    winText: "الغرفة توميء معاك. فنجانك يتلى من جديد — هذي الجائزة.",
    loseText: "خصمك أخذ آخر كلمة. الناس لاحظوا. الفنجان يبقى فاضي.",
    drawText: "الاثنين سُمعوا. الغرفة منقسمة.",
  },

  debate: {
    id: "debate",
    name: "مجادلة الديوانية",
    desc: "نقاش اجتماعي على ثلاث جولات. كل جولة تختار تكتيك.",
    rounds: 3,
    stanceTitle: "تكتيك الجولة",
    stances: [
      { id: "persuade", name: "إقناع", desc: "تكسب الغرفة معاك", icon: "❖", beats: "concede" },
      { id: "concede", name: "اعتراف", desc: "تتنازل عشان تكسب الثقة", icon: "◐", beats: "press" },
      { id: "reframe", name: "تحويل", desc: "تغير الموضوع أصلاً", icon: "⊕", beats: "persuade" },
      { id: "press", name: "ضغط", desc: "تطبق على نقطة ضعف", icon: "⚡", beats: "reframe" },
    ],
    statBonus: (s) =>
      Math.floor(s.stats.wasta / 10) + (s.character.personality === "ambitious" ? 2 : 0),
    winText: "الغرفة جت معاك. الخصم تراجع بأدب — أو بدون أدب.",
    loseText: "خسرت الغرفة. الوجوه التفّت لما الديوانية انفضت.",
    drawText: "ولا واحد كسب الغرفة. النقاش انتهى بدون نتيجة.",
  },

  falconry: {
    id: "falconry",
    name: "مسابقة الصقّارة",
    desc: "مسابقة في البر. ثلاث مراحل: التدريب، قراءة الهوا، الصيد.",
    rounds: 3,
    stanceTitle: "المنهج",
    stances: [
      { id: "patient", name: "صبر", desc: "تنتظر اللحظة المناسبة", icon: "⌒", beats: "aggressive" },
      { id: "aggressive", name: "اندفاع", desc: "تضغط من البداية", icon: "⚡", beats: "reading" },
      {
        id: "reading",
        name: "قراءة الهوا",
        desc: "تتأقلم مع الظروف",
        icon: "☾",
        beats: "patient",
      },
    ],
    statBonus: (s) =>
      Math.floor(s.stats.energy / 15) +
      (s.character.personality === "patient" ? 3 : 0) +
      (s.factions.tribal ?? 0) / 10,
    winText: "صقرك رجع نظيف. البر صفّق بصمت.",
    loseText: "الطير رجع فاضي. الهوا اليوم كان لغيرك.",
    drawText: "عرض شريف. ولا صقر ربح بفرق.",
  },

  brawl: {
    id: "brawl",
    name: "عراك",
    desc: "تعدّت الكلام. واحد بيطلع وفيه آثار.",
    rounds: 3,
    stanceTitle: "موقف",
    stances: [
      { id: "strike", name: "هجوم", desc: "اضغط — قرّب المسافة", icon: "⚡", beats: "defend" },
      { id: "grapple", name: "إمساك", desc: "خذها أرض", icon: "⊕", beats: "strike" },
      { id: "defend", name: "دفاع", desc: "انتظر — اقرا الفتحة", icon: "⌒", beats: "grapple" },
    ],
    statBonus: (s) =>
      Math.floor(s.stats.energy / 12) +
      (s.character.personality === "ambitious" ? 2 : 0) -
      2,
    winText: "هو على الأرض. الناس صامتين. إنت تنزف من مكان — بس وقفت.",
    loseText: "إنت على الأرض. دشداشة شخص ممزقة — دشداشتك. العار أسوأ من الكدمة.",
    drawText: "الاثنين ينهجون. اللي بدأها فقد اهتمامه.",
  },
};
