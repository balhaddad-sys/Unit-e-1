// src/data/scandals.ts
// Rare, late-game major events. Probabilistically triggered.

import type { ScandalEvent } from "@/lib/types";

export const scandalEvents: ScandalEvent[] = [
  {
    id: "family_scandal",
    title: "The Family Scandal",
    arabic: "فضيحة العائلة",
    text: "Something has come out about your family. It's true. It was buried. Now it isn't. The phones are ringing.",
    options: [
      {
        label: "Own it publicly — survive on the truth",
        rep: -15, wasta: -8, energy: -25,
        factions: { tribal: -10, government: 5 },
      },
      {
        label: "Bribe the source into silence",
        money: -2000, rep: -3, wasta: -5,
        flag: "bribed_someone",
        branch: "bribed",
      },
      {
        label: "Counter-attack — leak something on them",
        rep: -8, wasta: 5, energy: -15,
        factions: { tribal: -5 },
        branch: "counter_attacked",
      },
    ],
    triggerCheck: (s) =>
      s.day > 70 &&
      Math.random() < 0.06 &&
      !s.eventsTriggered.includes("family_scandal"),
  },
  {
    id: "business_collapse",
    title: "The Business Collapse",
    arabic: "انهيار الصفقة",
    text: "A deal you backed has collapsed. Investors are calling. Names you trusted are not picking up. Your share of the loss is significant.",
    options: [
      {
        label: "Cover the loss yourself — protect your name",
        money: -1500, rep: 8, wasta: 3, energy: -20,
      },
      {
        label: "Walk away from it — let the chips fall",
        rep: -15, wasta: -10,
        factions: { merchants: -12 },
      },
      {
        label: "Find someone to take the fall (you know who)",
        rep: -5, wasta: 8, energy: -15,
        factions: { merchants: -3 },
        branch: "threw_under_bus",
      },
    ],
    triggerCheck: (s) =>
      s.day > 90 &&
      s.stats.money > 800 &&
      Math.random() < 0.05 &&
      !s.eventsTriggered.includes("business_collapse"),
  },
  {
    id: "betrayed",
    title: "Betrayed",
    arabic: "الخيانة",
    text: "Someone you helped — really helped, when no one else would — has stabbed you in the back. Publicly. Specifically. With knowledge only they had.",
    options: [
      {
        label: "Confront them in the diwaniya — wallah let everyone see",
        rep: 5, wasta: 3, energy: -15,
        factions: { tribal: 5 },
        triggerDuel: "debate",
      },
      {
        label: "Cut them off completely — never speak again",
        rep: -2, wasta: 1, energy: -8,
      },
      {
        label: "Forgive — surprise everyone",
        rep: 10, energy: -10,
        factions: { religious: 8 },
      },
    ],
    triggerCheck: (s) =>
      s.day > 60 &&
      Object.values(s.relationships).some((v) => v >= 60) &&
      Math.random() < 0.04 &&
      !s.eventsTriggered.includes("betrayed"),
  },
];
