// src/data/zones.ts
// Travel destinations. Each has an energy cost.

import type { Zone } from "@/lib/types";

export const zones: Zone[] = [
  { id: "city", ar: "ديرة الكويت", en: "Kuwait City", icon: "🏙", cost: 0, desc: "Towers and ambition" },
  { id: "diwaniya", ar: "حي الدواوين", en: "Diwaniya District", icon: "☕", cost: 5, desc: "Where talk becomes decisions" },
  { id: "souq", ar: "سوق المباركية", en: "Souq Mubarakiya", icon: "⚱", cost: 6, desc: "Spices, gold, perfumes" },
  { id: "avenues", ar: "الأفنيوز", en: "The Avenues", icon: "✦", cost: 10, desc: "Luxury and chance meetings" },
  { id: "desert", ar: "مخيم البر", en: "Desert Camp", icon: "⌇", cost: 14, desc: "Soft sand, firelight, open sky" },
  { id: "govzone", ar: "مجمعات الحكومة", en: "Ministry District", icon: "⊞", cost: 7, desc: "Forms, stamps, shortcuts" },
  // ── New zones from build spec ──
  { id: "salmiya", ar: "السالمية", en: "Salmiya", icon: "⛵", cost: 8, desc: "Seafront, cafes, the corniche" },
  { id: "jahra", ar: "الجهراء", en: "Jahra", icon: "⌭", cost: 10, desc: "Old roads, deeper roots" },
  { id: "hawally", ar: "حولي", en: "Hawally", icon: "⚗", cost: 7, desc: "Dense streets, second-generation Kuwait" },
  { id: "failaka", ar: "جزيرة فيلكا", en: "Failaka Island", icon: "⌒", cost: 18, desc: "Ruins, ghosts, the sea wind" },
];

export function getZone(id: string): Zone {
  return zones.find((z) => z.id === id) || zones[0];
}
