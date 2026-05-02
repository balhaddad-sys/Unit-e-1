/**
 * Wasta · Data: Vignettes
 * Hand-written one-shot scenes tied to zone + time of day.
 *
 * STATUS: 4 production-ready vignettes. Add more freely.
 *
 * Trigger rate: ~20% on travel into matching zone + time.
 */

import type { Vignette } from "@/lib/types";

export const vignettes: Vignette[] = [
  {
    id: "souq_old_woman",
    title: "صوت من زمان",
    zone: "souq",
    timeOfDay: "morning",
    setting: "سوق المباركية، السابعة الصبح",
    text: `وحدة كبيرة في السن تشتري دخّون من ركن العطارة. تطالعك. توقف. تقول: «إنت ولد فلان؟» تقول إيه. تومّى براسها. «أبوي الله يرحمه كان يبيع الدخون لجدّك. خمسين سنة وهالعائلة معروفة بصدقها. الله يحفظكم.»

تمشي بدون ما تقول شي ثاني. تترك إحساس وراها ما توقعته.`,
    options: [
      {
        id: "thank_quietly",
        label: "(تومّى براسك بصمت)",
        storyNote: "كبيرة في السوق ذكرت اسم العائلة بإحسان.",
        effects: { rep: 3, factions: { merchants: 2 } },
      },
      {
        id: "ask_more",
        label: "«تعرفين أبوي زين؟»",
        storyNote: "سألت عن جدّك — لقيت قصة ما عرفتها.",
        effects: { rep: 2, energy: -3, factions: { tribal: 2 } },
      },
    ],
  },

  {
    id: "child_balloon",
    title: "بالون ضايع",
    zone: "city",
    timeOfDay: "afternoon",
    setting: "كورنيش الخليج، عصر الجمعة",
    text: `طفل صغير، خمس سنين تقريباً، يبكي عند الحاجز. بالونه طار. أبوه على التلفون، ما لاحظ. الطفل يطالع البالون يصغر في السما.

تتذكر إنك كنت في عمره مرة، فقدت شي صغير، بكيت بنفس الطريقة.`,
    options: [
      {
        id: "buy_new",
        label: "(تشتري له بالون جديد من اللي يبيع جنب الكشك)",
        storyNote: "اشتريت بالون لطفل ضائع. أبوه ما لاحظ. الطفل لاحظ.",
        effects: { money: -2, rep: 3 },
      },
      {
        id: "say_words",
        label: "(تقعد جنبه وتقول له إن البالونات ترجع لأهلها فوق)",
        storyNote: "كذبت كذبة طيبة على طفل. ابتسم.",
        effects: { rep: 2 },
      },
      {
        id: "walk_past",
        label: "(تعدي — مو شغلك)",
        storyNote: "عدّيت. الطفل لسا يبكي.",
        effects: { rep: -1 },
      },
    ],
  },

  {
    id: "old_classmate",
    title: "زميل قديم",
    zone: "avenues",
    timeOfDay: "evening",
    setting: "الأفنيوز، مساء الخميس",
    text: `تسمع اسمك. تلتفت. زميل من المدرسة، ما شفته من ١٢ سنة. تعانقه. هو تغيّر — كرش، شعر أبيض، عيون متعبة. يسأل عنك بصدق.

يقول: «والله ما توقعت إنك ترجع. الكل قال إنك خليت الكويت.»`,
    options: [
      {
        id: "honest",
        label: "«صراحة، أنا بعد ما توقعت أرجع.»",
        storyNote: "التقيت زميل قديم. قلت له الصدق.",
        effects: { rep: 1, energy: -3 },
      },
      {
        id: "polite",
        label: "«الكويت بيتي — مهما طلعت، ترجعني.»",
        storyNote: "التقيت زميل قديم. قلت كلام جميل.",
        effects: { rep: 2, factions: { tribal: 1 } },
      },
    ],
  },

  {
    id: "friday_whatsapp",
    title: "رسالة جمعة",
    zone: "city",
    timeOfDay: "morning",
    dayOfWeek: "friday",
    setting: "صباح الجمعة، البيت",
    text: `رسالة واتساب من ابن عم في لندن. ما كلمته من شهر. «شخبارك، كل شي طيب؟ متى ترجع تزورنا؟» الكلام عادي بس فيه شي ثقيل.

إنت لاحظت إنك بطّلت ترد على رسائل اللي بره من زمان. صرت كله هنا.`,
    options: [
      {
        id: "reply_warm",
        label: "ترد بمحبة — تواعده تيجي قريب",
        storyNote: "رديت على ابن العم في لندن.",
        effects: { rep: 2, energy: -2 },
      },
      {
        id: "reply_short",
        label: "ترد قصير — «الحمد لله، الكل بخير»",
        storyNote: "رديت رد قصير.",
        effects: { rep: 0 },
      },
      {
        id: "ignore",
        label: "ما ترد — راح ترد لاحق",
        storyNote: "ما رديت. ابن العم لاحظ.",
        effects: { rep: -1 },
      },
    ],
  },
];
