// src/data/backgrounds.ts
// Per-class background flavor and stat tilt.

import type { Background } from "@/lib/types";

export const backgrounds: Record<string, Background[]> = {
  oil: [
    {
      id: "banker",
      icon: "₪",
      name: "Ex-banker",
      desc: "You crossed over from the financial side. People still take your calls.",
      perk: "+5 starting wasta · Bond with Rashed",
      apply: (s) => {
        s.stats.wasta += 5;
        s.relationships["Rashed"] = 85;
        s.bg = "banker";
      },
    },
    {
      id: "family",
      icon: "⚯",
      name: "Family business",
      desc: "You inherited a name in the industry. Doors open before you knock.",
      perk: "+200 starting money · Bond with Bu Khalid",
      apply: (s) => {
        s.stats.money += 200;
        s.relationships["Bu Khalid"] = 90;
        s.bg = "family";
      },
    },
    {
      id: "selfmade",
      icon: "⚒",
      name: "Self-made",
      desc: "You built it without help. Less to lean on, but no one owes anyone anything.",
      perk: "+15 starting energy · +3 rep",
      apply: (s) => {
        s.stats.energy += 15;
        s.stats.rep += 3;
        s.bg = "selfmade";
      },
    },
  ],
  gov: [
    {
      id: "academy",
      icon: "⊕",
      name: "Academy graduate",
      desc: "You came up through the ministry training program — by the book.",
      perk: "+5 government rep · Bond with Bu Yousef",
      apply: (s) => {
        s.factions.government += 5;
        s.relationships["Bu Yousef"] = 85;
        s.bg = "academy";
      },
    },
    {
      id: "protege",
      icon: "☉",
      name: "Sheikh's protégé",
      desc: "A senior figure took you under their wing.",
      perk: "+8 starting wasta · Bond with Sheikh Abdullah",
      apply: (s) => {
        s.stats.wasta += 8;
        s.relationships["Sheikh Abdullah"] = 88;
        s.bg = "protege";
      },
    },
    {
      id: "reformer",
      icon: "❋",
      name: "Quiet reformer",
      desc: "You believe the system should serve people. Carefully.",
      perk: "+5 rep · +5 religious rep",
      apply: (s) => {
        s.stats.rep += 5;
        s.factions.religious += 5;
        s.bg = "reformer";
      },
    },
  ],
  falcon: [
    {
      id: "bedu",
      icon: "⌒",
      name: "Born to the badiya",
      desc: "The desert raised you. Stars, dust, patience.",
      perk: "+15 energy · +5 tribal rep",
      apply: (s) => {
        s.stats.energy += 15;
        s.factions.tribal += 5;
        s.bg = "bedu";
      },
    },
    {
      id: "weekend",
      icon: "☀",
      name: "City escape",
      desc: "You found yourself in the desert. It's where you breathe now.",
      perk: "+150 money · Bond with Bu Mishari",
      apply: (s) => {
        s.stats.money += 150;
        s.relationships["Bu Mishari"] = 85;
        s.bg = "weekend";
      },
    },
    {
      id: "trainer",
      icon: "⚘",
      name: "Falconer's apprentice",
      desc: "You learned the craft from a master. Now people learn from you.",
      perk: "+5 rep · Bond with Nasser Al-Qallaf",
      apply: (s) => {
        s.stats.rep += 5;
        s.relationships["Nasser Al-Qallaf"] = 85;
        s.bg = "trainer";
      },
    },
  ],
  merchant: [
    {
      id: "souq-born",
      icon: "⚖",
      name: "Born in the souq",
      desc: "Your family has had the same stall for three generations.",
      perk: "+10 merchants rep · Bond with Mubarak Al-Hawaj",
      apply: (s) => {
        s.factions.merchants += 10;
        s.relationships["Mubarak Al-Hawaj"] = 88;
        s.bg = "souq-born";
      },
    },
    {
      id: "importer",
      icon: "⛵",
      name: "Importer",
      desc: "Your goods come from far away. People pay for the rare.",
      perk: "+300 money · Bond with Ghanima",
      apply: (s) => {
        s.stats.money += 300;
        s.relationships["Ghanima"] = 85;
        s.bg = "importer";
      },
    },
    {
      id: "jeweler",
      icon: "⊛",
      name: "Gold and pearls",
      desc: "You trade in things that hold their value.",
      perk: "+8 wasta · +5 rep",
      apply: (s) => {
        s.stats.wasta += 8;
        s.stats.rep += 5;
        s.bg = "jeweler";
      },
    },
  ],
  royal: [
    {
      id: "close",
      icon: "♚",
      name: "Close cousin",
      desc: "You sit at the inner tables.",
      perk: "+10 wasta · +10 government rep",
      apply: (s) => {
        s.stats.wasta += 10;
        s.factions.government += 10;
        s.bg = "close";
      },
    },
    {
      id: "distant",
      icon: "♔",
      name: "Distant cousin",
      desc: "You carry the name without the weight.",
      perk: "+200 money · +5 rep",
      apply: (s) => {
        s.stats.money += 200;
        s.stats.rep += 5;
        s.bg = "distant";
      },
    },
    {
      id: "black-sheep",
      icon: "☾",
      name: "Black sheep",
      desc: "They don't talk about you at majlis. Yet.",
      perk: "+15 energy · Bond with Umm Nasser",
      apply: (s) => {
        s.stats.energy += 15;
        s.relationships["Umm Nasser"] = 90;
        s.bg = "black-sheep";
      },
    },
  ],
  tech: [
    {
      id: "creator",
      icon: "▶",
      name: "Content creator",
      desc: "You built an audience from nothing.",
      perk: "+8 rep · Bond with Dalal",
      apply: (s) => {
        s.stats.rep += 8;
        s.relationships["Dalal"] = 85;
        s.bg = "creator";
      },
    },
    {
      id: "founder",
      icon: "◇",
      name: "Startup founder",
      desc: "You're trying to build something. The runway is short.",
      perk: "+250 money · +5 wasta",
      apply: (s) => {
        s.stats.money += 250;
        s.stats.wasta += 5;
        s.bg = "founder";
      },
    },
    {
      id: "viral",
      icon: "⚡",
      name: "One-hit famous",
      desc: "One video changed your life. The room sees you differently now.",
      perk: "+10 rep · +20 energy",
      apply: (s) => {
        s.stats.rep += 10;
        s.stats.energy += 20;
        s.bg = "viral";
      },
    },
  ],
};
