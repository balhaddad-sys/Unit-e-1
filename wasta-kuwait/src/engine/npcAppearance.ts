// src/engine/npcAppearance.ts
// Deterministic NPC portrait — same name always yields the same look.

import type { Appearance, NPC } from "@/lib/types";
import {
  skinTones,
  styles,
  beardStyles,
  eyeStyles,
  eyebrowStyles,
  ageLevels,
  glassesStyles,
} from "@/data/appearance";
import { seedHash } from "@/lib/seedHash";

export function npcAppearance(npc: NPC): Appearance {
  const seed = seedHash(npc.name);
  const r = (offset: number) => (seed >> (offset * 3)) & 0xff;

  const isFemale =
    npc.name.startsWith("Umm ") ||
    npc.name.startsWith("Sheikha ") ||
    ["Dalal", "Lulwa", "Ghanima"].includes(npc.name) ||
    npc.name.startsWith("Hajja ");

  let style: string;
  if (isFemale) {
    style = r(0) % 3 === 0 ? "abaya" : "shayla";
  } else if (npc.faction === "religious") {
    style = "ghutra";
  } else if (npc.faction === "tribal" && npc.name.includes("Bu Mishari")) {
    style = "shemagh";
  } else {
    const opts = ["ghutra", "ghutra", "shemagh", "bare"];
    style = opts[r(0) % opts.length];
  }

  const styleObj = styles.find((s) => s.id === style)!;

  let ghutraColor = "white";
  if (npc.faction === "tribal") ghutraColor = r(1) % 2 === 0 ? "red" : "white";

  let shaylaColor = "black";
  if (isFemale) {
    const opts = ["black", "cream", "emerald", "navy", "oud"];
    shaylaColor = opts[r(2) % opts.length];
  }

  const skin = skinTones[r(3) % skinTones.length].id;
  const eyeChoice = eyeStyles[r(4) % eyeStyles.length].id;

  let beard = "none";
  if (styleObj.hasBeard) {
    if (npc.faction === "religious") beard = "full";
    else if (npc.role.includes("Falconer") || npc.role.includes("CEO") || npc.role.includes("Patron"))
      beard = r(5) % 2 === 0 ? "full" : "trimmed";
    else beard = beardStyles[r(5) % beardStyles.length].id;
  }

  let age = "adult";
  if (
    npc.role.includes("Patron") ||
    npc.role.includes("Matriarch") ||
    npc.role.includes("Imam") ||
    npc.role.includes("Hajja") ||
    npc.role.includes("Reciter")
  )
    age = "elder";
  else if (
    npc.role.includes("CEO") ||
    npc.role.includes("Officer") ||
    npc.role.includes("Notary") ||
    npc.role.includes("Lawyer")
  )
    age = "mature";
  else age = ageLevels[r(6) % 3].id;

  const eyebrows = isFemale
    ? r(7) % 2 === 0
      ? "arched"
      : "thin"
    : eyebrowStyles[r(7) % eyebrowStyles.length].id;

  let gl = "none";
  if (
    npc.role.includes("Lawyer") ||
    npc.role.includes("Notary") ||
    npc.role.includes("Officer")
  ) {
    gl = r(8) % 2 === 0 ? "square" : "reading";
  } else if (r(8) % 6 === 0) {
    gl = glassesStyles[1 + (r(8) % 3)].id;
  }

  return {
    style: style as Appearance["style"],
    skin: skin as Appearance["skin"],
    ghutra: ghutraColor as Appearance["ghutra"],
    shayla: shaylaColor as Appearance["shayla"],
    beard: beard as Appearance["beard"],
    eyes: eyeChoice as Appearance["eyes"],
    eyebrows: eyebrows as Appearance["eyebrows"],
    age: age as Appearance["age"],
    glasses: gl as Appearance["glasses"],
  };
}
