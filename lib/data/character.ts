/**
 * Wasta · Data: Character Creation Options
 */

import type { ClassId, PersonalityId } from "@/lib/types";

export interface ClassOption {
  id: ClassId;
  icon: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
}

export const classes: ClassOption[] = [
  {
    id: "oil",
    icon: "⚡",
    nameAr: "تنفيذي نفط",
    nameEn: "Oil Executive",
    descAr: "جيوب عميقة وعلاقات في القطاع.",
  },
  {
    id: "gov",
    icon: "⚖",
    nameAr: "مسؤول حكومي",
    nameEn: "Government Official",
    descAr: "خبير في الأختام والاختصارات.",
  },
  {
    id: "falcon",
    icon: "☾",
    nameAr: "صقّار البر",
    nameEn: "Desert Falconer",
    descAr: "نَفَس طويل، يعرف البر.",
  },
  {
    id: "merchant",
    icon: "⚱",
    nameAr: "تاجر المباركية",
    nameEn: "Souq Merchant",
    descAr: "لسان فضي، حسابات سريعة.",
  },
];

export interface PersonalityOption {
  id: PersonalityId;
  nameAr: string;
  descAr: string;
}

export const personalities: PersonalityOption[] = [
  { id: "discreet", nameAr: "كتوم", descAr: "+فنجان · +٥٠ د.ك على المعاريف" },
  { id: "ambitious", nameAr: "طموح", descAr: "+مجادلة · +٢ واسطة على المهام" },
  { id: "patient", nameAr: "صبور", descAr: "+صقّارة · +٢٠% طاقة من الراحة" },
  { id: "generous", nameAr: "كريم", descAr: "+سمعة على كل تفاعل اجتماعي" },
];

export interface BackgroundOption {
  id: string;
  icon: string;
  nameAr: string;
  descAr: string;
  perkAr: string;
}

export const backgrounds: Record<ClassId, BackgroundOption[]> = {
  oil: [
    {
      id: "banker",
      icon: "₪",
      nameAr: "مصرفي سابق",
      descAr: "جيت من القطاع المالي. الناس لسا ترد على مكالماتك.",
      perkAr: "+٥ واسطة · صلة قوية مع راشد",
    },
    {
      id: "family",
      icon: "⚯",
      nameAr: "ابن عائلة",
      descAr: "ورثت اسم في القطاع. الأبواب تفتح قبل ما تطرق.",
      perkAr: "+٢٠٠ د.ك · صلة قوية مع أبو خالد",
    },
    {
      id: "selfmade",
      icon: "⚒",
      nameAr: "عصامي",
      descAr: "بنيتها بدون مساعدة. أحد ما يَدين لأحد.",
      perkAr: "+١٥ طاقة · +٣ سمعة",
    },
  ],
  gov: [
    {
      id: "academy",
      icon: "⊕",
      nameAr: "خريج الأكاديمية",
      descAr: "طلعت من برنامج تدريب الوزارة.",
      perkAr: "+٥ مع الحكومة · صلة مع أبو يوسف",
    },
    {
      id: "protege",
      icon: "☉",
      nameAr: "متبنّى",
      descAr: "شخصية كبيرة أخذتك تحت جناحها.",
      perkAr: "+٨ واسطة · صلة مع الشيخ عبدالله",
    },
    {
      id: "reformer",
      icon: "❋",
      nameAr: "مصلح هادئ",
      descAr: "تؤمن إن النظام لازم يخدم الناس.",
      perkAr: "+٥ سمعة · +٥ مع المتدينين",
    },
  ],
  falcon: [
    {
      id: "bedu",
      icon: "⌒",
      nameAr: "ابن البادية",
      descAr: "البر ربّاك. النجوم، الغبار، الصبر.",
      perkAr: "+١٥ طاقة · +٥ مع القبيلة",
    },
    {
      id: "weekend",
      icon: "☀",
      nameAr: "هروب من المدينة",
      descAr: "لقيت نفسك في البر. هناك تتنفس.",
      perkAr: "+١٥٠ د.ك · صلة مع أبو مشاري",
    },
    {
      id: "trainer",
      icon: "⚘",
      nameAr: "تلميذ صقّار",
      descAr: "تعلمت الفن من معلم.",
      perkAr: "+٥ سمعة · صلة مع ناصر القلاف",
    },
  ],
  merchant: [
    {
      id: "import",
      icon: "⚓",
      nameAr: "مستورد",
      descAr: "تجيب من الصين والهند.",
      perkAr: "+١٠٠ د.ك · صلة مع غنيمة",
    },
    {
      id: "third_gen",
      icon: "⌂",
      nameAr: "جيل ثالث",
      descAr: "جدّك فتح الدكان. أنت أكبرت.",
      perkAr: "+٥ واسطة · صلة مع مبارك الحواج",
    },
    {
      id: "online",
      icon: "✦",
      nameAr: "تاجر إنستغرام",
      descAr: "بنيتها من الصفحة. السوق يستعجب.",
      perkAr: "+١٠٠ د.ك · صلة مع دلال",
    },
  ],
};
