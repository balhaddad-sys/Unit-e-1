/**
 * Wasta · Data: Acts (5-Act Emotional Arc)
 *
 * Each act represents one emotional season:
 *   1. الوحدة     (Loneliness)     — you are no one
 *   2. الاعتراف    (Validation)     — first warmth
 *   3. الانقسام    (Identity Crisis) — choose between worlds
 *   4. الحِمل      (Burden)         — carry what you built
 *   5. الحساب      (Reckoning)      — what kind of man did you become
 *
 * Voice: locked Kuwaiti dialect. NO "إنت رجال..." formula opener.
 *
 * STATUS:
 *   ✓ Act 1 — production-ready (vertical slice)
 *   ◔ Acts 2-5 — scaffolded with default intro/closing only.
 *                Variants and full branches are TODOs marked in code.
 *                See /docs/contribute/adding-acts.md to flesh them out.
 */

import type { Act } from "@/lib/types";
import { hasFlag, hasTrait } from "@/lib/engine/initialState";

export const acts: Act[] = [
  // ════════════════════════════════════════════════════════════════
  // ACT 1 — الوحدة (Loneliness)
  // ════════════════════════════════════════════════════════════════
  {
    id: "act1_loneliness",
    n: 1,
    titleEmotional: "الوحدة",
    titleStructural: "الوافد",

    introDefault: `دخلت الديوانية أول مرة. ما عرفني أحد. أبو خالد عرّفني على الجالسين بسرعة — اسم وراء اسم — وبعدين الكلام انتقل لأمور ثانية.

قعدت في الزاوية. شربت ثلاث فناجين. سمعت كلام عن ناس ما أعرفهم وصفقات ما شفتها وأسعار ما عشتها.

رجعت البيت منتصف الليل. أبوي لسا صاحي يقرا. ما تكلمنا.

السؤال اللي يضايقني هالأسابيع الأولى مو "شلون أصعد؟" — هو "ليش أصعد أصلاً؟ لمنو؟"`,

    introVariants: [
      {
        check: (s) => hasFlag(s, "p3_self_built"),
        text: `دخلت الديوانية أول مرة. قلت لنفسي على الكورنيش الصبح: «أبني اسم يخصني، مو اسم أبوي.»

بس الحين، قاعد في زاوية الديوانية أشرب فنجان ثالث ووجوه ما تعرفني، حسيت الفرق بين القرار والواقع. القرار طلع لحاله. الواقع راح ياخذ سنين.

السؤال اللي طلع البارحة عند البحر صار له صدى الحين: شنو معنى "اسم يخصني" لما الكل يعرفك بأبوك؟`,
      },
      {
        check: (s) => hasFlag(s, "p3_father_first"),
        text: `دخلت الديوانية أول مرة. أبو خالد قدّمني كـ "ولد فلان". ما زاد، ما نقص.

وأنا — اللي قلت على الكورنيش الصبح إن أرفع اسم أبوي يكفيني — حسيت بشي صغير ما توقعته. حسيت بالفخر، إيه. بس حسيت بعد بشي ثاني — إن "ولد فلان" مو اسم. هذا تعريف.

وبدا يتضح لي إن الواجب أعقد من اللي توقعته.`,
      },
      {
        check: (s) => hasFlag(s, "p3_open"),
        text: `دخلت الديوانية بدون قرار. هذا اللي قلته لنفسي على الكورنيش — أمشي لين أعرف.

قعدت في الزاوية. سمعت. ما تكلمت. لاحظت كل شي — منو يضحك ومتى، منو يصب القهوة، منو ينتظر يُسأل قبل ما يتكلم.

الحلو في القرار باللاقرار: تبدا تشوف. الصعب: ما عندك ركيزة لما يجيك السؤال.`,
      },
    ],

    centralQuestion: "ليش أسوي هالشي؟",

    quietBeat: {
      title: "صباح الجمعة",
      text: `الجمعة. الكورنيش هادي قبل الأذان. اشتريت كرك من كشك صغير — رجال بنغالي يبتسم لي بثبات يومي.

قعدت على الحاجز. الشمس تطلع.

مرت يم وحدة كبيرة في السن ومعاها حفيدها. طالعتني. قالت للولد، عالي بما يكفي إني أسمع: «هذا ولد أبو فلان. ولد طيب. أبوي الله يرحمه كان يعرف يدّه.»

تعدّوا. ما لاحظت إني أبتسم. حسيت بشي صغير، شي كان غايب من نزلت من الطيارة. مو شي عظيم. لحظة بس. لحظة قال فيها أحد اسم العائلة وأنا ما كنت غريب عنه.`,
    },

    exitCond: (s) =>
      Object.values(s.relationships).filter((v) => v >= 70).length >= 2 &&
      s.questsDone >= 2,

    branches: {
      key: "act1_path",
      prompt: "كيف عرفك الناس في الموسم الأول؟",
      options: [
        {
          id: "by_service",
          label: "بالخدمة — ساعدت اللي احتاج لي",
          gainsTrait: "honorable",
          worldFlag: "act1_by_service",
          carriedToNext: "الناس تتذكر إيدك المفتوحة.",
        },
        {
          id: "by_charm",
          label: "باللباقة — ضحّكتهم وريّحتهم",
          gainsTrait: "diplomatic",
          worldFlag: "act1_by_charm",
          carriedToNext: "الناس تتذكر ابتسامتك في الغرفة.",
        },
        {
          id: "by_family_name",
          label: "باسم أبوي — ما خذلت العائلة",
          gainsTrait: "loyal",
          worldFlag: "act1_by_family",
          carriedToNext: "الناس تتذكر إنك ابن منو.",
        },
        {
          id: "by_force",
          label: "بالقوة — ما خليتهم يتجاوزوني",
          gainsTrait: "confrontational",
          worldFlag: "act1_by_force",
          carriedToNext: "الناس تتذكر صوتك لما رفعته.",
        },
        // Personalized — only available if calculating lean from prologue
        {
          id: "by_silence",
          label: "بالسكوت — لاحظت الكل ولاحظوني بدون ما أقول شي",
          requiresTrait: "calculating",
          gainsTrait: "calculating",
          worldFlag: "act1_by_silence",
          carriedToNext: "الناس تتذكر حضورك حتى لما ما تحضر.",
        },
        // Personalized — only if you sat in silence with father
        {
          id: "by_father_legacy",
          label: "ما عرفوني — عرفوا أبوي فيّ، وأنا قبلت هذا",
          requiresFlag: "p2_silent",
          gainsTrait: "loyal",
          worldFlag: "act1_father_through_me",
          carriedToNext: "صرت قناة — مو شخص. هذا قرار بحاله.",
        },
      ],
    },

    closingDefault: `خلص الموسم الأول. ما عدت غريب تماماً. الناس تومّى لي في الديوانية. أبو خالد سأل أبوي عني بطريقة فيها فخر، مو استفسار. أمي بدت تدخل الصالة بدال ما تعدّي عليها.

اللحظة اللي خفّت فيها الوحدة ما جت كانتصار. جت في صباح جمعة بسيط، لما قالت يم لولدها: «هذا ولد أبو فلان. ولد طيب.» ما كان شي. وكان كل شي.

الحين — والباب فتح شوي — السؤال راح يتغير.`,

    closingVariants: [
      {
        check: (s) => hasFlag(s, "act1_by_force"),
        text: `خلص الموسم الأول. الناس تعرفني، إيه — بس بطريقة ما توقعتها. صار في احترام، وفي حذر بعد. لاحظت إن الكلام يهدا لما أدخل الديوانية.

هذا انتصار من نوع، بس له ثمن. أبوي ما قال شي مباشر — بس مرة، وأنا قاعد جنبه، قال بصوت خفيف: «الرجال اللي يفرض احترامه، يحتاج عمر كامل ليثبته. اللي يكسبه، يبقى معاه بدون جهد.»

ما رديت. سمعت.`,
      },
      {
        check: (s) => hasFlag(s, "act1_by_silence"),
        text: `خلص الموسم الأول. ناس قليلة تعرفني — بس اللي يعرفوني، يعرفونني زين. هذا اختيار. السكوت في الديوانية بنى لي مكان مختلف عن الكلام.

أبو خالد قال لي مرة: «إنت تشبه واحد. أبوك كان ساكت بعد، أول ما رجع من بريطانيا. يقعد ساعتين بدون كلمة، بعدين يقول جملة وحدة تنهي النقاش.»

ما عرفت إن أبوي كان كذا. تذكرت — وأنا أمشي للسيارة — إن في أشياء كثيرة ما زلت ما أعرفها عنه.`,
      },
      {
        check: (s) => hasTrait(s, "honorable") && hasFlag(s, "act1_by_service"),
        text: `خلص الموسم الأول. الناس تومّى لي. واحد من التجار قال للحوّاج، وأنا ما أنتبه: «هذا الولد، يساعد بدون ما يحاسب. هذا اللي صار قليل.»

سمعت لاحقاً. ما قلت لأحد إني سمعت. بس وأنا أرجع البيت، حسيت بشي ما حسيت فيه من زمان. شيء قريب من الفخر. بس مو فخر. شي ثاني. شي يشبه الراحة.`,
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // ACT 2 — الاعتراف (Validation)
  // STATUS: scaffolded — content from /docs/design/acts.md to be ported
  // ════════════════════════════════════════════════════════════════
  {
    id: "act2_validation",
    n: 2,
    titleEmotional: "الاعتراف",
    titleStructural: "الصاعد",
    introDefault:
      "الباب فتح. مو على مصراعيه — بس فتح. صرت أستقبل دعوات ما كنت أستقبلها قبل ثلاث شهور. أم نصر تتذكر اسمي. أبو يوسف اتصل فيني مرتين هالأسبوع.\n\nهالموسم فيه دفء ما كان موجود قبل. بس الدفء له ثمن. كل إيد تمتد لي تتوقع إيد ممدودة مني. السؤال اللي يضايقني: شنو اللي مستعد أَدين فيه؟",
    introVariants: [],
    centralQuestion: "شنو اللي راح تَدين فيه؟",
    exitCond: (s) => s.questsDone >= 6 && s.stats.wasta >= 25,
    branches: {
      key: "act2_path",
      prompt: "لما كثرت الإيد الممدودة لك، شنو سويت؟",
      options: [
        // TODO(content): Port full branch content from /docs/design/acts.md
        {
          id: "give_freely",
          label: "عطيت بسخاء — كل إيد ممدودة لقت إيدي",
          gainsTrait: "honorable",
          worldFlag: "act2_giver",
        },
        {
          id: "selective",
          label: "اخترت بدقة — ما أحب أَدين، ولا أحب يُدان لي",
          gainsTrait: "calculating",
          worldFlag: "act2_selective",
        },
      ],
    },
    closingDefault:
      "خلص الموسم الثاني. ما عدت غريب، وما عدت ضيف — صرت عضو. بس العضوية مو مجانية. كل اللي حصلت عليه فيه توقيعك.",
    closingVariants: [],
  },

  // ════════════════════════════════════════════════════════════════
  // ACT 3 — الانقسام (Identity Crisis)
  // STATUS: scaffolded
  // ════════════════════════════════════════════════════════════════
  {
    id: "act3_identity",
    n: 3,
    titleEmotional: "الانقسام",
    titleStructural: "المُحرِّك",
    introDefault:
      "لازم أختار. يمكن لأول مرة. ناصر القلاف يقيم تجمّع الصقّارة في البر يوم الجمعة. الشيخة لطيفة تقيم عشا دولة في المدينة، نفس الجمعة.\n\nهذي مو مشكلة لوجستيّة — هذا سؤال عن منو أنا. أيّ رجال أنا، لما ما أحد يشوفني؟",
    introVariants: [],
    centralQuestion: "منو أنا، لما ما أحد يشوفني؟",
    exitCond: (s) => s.questsDone >= 12 && s.stats.wasta >= 50 && s.stats.rep >= 30,
    branches: {
      key: "act3_alignment",
      prompt: "أيّ نار تقعد عندها الليلة؟",
      options: [
        {
          id: "stand_with_desert",
          label: "البر — قبلت الكوفية وفوّتت العشا",
          gainsTrait: "loyal",
          worldFlag: "tribal_son",
        },
        {
          id: "honor_city",
          label: "المدينة — تركت البر قبل المسابقة",
          gainsTrait: "calculating",
          worldFlag: "city_aligned",
        },
      ],
    },
    closingDefault:
      "الفصل الثالث ينتهي وأنا أوضح من بدايته. عرفت شنو أختار لما يجبرني الموقف.",
    closingVariants: [],
  },

  // ════════════════════════════════════════════════════════════════
  // ACT 4 — الحِمل (Burden)
  // STATUS: scaffolded
  // ════════════════════════════════════════════════════════════════
  {
    id: "act4_burden",
    n: 4,
    titleEmotional: "الحِمل",
    titleStructural: "صاحب المجلس",
    introDefault:
      "الكلمة اللي أقولها يوم الخميس تتردد على ألسنة ما أعرفها يوم السبت. الشيخ عبدالله يستدعيني. عائلتين قديمين، نزاع أكبر مني، ويبيني أتوسط.\n\nالسؤال: بقدر أحمل هذا بدون ما أصير الشي اللي أقسمت إني ما راح أصيره؟",
    introVariants: [],
    centralQuestion: "بقدر أحمل هذا بدون ما أنكسر؟",
    exitCond: (s) =>
      s.questsDone >= 20 &&
      s.stats.wasta >= 90 &&
      Object.values(s.factions).filter((v) => v >= 30).length >= 2,
    branches: {
      key: "act4_resolution",
      prompt: "كيف حملت اللي حُمّلته؟",
      options: [
        {
          id: "true_mediation",
          label: "بنزاهة — لقيت حل وسط حقيقي، حتى لو كلفني",
          gainsTrait: "honorable",
          worldFlag: "true_mediator",
        },
        {
          id: "favor_one_side",
          label: "بانتقائية — قبلت دفعة سرّية من جهة",
          gainsTrait: "ruthless",
          worldFlag: "tilted_mediation",
        },
      ],
    },
    closingDefault:
      "الفصل الرابع ينتهي وأنا مو الرجال اللي كنته في بدايته. الحِمل ترك آثاره.",
    closingVariants: [],
  },

  // ════════════════════════════════════════════════════════════════
  // ACT 5 — الحساب (Reckoning)
  // STATUS: scaffolded
  // ════════════════════════════════════════════════════════════════
  {
    id: "act5_reckoning",
    n: 5,
    titleEmotional: "الحساب",
    titleStructural: "رجل الكلمة",
    introDefault:
      "الشيخة لطيفة دعتني. عرضت عليّ مقعد في المجلس اللي يقرر الشؤون اللي ما توصل للصحف. القبول يغير حياتي. الرفض يخليني حر.\n\nبس لحظة القرار، اكتشفت إن السؤال مو عن المقعد. السؤال عن كل شي قبله.",
    introVariants: [],
    centralQuestion: "هل كان كل هذا يستاهل؟",
    exitCond: () => false, // Endgame — see /lib/data/endings.ts (Phase 3)
    branches: {
      key: "act5_choice",
      prompt: "شنو تختار؟",
      options: [
        { id: "accept_seat", label: "اقبل المقعد", gainsTrait: "trusted" },
        { id: "refuse_freedom", label: "ارفض — اخدم من برّا", gainsTrait: "honorable" },
      ],
    },
    closingDefault: "",
    closingVariants: [],
  },
];

/**
 * Pick the right intro for the current state.
 * Used by the Act-Transition card.
 */
export function pickIntro(act: Act, state: { worldFlags: Record<string, unknown>; traits: string[] }): string {
  for (const variant of act.introVariants) {
    if (variant.check(state as never)) return variant.text;
  }
  return act.introDefault;
}

export function pickClosing(act: Act, state: { worldFlags: Record<string, unknown>; traits: string[] }): string {
  for (const variant of act.closingVariants) {
    if (variant.check(state as never)) return variant.text;
  }
  return act.closingDefault;
}
