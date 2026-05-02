import type { Personality } from "@/lib/types";

export const personalities: Personality[] = [
  {
    id: "patient",
    name: "Patient",
    desc: "You wait. People reveal themselves to you because you let silence do the work.",
    icon: "◐",
    perk: "+2 falconry, +5 energy regen",
  },
  {
    id: "discreet",
    name: "Discreet",
    desc: "You hear what's said and you don't repeat it. People notice — quietly.",
    icon: "◆",
    perk: "+2 gahwa, better rep gain",
  },
  {
    id: "ambitious",
    name: "Ambitious",
    desc: "You take the room. You don't ask for permission. Some love it. Some don't.",
    icon: "⚡",
    perk: "+2 debate, +1 wasta from quests",
  },
  {
    id: "charismatic",
    name: "Charismatic",
    desc: "Strangers feel known by you within five minutes. Sometimes they're right.",
    icon: "❀",
    perk: "+2 to all duels, faster relationships",
  },
];
