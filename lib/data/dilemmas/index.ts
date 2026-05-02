/**
 * Wasta · Data: Dilemmas
 * Ethical micro-choices that fire after rest (~50% rate by default).
 *
 * STATUS:
 *   ✓ 12 dilemmas in locked Arabic (the most-fired ones)
 *   ◔ Add more by following /docs/contribute/adding-dilemmas.md
 *
 * Categories:
 *   - social   : everyday Kuwaiti texture
 *   - shame    : public reputation tests
 *   - family   : extended family obligations
 *   - comedy   : light beats (always available)
 *   - anger    : confrontation moments
 *   - romance  : (gated to day >= 20)
 *   - crisis   : (gated to day >= 30)
 */

import type { Dilemma } from "@/lib/types";

export const dilemmas: Dilemma[] = [
  // ─── SOCIAL ─────────────────────────────────────────────────────
  {
    id: "the_one_who_asks",
    tag: "قرار ثقيل",
    title: "اللي يطلب",
    category: "social",
    text: "يفتح الموضوع وأنت تشرب فنجان: «أبي واحد محترم يدفع لي معاملة — اسمك يفتح الباب.» المعروف يجرّك مع جهة وضد جهة ثانية.",
    accept: {
      label: "اقبل واستخدم اسمك",
      wasta: 3,
      rep: 2,
      energy: -12,
      factions: { merchants: 2, government: -1 },
    },
    refuse: { label: "اعتذر بأدب", rep: -2, wasta: -1 },
  },
  {
    id: "unanswered_greeting",
    tag: "اختبار سمعة",
    title: "السلام اللي ما رد",
    category: "shame",
    text: "واحد ذكر في الديوانية إنك ما رديت سلامه أمس. كنت على التلفون. الغرفة لاحظت. أم نصر تطالع.",
    accept: { label: "اعتذر قدام الكل", rep: 2, energy: -5 },
    refuse: { label: "خلّه يهدا — ينسى", rep: -2 },
  },
  {
    id: "between_cousins",
    tag: "الخلاف",
    title: "بين ابن عمين",
    category: "family",
    text: "اثنين من دائرتك مختلفين على ميراث. كل واحد يجرّك معاه. في عرس الشهر القادم الكل بيكون في غرفة وحدة.",
    accept: { label: "اعمل وساطة", wasta: 4, rep: 1, energy: -15 },
    refuse: { label: "ابقى محايد وادع ربك", rep: -3 },
  },
  {
    id: "old_debt",
    tag: "دين قديم",
    title: "فلوس أو وجه",
    category: "social",
    text: "معرفة قديمة تطلب منك تسامحه ٢٠٠ دينار. وضعه ضنك. الكل يطالع شنو راح تسوي.",
    accept: { label: "سامحه — والله ما هو شي", money: -200, rep: 5, wasta: 3 },
    refuse: { label: "أصرّ — الدين دين", money: 200, rep: -3 },
  },
  {
    id: "the_whisper",
    tag: "الهمسة",
    title: "اسم سقط",
    category: "social",
    text: "تسمع شائعة مدمرة عن واحد تحترمه. الكلام كذب بس مقنع. الغرفة تستلذ.",
    accept: { label: "صحح الكلام", rep: 4, energy: -6, factions: { tribal: 2 } },
    refuse: { label: "خلّه يمشي — مو شغلك", rep: -1, wasta: 1 },
  },

  // ─── COMEDY ─────────────────────────────────────────────────────
  {
    id: "wrong_shoes",
    tag: "موقف",
    title: "النعال الغلط",
    category: "comedy",
    text: "تدخل الديوانية وتطالع تحت. لابس نعالين مختلفين. واحد بني، واحد أسود.",
    accept: { label: "اضحك مع نفسك واسولفها", rep: 3, energy: -3 },
    refuse: { label: "خبّي رجلك تحت الطاولة طول الليلة", rep: -2 },
  },
  {
    id: "wrong_whatsapp",
    tag: "موقف",
    title: "قروب الواتساب الغلط",
    category: "comedy",
    text: "ودّيت الميم لقروب العائلة بدل قروب الربع. أم أمك تسأل شنو معنى 'sus'. جدّك يكتب.",
    accept: { label: "اعتذر، اشرح، اقبل التريقة", rep: 1, energy: -2 },
    refuse: { label: "حذف للكل — بس كلهم شافوا", rep: -3 },
  },
  {
    id: "cousin_borrow",
    tag: "موقف",
    title: "ابن العم اللي يستلف",
    category: "comedy",
    text: "ابن عمك فيصل يحتاج 'بس ٥٠ دينار للخميس'. هو يحتاج ٥٠ دينار للخميس من أربع خميسات.",
    accept: { label: "حوّلها. مرة ثانية. (مالك إلا الصبر)", money: -50, rep: 1 },
    refuse: { label: "قل له والله ما عندي", rep: -1, wasta: 1 },
  },
  {
    id: "karak_emergency",
    tag: "موقف",
    title: "طوارئ الكرك",
    category: "comedy",
    text: "الساعة ٣ عصراً. كشك الكرك في الشارع خلصت عنده. الكرك البديل — صراحة — إهانة.",
    accept: { label: "سُق ٢٠ دقيقة لمحل الكرك الزين", money: -15, rep: 2, energy: 5 },
    refuse: { label: "اشرب الكرك السيء بصمت", rep: -1 },
  },

  // ─── ANGER ──────────────────────────────────────────────────────
  {
    id: "honking_man",
    tag: "مواجهة",
    title: "اللي يزمر",
    category: "anger",
    text: "إنت عند الإشارة. الراد خلفك يزمر قبل ما تطلع الخضرا. ثلاث مرات. طويل.",
    accept: { label: "انزل من السيارة وكلّمه", rep: -2, energy: -8 },
    refuse: { label: "تنفس. خلّ الموقف يمشي.", rep: 1, energy: -2 },
  },
  {
    id: "line_skipper",
    tag: "مواجهة",
    title: "اللي يقطع الطابور",
    category: "anger",
    text: "إنت في طابور الوزارة من ساعة ونص. واحد يعدّي على الكل، يقول 'بس توقيع واحد'.",
    accept: { label: "اعترضه أمام الكل", rep: -2, energy: -6 },
    refuse: { label: "خلّه يعدي — ما يستاهل المعركة", rep: 1, energy: -3 },
  },

  // ─── ROMANCE (gated) ────────────────────────────────────────────
  {
    id: "childhood_crush",
    tag: "القلب",
    title: "حب الطفولة",
    category: "romance",
    text:
      "في عرس، تشوفها مرة ثانية. اللي عيلتك ما وافقت عليها قبل ١٠ سنين. لحالها. تبتسم. الغرفة عالية الصوت بس تسمعها بطريقة ما.",
    available: (s) => s.day >= 20,
    accept: { label: "كلّمها — جرّب مرة ثانية", rep: -2, wasta: -1, energy: -8 },
    refuse: { label: "عدّي — اللي راح راح", rep: 1 },
  },

  // ─── CRISIS (gated) ─────────────────────────────────────────────
  {
    id: "uncle_health",
    tag: "أزمة",
    title: "خبر من الكويت",
    category: "crisis",
    text:
      "تلفون من أمك في منتصف الليل. عمك في المستشفى. ٧٠ سنة. الأطباء يقولون 'استعدوا'. عندك اجتماع كبير الصبح ما تقدر تأجله.",
    available: (s) => s.day >= 30,
    accept: { label: "ألغِ الاجتماع. روح للمستشفى.", energy: -20, rep: 5, wasta: -3 },
    refuse: {
      label: "ادخل الاجتماع. تلحقه بعدين.",
      wasta: 4,
      rep: -8,
      flag: "missed_uncle",
    },
  },
];
