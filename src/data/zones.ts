import type { Zone } from "@/lib/types";

export const zones: Zone[] = [
  { id: "city",     ar: "مدينة الكويت",  en: "Kuwait City",       icon: "◇", cost: 5,  desc: "Towers, marble lobbies, the long table." },
  { id: "diwaniya", ar: "الديوانية",      en: "Diwaniya District", icon: "◈", cost: 4,  desc: "Where names are made and broken over coffee." },
  { id: "souq",     ar: "سوق المباركية",  en: "Souq Mubarakiya",   icon: "❖", cost: 6,  desc: "Old stalls, perfume, the merchant network." },
  { id: "avenues",  ar: "الأفنيوز",        en: "The Avenues",        icon: "◯", cost: 7,  desc: "New money, café tables, brand deals." },
  { id: "desert",   ar: "البر",            en: "Desert Camp",        icon: "☾", cost: 12, desc: "Fire, falcons, the family before the city." },
  { id: "govzone",  ar: "وزارات",          en: "Ministry District",  icon: "⌘", cost: 6,  desc: "Stamps, queues, doors that open if you know the right hand." },
  { id: "salmiya",  ar: "السالمية",       en: "Salmiya",            icon: "⛵", cost: 8,  desc: "Seafront, cafes, the corniche." },
  { id: "jahra",    ar: "الجهراء",        en: "Jahra",              icon: "⌭", cost: 10, desc: "Old roads, deeper roots." },
  { id: "hawally",  ar: "حولي",           en: "Hawally",            icon: "⚗", cost: 7,  desc: "Dense streets, second-generation Kuwait." },
  { id: "failaka",  ar: "جزيرة فيلكا",   en: "Failaka Island",     icon: "⌒", cost: 18, desc: "Ruins, ghosts, the sea wind." },
];
