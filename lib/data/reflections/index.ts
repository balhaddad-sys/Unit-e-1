/**
 * Wasta · Data: Reflections
 * Weekly mirror moments. Fire every 7 days on rest.
 *
 * Voice: locked — first-person, spoken, no "إنت رجال..." formula.
 *
 * To add a reflection: append to this array. The selector picks the
 * highest-priority one whose `check` passes, breaking ties by recency.
 */

import type { Reflection } from "@/lib/types";
import { hasTrait, hasFlag } from "@/lib/engine/initialState";

export const reflections: Reflection[] = [
  // ─── EARLY GAME ────────────────────────────────────────────────
  {
    setting: "corniche",
    settingText: "المغرب على الكورنيش. الأبراج تشتعل وحدة وراء الثانية.",
    reflection:
      "مر أسبوع. ما زلت ما أحد يعرفني. بس — لأول مرة من نزلت — حسيت إني عرفت روحي شوي.",
    check: (s) =>
      s.day >= 7 && s.day < 14 && Object.values(s.relationships).filter((v) => v >= 30).length === 0,
    priority: 1,
  },
  {
    setting: "father_house",
    settingText: "الجمعة. أبوي قاعد على كرسيه يقرا. ما نتكلم.",
    reflection:
      "قاعد جنب أبوي وما نتكلم. قبل كان هذا يضايقني. الحين، صرت أفهم — السكوت مو فراغ، هذا كلام ثاني.",
    check: (s) => s.day >= 14 && s.day < 21,
    priority: 2,
  },

  // ─── EMERGING IDENTITY ─────────────────────────────────────────
  {
    setting: "fajr",
    settingText: "صلاة الفجر. لحالي في الصالة. كأس الماي بارد.",
    reflection:
      "صحيت قبل المدينة. مو قدّس للصمت — بس الكلام اللي أقوله لنفسي في هالساعة، هذا اللي قلبي يصدقه.",
    check: (s) => hasTrait(s, "pious") && s.day >= 21,
    priority: 5,
  },
  {
    setting: "diwaniya_late",
    settingText: "الديوانية. منتصف الليل. الكل طلع.",
    reflection:
      "الكل طلع. بقيت أساعد في تنظيف الفناجين. ما حد طلب. بس فهمت الليلة إن الديوانية مو في الكلام — هي في اللي يبقى بعد الكلام.",
    check: (s) => hasTrait(s, "loyal") && s.day >= 21 && s.factions.tribal >= 15,
    priority: 5,
  },
  {
    setting: "souq_morning",
    settingText: "سوق المباركية، السابعة الصبح. مبارك الحواج يلوّح لي.",
    reflection:
      "صرت يعرفونني باعة الفجر باسمي. هذي مو واسطة — هذي شي ثاني. صرت من نسيج المكان، يعني.",
    check: (s) => hasTrait(s, "diplomatic") && s.factions.merchants >= 20,
    priority: 5,
  },

  // ─── MIDGAME ───────────────────────────────────────────────────
  {
    setting: "rooftop_eid",
    settingText: "صباح العيد على سطح بيت العائلة. أمي توزع الكليجا.",
    reflection: "يعيّدون عليّ الكل اليوم. حتى ناس ما توقعت إنهم يتذكرون. صراحة، هذا شي ما له ثمن.",
    check: (s) => s.day >= 90,
    priority: 7,
  },
  {
    setting: "diwaniya_speak",
    settingText: "الديوانية. القعدة طويلة. أعرف نص الجالسين.",
    reflection:
      "تكلمت قبل ما أُسأل. لأول مرة. الغرفة كانت تنتظر صوتي — وأنا ما حسيت بالتحول إلا الحين.",
    check: (s) => s.stats.wasta >= 40 && hasTrait(s, "diplomatic"),
    priority: 6,
  },
  {
    setting: "fajr",
    settingText: "صلاة الفجر في مسجد الشيخ عبدالله. صرت من المنتظمين.",
    reflection:
      "لقيت راحة في الصلاة. مو إني صرت قديس — أنا أبعد ما يكون عن هذا — بس شي فيّ يهدا هنا. يمكن هذا اللي فقدته بره.",
    check: (s) => hasTrait(s, "pious") && s.factions.religious >= 30,
    priority: 7,
  },
  {
    setting: "corniche_run",
    settingText: "الكورنيش، عصر السبت. أركض. بطّلت الركض من سنين.",
    reflection: "بديت أهتم بنفسي من جديد. مو لأن أحد طلب — لأني، أخيراً، طلبت.",
    check: (s) => s.day >= 60 && s.stats.energy > 60,
    priority: 4,
  },

  // ─── RUTHLESS PATH ─────────────────────────────────────────────
  {
    setting: "mosque_after",
    settingText: "بعد المغرب. الشيخ عبدالله يطالعني من بعيد بس ما يقرّب.",
    reflection: "لاحظت ابتعاد الشيخ. ما قال شي. بس الصمت يتكلم. وأنا — اخترت أسكت بعد.",
    check: (s) => hasTrait(s, "ruthless") && s.factions.religious < 5,
    priority: 8,
  },
  {
    setting: "rooftop_lonely",
    settingText: "العيد. قاعد في غرفتي بدال ما أنزل.",
    reflection:
      "بديت أتعب من الناس. مو انتصار ولا هزيمة — هذا ثمن. كنت أعرف إنه راح يجي. وجى.",
    check: (s) => hasTrait(s, "feared") || (hasTrait(s, "ruthless") && s.day >= 80),
    priority: 8,
  },

  // ─── LOYAL PATH ────────────────────────────────────────────────
  {
    setting: "father_house_kitchen",
    settingText: "الليل. أمي قاعدة معاي في المطبخ. تسوي خبز قُرص.",
    reflection:
      "لقيت البيت في صحن خبز قُرص. ما كنت أعرف إني بحاجة هالشي. بس الحين فاهم — هذي الأشياء الصغيرة هي البيت كله.",
    check: (s) => hasTrait(s, "loyal") && s.day >= 50,
    priority: 7,
  },
  {
    setting: "desert_fire",
    settingText: "البر. النار تهدا. ناصر يحكي قصة عن جده.",
    reflection:
      "الحين فهمت ليش الكويتيين يطلعون البر. مو للهروب — للذكرى. الأرض تحفظ شي ما تحفظه المدينة.",
    check: (s) => s.factions.tribal >= 35 && hasTrait(s, "loyal"),
    priority: 7,
  },

  // ─── HONORABLE PATH ────────────────────────────────────────────
  {
    setting: "mosque_invitation",
    settingText: "بعد المغرب. الشيخ عبدالله دعاني لمكتبه.",
    reflection:
      "الشيخ يستقبلني بدون موعد. مو امتياز — اعتراف. واعتراف الكبار شي قليل في هالزمن.",
    check: (s) => hasTrait(s, "honorable") && (s.relationships["Sheikh Abdullah"] ?? 0) >= 75,
    priority: 8,
  },
  {
    setting: "diwaniya_seat",
    settingText: "ديوانية أبو خالد. قاعد عن يمينه.",
    reflection:
      "قعّدوني عن يمين أبو خالد. ما طلبت. الكرسي وُجد لي بصمت. والصمت في هالأمور أعلى من الكلام.",
    check: (s) => hasTrait(s, "trusted") && (s.relationships["Bu Khalid"] ?? 0) >= 80,
    priority: 9,
  },

  // ─── ROCK BOTTOM ───────────────────────────────────────────────
  {
    setting: "corniche_dawn",
    settingText: "الكورنيش. الصبح بدري. ما نمت.",
    reflection:
      "وصلت لقاع ما كان في الحسبان. ما نمت. قاعد أطالع البحر. الصعود ممكن — أعرف هذي. بس راح يكون بطيء، ولازم أستاهله.",
    check: (s) => hasFlag(s, "rockBottom"),
    priority: 10,
  },
  {
    setting: "mother_kitchen",
    settingText: "بيت أهلي. أمي قاعدة جنبي. تحط إيدها على إيدي.",
    reflection:
      "بعض الجروح ما تنداوى بالكلام. الأمهات يعرفون. إيد وحدة على إيد، بصمت، تسوي اللي ما تسويه ألف نصيحة.",
    check: (s) => s.stats.rep < -5,
    priority: 9,
  },

  // ─── THE QUESTION ──────────────────────────────────────────────
  {
    setting: "mirror",
    settingText: "الفجر. ما نمت زين. أطالع نفسي في المراية طويل.",
    reflection:
      "وقفت قدام المراية. السؤال طلع لحاله: 'أنا — أحب اللي صرت عليه؟' ما رديت. الصمت كان رد كافي.",
    check: (s) => s.day >= 60 && s.day % 21 === 0,
    priority: 5,
  },
];

/** Pick the right reflection given current state, biased toward freshness. */
export function selectReflection(state: { day: number; relationships: Record<string, number>; stats: { rep: number; energy: number; wasta: number; money: number }; factions: Record<string, number>; traits: string[]; worldFlags: Record<string, unknown> }): Reflection | null {
  const eligible = reflections.filter((r) => {
    try {
      return r.check(state as never);
    } catch {
      return false;
    }
  });
  if (eligible.length === 0) return null;
  eligible.sort((a, b) => b.priority - a.priority);
  return eligible[0];
}

export function shouldTriggerReflection(state: {
  day: number;
  worldFlags: Record<string, unknown>;
}): boolean {
  if (state.day < 7) return false;
  if (state.day % 7 !== 0) return false;
  if (state.worldFlags.lastReflectionDay === state.day) return false;
  return true;
}
