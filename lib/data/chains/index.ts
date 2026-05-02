/**
 * Wasta · Data: Personal Chains
 * Per-NPC questlines that unlock at relationship 70+.
 *
 * STATUS:
 *   ✓ Umm Nasser  — production-ready (vertical slice anchor)
 *   ✓ Bu Khalid   — production-ready (3-beat arc: Trauma/Struggle/Mastery)
 *   ✓ Sheikh Abdullah — production-ready
 *   ◔ Others — scaffolded with title/desc/step structure; full dialogue TODO
 *
 * To flesh out a scaffolded chain: see /docs/contribute/adding-chains.md
 */

import type { PersonalChain } from "@/lib/types";

export const personalChains: Record<string, PersonalChain> = {
  // ════════════════════════════════════════════════════════════════
  // UMM NASSER — صاحبة الدفاتر (vertical slice anchor)
  // 3-beat arc: Trauma (revealed guilt) → Struggle (loyalty test) → Mastery (you become her successor)
  // ════════════════════════════════════════════════════════════════
  "Umm Nasser": {
    npc: "Umm Nasser",
    title: "صاحبة الدفاتر",
    desc: "أم نصر تحفظ الدفتر اللي ما يُكتب — منو يَدين لمنو. تبيك تتعلم. بس درس الثقة معاها له ثمن.",
    steps: [
      {
        title: "اقعد بصمت",
        desc: "اقعد جنبها في الديوانية. ما تتكلم. اسمع. أم نصر تختبر اللي يصبر.",
        zone: "diwaniya",
        energy: 6,
        rewards: { rep: 3 },
      },
      {
        title: "معروف منسي",
        desc: "ادور على واحد يَدين لها من سنين. ذكّره بهدوء، بدون تهديد. الدفتر يكتمل.",
        zone: "souq",
        energy: 14,
        rewards: { wasta: 4, rep: 2, faction: "tribal", factionAmt: 3 },
      },
      {
        title: "اختبار الولاء",
        desc: "تاجر يعرض عليك دفعة عشان تشوف اسم محذوف من دفترها. أم نصر تراقب الموقف.",
        zone: "diwaniya",
        energy: 16,
        rewards: { wasta: 6, rep: 4 },
        requiresDuel: "debate",
      },
    ],
    completion:
      "أم نصر تبتسم لأول مرة تشوفها — ابتسامة صغيرة، بس ما تخفيها. «الحين فهمت.» تكتب اسمك في دفتر ما يقراه إلا هي. هذا أكبر اعتراف ممكن.",
  },

  // ════════════════════════════════════════════════════════════════
  // BU KHALID — آخر صفقة (3-beat: Trauma → Struggle → Mastery)
  // The wound: his own father died before recognizing him.
  // ════════════════════════════════════════════════════════════════
  "Bu Khalid": {
    npc: "Bu Khalid",
    title: "آخر صفقة",
    desc: "أبو خالد يطارد صفقة تقاعد أخيرة. بس الصفقة مو الموضوع الحقيقي — الموضوع شي ما قاله لأحد من ٣٠ سنة.",
    steps: [
      {
        title: "المحادثة الأولى",
        desc: "قابل أبو خالد في مكتبه في ديرة الكويت. يشرح لك شنو يبي. بس الكلام يطيح في مكان ما توقعته — يذكر أبوه.",
        zone: "city",
        energy: 8,
        rewards: { wasta: 2, rep: 1 },
      },
      {
        title: "اسمع نبض السوق",
        desc: "كلّم مبارك الحواج في السوق. شبكة التجار تعرف. بس مبارك يقول لك شي عن أبو خالد ما يعرفه إلا القلة.",
        zone: "souq",
        energy: 10,
        rewards: { wasta: 3, money: 150 },
      },
      {
        title: "عشاء الإقفال",
        desc: "احضر العشاء. تواجه ممثل المنافسين بنزال فنجان. بس الموقف الحقيقي اللي تواجه فيه: تربح بالقوة، أو تخسر عمداً عشان تعطيه شي ما تعطيه أبوه.",
        zone: "diwaniya",
        energy: 18,
        rewards: { wasta: 12, money: 600, rep: 5, faction: "merchants", factionAmt: 6 },
        requiresDuel: "gahwa",
      },
    ],
    completion:
      "أبو خالد يصب لك فنجان. ما يطالعك. «أبوي مات قبل ما يقول لي إنه فخور فيّ. ما حد قال لي بعدها. إنت — يا ولد — قلت لي اليوم. حتى لو ما قلتها بكلام.» يسكت طويل. «إذا تسمح، أبيك تكون الولد اللي ما عمري لقيته.»",
  },

  // ════════════════════════════════════════════════════════════════
  // SHEIKH ABDULLAH — صلاة الفجر
  // The Imam's chain — he asks you to pray with him at dawn for his alcoholic father.
  // ════════════════════════════════════════════════════════════════
  "Sheikh Abdullah": {
    npc: "Sheikh Abdullah",
    title: "صلاة الفجر",
    desc: "الشيخ عبدالله يطلب الإرشاد، بس مو في موضوع الشباب — في موضوع شخصي ما قدر يحكيه لأحد.",
    steps: [
      {
        title: "اسمع الطلب",
        desc: "الشيخ يدعيك لمكتبه بعد صلاة العشاء. القهوة جاهزة. الكلام مو سهل عليه.",
        zone: "govzone",
        energy: 6,
        rewards: { rep: 4, faction: "religious", factionAmt: 3 },
      },
      {
        title: "الإرشاد المتبادل",
        desc: "الشيخ يشرح لك إنه ما قدر يصلي لأبوه من سنين — أبوه مات على غير حال طيب. ويسألك تصلي معاه فجر السبت.",
        zone: "diwaniya",
        energy: 10,
        rewards: { rep: 5, faction: "religious", factionAmt: 4 },
      },
      {
        title: "صلاة الفجر",
        desc: "السبت. الفجر. تروح المسجد قبل أحد. الشيخ ينتظرك. تصلي خلفه.",
        zone: "govzone",
        energy: 14,
        rewards: { wasta: 6, rep: 10, faction: "religious", factionAmt: 8 },
      },
    ],
    completion:
      "بعد الصلاة، الشيخ يقعد جنبك. ما يتكلم لمدة. بعدين يقول: «أبوي ما عرف إني سامحته. الحين، يمكن لأول مرة، أحس إن السماح ممكن.» يضع إيده على إيدك. «إنت ساعدتني أكثر من أي شيخ قابلته في حياتي.»",
  },

  // ════════════════════════════════════════════════════════════════
  // SCAFFOLDED — content TODO
  // ════════════════════════════════════════════════════════════════
  "Mubarak Al-Hawaj": {
    npc: "Mubarak Al-Hawaj",
    title: "البسطة الثالثة",
    desc: "مبارك يبي يكبر دكانه قبل رمضان.",
    steps: [
      {
        title: "امشي معاه السوق",
        desc: "ساعده يدور موقع.",
        zone: "souq",
        energy: 10,
        rewards: { wasta: 2, money: 100 },
      },
      {
        title: "اضبط الإيجار",
        desc: "اربح مجادلة ضد المالك المتشدد.",
        zone: "souq",
        energy: 16,
        rewards: { wasta: 6, money: 300, faction: "merchants", factionAmt: 4 },
        requiresDuel: "debate",
      },
      {
        title: "يوم الافتتاح",
        desc: "احضر الافتتاح. جيب ثلاث أسماء محترمة معاك.",
        zone: "souq",
        energy: 14,
        rewards: { wasta: 8, rep: 5, faction: "merchants", factionAmt: 5 },
      },
    ],
    completion:
      "البسطة الثالثة تفتح بزحمة. مبارك يعطيك شال مطرّز. «اللي يسأل، قل له: أنا مَدِين لك.»",
  },

  "Nasser Al-Qallaf": {
    npc: "Nasser Al-Qallaf",
    title: "تدريب الشاهين",
    desc: "ناصر يدرب شاهين جديد. يبيك شريك.",
    steps: [
      {
        title: "زيارة المخيم",
        desc: "اقضِ ليلة عند النار. اسمع عن طبائع الصقر.",
        zone: "desert",
        energy: 10,
        rewards: { rep: 2, faction: "tribal", factionAmt: 2 },
      },
      {
        title: "أول رحلة صيد",
        desc: "ساعد ناصر يصيد عند الفجر.",
        zone: "desert",
        energy: 18,
        rewards: { wasta: 3, rep: 3, faction: "tribal", factionAmt: 3 },
      },
      {
        title: "المسابقة",
        desc: "شارك كزميل لناصر.",
        zone: "desert",
        energy: 22,
        rewards: { wasta: 8, rep: 5, money: 400, faction: "tribal", factionAmt: 5 },
        requiresDuel: "falconry",
      },
    ],
    completion: "ناصر يعطيك تميمة من ريش الصقر. «صار لك جزء من البر.»",
  },

  "Sheikha Latifa": {
    npc: "Sheikha Latifa",
    title: "حلقة الإرشاد",
    desc: "الشيخة لطيفة تبني مبادرة إرشاد نسائية.",
    steps: [
      {
        title: "احضر الإطلاق",
        desc: "كن موجود. تكلم باختصار.",
        zone: "city",
        energy: 8,
        rewards: { rep: 4, faction: "government", factionAmt: 3 },
      },
      {
        title: "قدّم متحدثة",
        desc: "أدخل الحاجة فاطمة في الحلقة.",
        zone: "diwaniya",
        energy: 12,
        rewards: { wasta: 4, rep: 3, faction: "religious", factionAmt: 3 },
      },
      {
        title: "التجمع السنوي",
        desc: "اربح نزال فنجان ضد منتقد في التجمع.",
        zone: "city",
        energy: 20,
        rewards: { wasta: 10, rep: 8, faction: "government", factionAmt: 5 },
        requiresDuel: "gahwa",
      },
    ],
    completion:
      "الشيخة لطيفة تحط إيدها على كتفك. «إنت فهمت اللي نبنيه. هذا أهم من أي لقب.»",
  },

  "Bu Yousef": {
    npc: "Bu Yousef",
    title: "إصلاح من الداخل",
    desc: "أبو يوسف يبي يحدّث إدارته بدون ما يصنع أعداء.",
    steps: [
      {
        title: "افهم المشكلة",
        desc: "خذ يوم تتابع شغله.",
        zone: "govzone",
        energy: 14,
        rewards: { rep: 3, faction: "government", factionAmt: 2 },
      },
      {
        title: "ابن تحالف",
        desc: "اقنع يعقوب وراشد.",
        zone: "govzone",
        energy: 16,
        rewards: { wasta: 5, faction: "government", factionAmt: 5 },
      },
      {
        title: "جلسة الوزارة",
        desc: "دافع عن خطة الإصلاح. اربح مجادلة.",
        zone: "govzone",
        energy: 22,
        rewards: { wasta: 10, rep: 7, money: 500, faction: "government", factionAmt: 8 },
        requiresDuel: "debate",
      },
    ],
    completion:
      "أبو يوسف يعطيك ظرف مختوم. «من الوزير شخصياً.» جواه: شكر شخصي بخطه.",
  },

  "Hajja Fatma": {
    npc: "Hajja Fatma",
    title: "درس الجمعة",
    desc: "الحاجة فاطمة تبي تكبّر درس القرآن.",
    steps: [
      {
        title: "احضر جلسة",
        desc: "اقعد في الخلف بصمت.",
        zone: "diwaniya",
        energy: 6,
        rewards: { rep: 3, faction: "religious", factionAmt: 3 },
      },
      {
        title: "دور على مكان أكبر",
        desc: "كلّم الشيخ عبدالله عن غرفة في المسجد.",
        zone: "govzone",
        energy: 12,
        rewards: { rep: 4, faction: "religious", factionAmt: 4 },
      },
      {
        title: "أول درس كبير",
        desc: "ساعد يوم الافتتاح.",
        zone: "diwaniya",
        energy: 14,
        rewards: { wasta: 4, rep: 8, faction: "religious", factionAmt: 5 },
      },
    ],
    completion: "الحاجة فاطمة تباركك بطريقة تخلّي الغرفة تسكت. الأمهات يحفظون.",
  },

  Dalal: {
    npc: "Dalal",
    title: "صفقة دلال",
    desc: "دلال تطارد صفقة برند.",
    steps: [
      {
        title: "قهوة في الأفنيوز",
        desc: "اسمع طرحها. قل لها الصدق.",
        zone: "avenues",
        energy: 8,
        rewards: { rep: 2 },
      },
      {
        title: "اعمل التعريف",
        desc: "جمعها مع لولوة لأول مرة.",
        zone: "avenues",
        energy: 12,
        rewards: { wasta: 4, money: 200, faction: "merchants", factionAmt: 3 },
      },
      {
        title: "نزال الفنجان",
        desc: "منافس غيور يسخر منها علناً. دافع عن اسمها.",
        zone: "avenues",
        energy: 16,
        rewards: { wasta: 8, rep: 6 },
        requiresDuel: "gahwa",
      },
    ],
    completion:
      "دلال تكتب عنك. الفيديو يوصل ٨٠ ألف. تلفونك ما يسكت يوم كامل.",
  },
};
