import type { Background } from "@/lib/types";

export const backgrounds: Background[] = [
  {
    id: "old_money",
    name: "Old Money",
    desc: "Five generations of merchants. The name carries.",
    icon: "❖",
    perk: "+1000 KD, +4 merchants",
    apply: (s) => {
      s.stats.money += 1000;
      s.factions.merchants += 4;
    },
  },
  {
    id: "self_made",
    name: "Self-Made",
    desc: "You built it brick by brick. People respect that quietly.",
    icon: "✦",
    perk: "+5 rep, +10 energy cap",
    apply: (s) => {
      s.stats.rep += 5;
      s.stats.energy += 10;
    },
  },
  {
    id: "desert_bred",
    name: "Desert-Bred",
    desc: "Your earliest memories smell like camp smoke.",
    icon: "☾",
    perk: "+6 tribal, +1 falconry edge",
    apply: (s) => {
      s.factions.tribal += 6;
    },
  },
  {
    id: "mosque_raised",
    name: "Mosque-Raised",
    desc: "The Imam knew your father. He still asks after you.",
    icon: "✷",
    perk: "+6 religious, +3 rep",
    apply: (s) => {
      s.factions.religious += 6;
      s.stats.rep += 3;
    },
  },
  {
    id: "ministry_kid",
    name: "Ministry Kid",
    desc: "Your father stamped papers for thirty years. The corridors know you.",
    icon: "⌘",
    perk: "+6 government, +500 KD",
    apply: (s) => {
      s.factions.government += 6;
      s.stats.money += 500;
    },
  },
  {
    id: "abroad",
    name: "Educated Abroad",
    desc: "London, Boston, Paris. You came back fluent in everything except this room.",
    icon: "✈",
    perk: "+1 wasta, +5 rep, -2 tribal",
    apply: (s) => {
      s.stats.wasta += 1;
      s.stats.rep += 5;
      s.factions.tribal -= 2;
    },
  },
];
