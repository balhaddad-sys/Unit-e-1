// src/data/classes.ts
// Player classes — six origins with different stat tilts.

import type { Class } from "@/lib/types";

export const classes: Class[] = [
  {
    id: "oil",
    icon: "⚡",
    ar: "تنفيذي نفط",
    en: "Oil Executive",
    descEn: "Deep pockets and corporate connections.",
    stats: { wasta: 12, money: 900, rep: 8, energy: 70 },
    factions: { merchants: 5, government: 3 },
  },
  {
    id: "gov",
    icon: "⚖",
    ar: "مسؤول حكومي",
    en: "Government Official",
    descEn: "Master of stamps, forms, shortcuts.",
    stats: { wasta: 18, money: 450, rep: 12, energy: 75 },
    factions: { government: 8, religious: 2 },
  },
  {
    id: "falcon",
    icon: "☾",
    ar: "صقار البر",
    en: "Desert Falconer",
    descEn: "High stamina, mastery of the desert.",
    stats: { wasta: 8, money: 300, rep: 10, energy: 110 },
    factions: { tribal: 8 },
  },
  {
    id: "merchant",
    icon: "⚱",
    ar: "تاجر المباركية",
    en: "Souq Merchant",
    descEn: "Trading, bargaining, silver tongue.",
    stats: { wasta: 10, money: 650, rep: 10, energy: 85 },
    factions: { merchants: 8, tribal: 2 },
  },
  {
    id: "royal",
    icon: "♛",
    ar: "ولد عم العايلة",
    en: "Royal Cousin",
    descEn: "Inherited connections, inherited weight.",
    stats: { wasta: 28, money: 700, rep: 14, energy: 80 },
    factions: { government: 6, tribal: 6 },
  },
  {
    id: "tech",
    icon: "❖",
    ar: "مشهور التقنية",
    en: "Tech Influencer",
    descEn: "Viral reach, modern social power.",
    stats: { wasta: 11, money: 520, rep: 18, energy: 90 },
    factions: { merchants: 4 },
  },
];
