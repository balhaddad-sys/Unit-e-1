/**
 * Wasta · Data: Story Quests
 * One per act. Story quests are how acts gate progression.
 *
 * STATUS:
 *   ✓ Act 1 quest fully wired
 *   ◔ Acts 2-5 scaffolded
 */

import type { StoryQuest } from "@/lib/types";

export const storyQuests: StoryQuest[] = [
  // ────────────────────────────────────────────────────────────────
  {
    id: "sq_act1",
    act: "act1_loneliness",
    title: "فنجان الترحيب",
    npc: "Umm Nasser",
    zone: "diwaniya",
    desc: "أم نصر تقعد في صدر كل قعدة. عشان تثبت اسمك، لازم توميء براسها لما يُذكر اسمك. وهي ما توميء بسهولة.",
    steps: [
      {
        label: "اذهب لحي الدواوين",
        check: (s) => s.location === "diwaniya",
      },
      {
        label: "اوصل بعلاقتك معها ٧٠+",
        check: (s) => (s.relationships["Umm Nasser"] ?? 0) >= 70,
      },
      {
        label: "اعمل لها معروف بدون ما تطلب",
        check: (s) =>
          s.favors.some((f) => f.who === "Umm Nasser" && f.kind === "owedToYou"),
      },
    ],
    rewards: { wasta: 8, rep: 5, money: 200, faction: "tribal", factionAmt: 5 },
    closing:
      "أم نصر تصب لك الفنجان الثالث. تقول بهدوء: «إنت مرحب فيك هنا.» الغرفة سمعت. اسمك صار يحمل شي الحين.",
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "sq_act2",
    act: "act2_validation",
    title: "أزمة الأختام",
    npc: "Bu Yousef",
    zone: "govzone",
    desc: "إدارة أبو يوسف في مأزق — تراكمت معاملات الأختام والأعصاب متوترة. ويبيلك اسم يستند عليه.",
    steps: [
      { label: "قابل أبو يوسف في مجمعات الحكومة", check: (s) => s.location === "govzone" },
      {
        label: "اوصل بعلاقتك معه ٧٥+",
        check: (s) => (s.relationships["Bu Yousef"] ?? 0) >= 75,
      },
      { label: "احتفظ بـ٢٥ واسطة على الأقل", check: (s) => s.stats.wasta >= 25 },
      {
        label: "اربح مجادلة عشان تضبط النبرة العامة",
        check: (s) => s.duelsWon >= 1,
      },
    ],
    rewards: { wasta: 15, rep: 10, money: 500, faction: "government", factionAmt: 8 },
    closing:
      "الأوراق تتحرك. أبو يوسف يصير يكلمك «أخوي» بدون ابتسامة جانبية. ما تطلب المعروف اللي يَدين لك فيه — تخليه في البنك.",
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "sq_act3",
    act: "act3_identity",
    title: "الصقر والراية",
    npc: "Nasser Al-Qallaf",
    zone: "desert",
    desc: "ناصر مقيم تجمع الصقّارة في البر. الشيخة لطيفة مقيمة عشا دولة، نفس الجمعة. الاثنين طلبوك علناً.",
    steps: [
      { label: "سافر مخيم البر", check: (s) => s.location === "desert" },
      { label: "اربح مسابقة صقّارة", check: (s) => s.falconryWon >= 1 },
      { label: "اوصل ٣٠+ مع القبيلة", check: (s) => s.factions.tribal >= 30 },
    ],
    rewards: { wasta: 25, rep: 15, money: 800, faction: "tribal", factionAmt: 12 },
    closing:
      "تحت ضوء النار، ناصر يقدم لك كوفية حمراء معقودة. يقول: «إنت صرت من العالمين الحين. شيلها زين.»",
    branch: {
      key: "act3_alignment",
      options: [
        {
          id: "tribal",
          label: "قف مع البر",
          effect: (s) => ({
            ...s,
            factions: {
              ...s.factions,
              tribal: s.factions.tribal + 10,
              merchants: Math.max(0, s.factions.merchants - 3),
            },
          }),
        },
        {
          id: "city",
          label: "كرّم الشيخة في المدينة",
          effect: (s) => ({
            ...s,
            factions: {
              ...s.factions,
              merchants: s.factions.merchants + 10,
              tribal: Math.max(0, s.factions.tribal - 3),
            },
          }),
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "sq_act4",
    act: "act4_burden",
    title: "حِمل الواسطة",
    npc: "Sheikh Abdullah",
    zone: "govzone",
    desc: "الشيخ عبدالله يستدعيك. عائلتين قديمين في نزاع. يثق فيك للوساطة.",
    steps: [
      { label: "اربح نزال فنجان", check: (s) => s.gahwaWon >= 1 },
      { label: "اوصل ٢٥+ مع المتدينين", check: (s) => s.factions.religious >= 25 },
      { label: "اوصل سمعة ٥٠+", check: (s) => s.stats.rep >= 50 },
      {
        label: "كلّم الحاجة فاطمة في الموضوع",
        check: (s) => (s.relationships["Hajja Fatma"] ?? 0) >= 70,
      },
    ],
    rewards: { wasta: 40, rep: 20, money: 1500, faction: "religious", factionAmt: 10 },
    closing: "العائلتين تعانقن. الشيخ عبدالله يطالعك طويل. يقول: «صدقت.»",
  },

  // ────────────────────────────────────────────────────────────────
  {
    id: "sq_act5",
    act: "act5_reckoning",
    title: "العرش الصامت",
    npc: "Sheikha Latifa",
    zone: "city",
    desc: "الشيخة لطيفة تعرض عليك مقعد في المجلس اللي يقرر الأمور اللي ما توصل للصحف.",
    steps: [
      { label: "اوصل ١٠٠+ واسطة", check: (s) => s.stats.wasta >= 100 },
      {
        label: "٣ انتماءات على ٣٠+",
        check: (s) => Object.values(s.factions).filter((v) => v >= 30).length >= 3,
      },
    ],
    rewards: { wasta: 60, rep: 30, money: 5000 },
    closing:
      "تطالعك من خلف الطاولة. القرار اللي تأخذه في هالغرفة — هو اللي اسمك راح يحمله.",
  },
];
