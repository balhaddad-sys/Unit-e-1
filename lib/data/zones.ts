/**
 * Wasta · Data: Zones
 * The places the player can travel to.
 */

import type { Zone } from "@/lib/types";

export const zones: Zone[] = [
  {
    id: "city",
    nameAr: "ديرة الكويت",
    nameEn: "Kuwait City",
    icon: "🏙",
    cost: 0,
    descAr: "الأبراج والطموح",
  },
  {
    id: "diwaniya",
    nameAr: "حي الدواوين",
    nameEn: "Diwaniya District",
    icon: "☕",
    cost: 5,
    descAr: "الكلام يصير قرار",
  },
  {
    id: "souq",
    nameAr: "سوق المباركية",
    nameEn: "Souq Mubarakiya",
    icon: "⚱",
    cost: 6,
    descAr: "بهارات، ذهب، عطر",
  },
  {
    id: "avenues",
    nameAr: "الأفنيوز",
    nameEn: "The Avenues",
    icon: "✦",
    cost: 10,
    descAr: "الفخامة واللقاءات الصدفة",
  },
  {
    id: "desert",
    nameAr: "مخيم البر",
    nameEn: "Desert Camp",
    icon: "⌇",
    cost: 14,
    descAr: "رمل ناعم، نار، سما مفتوحة",
  },
  {
    id: "govzone",
    nameAr: "مجمعات الحكومة",
    nameEn: "Ministry District",
    icon: "⊞",
    cost: 7,
    descAr: "معاملات، أختام، طرق مختصرة",
  },
];
