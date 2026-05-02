// src/data/accents.ts
// Six accent palettes for the user-pickable theme.

export type Accent = {
  id: string;
  name: string;
  c: string;
  c2: string;
  bg: string;
};

export const accents: Accent[] = [
  { id: "emerald", name: "Emerald", c: "#00713c", c2: "#008a4a", bg: "#e8f4ec" },
  { id: "crimson", name: "Crimson", c: "#a8132c", c2: "#c41a36", bg: "#fae8eb" },
  { id: "oud", name: "Oud", c: "#5a3a1c", c2: "#704a25", bg: "#f0e6d6" },
  { id: "sea", name: "Khaleej", c: "#1a5b8c", c2: "#226fa6", bg: "#e1eef7" },
  { id: "dusk", name: "Dusk", c: "#8c4a2a", c2: "#a05833", bg: "#f7e6da" },
  { id: "ink", name: "Ink", c: "#1a1816", c2: "#3a3530", bg: "#ebe6da" },
];

export function getAccent(id: string): Accent {
  return accents.find((a) => a.id === id) || accents[0];
}
