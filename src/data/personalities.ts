// src/data/personalities.ts
// Passive trait — affects how some actions resolve.

import type { Personality } from "@/lib/types";

export const personalities: Personality[] = [
  {
    id: "patient",
    icon: "◐",
    name: "Patient",
    desc: "You play the long game. Time bends around you.",
    perk: "Energy regenerates faster between days",
  },
  {
    id: "generous",
    icon: "◑",
    name: "Generous",
    desc: "You give before being asked. People remember.",
    perk: "Helping people grants extra reputation",
  },
  {
    id: "ambitious",
    icon: "◒",
    name: "Ambitious",
    desc: "You walk faster than the room. Some catch up; most fall behind.",
    perk: "Quests reward more wasta",
  },
  {
    id: "discreet",
    icon: "◓",
    name: "Discreet",
    desc: "What you know stays where it should. Doors open quietly.",
    perk: "Favors paid yield bonus money",
  },
];
