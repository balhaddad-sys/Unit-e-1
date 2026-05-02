// src/lib/avatarSvg.ts
// 14-layer SVG portrait generator. Pure function — given Appearance, returns an SVG string.
// Used for the player avatar and (deterministically seeded) NPC portraits.

import type { Appearance } from "@/lib/types";
import { shadeHex } from "@/lib/shadeHex";

const SKIN_TONES: Record<Appearance["skin"], string> = {
  s1: "#f4d4b3",
  s2: "#e6b58a",
  s3: "#c9905e",
  s4: "#9a6b3f",
  s5: "#704624",
};

const GHUTRA_COLORS: Record<Appearance["ghutra"], string> = {
  white: "#fafafa",
  red: "#c83a3a",
  black: "#1a1a1a",
  emerald: "#1d6b4a",
  navy: "#1c3258",
};

const SHAYLA_COLORS: Record<Appearance["shayla"], string> = {
  black: "#1a1a1a",
  cream: "#f3eedf",
  emerald: "#1d6b4a",
  crimson: "#a02437",
  navy: "#1c3258",
  oud: "#7a4a1b",
};

const EYE_COLORS: Record<Appearance["eyes"], string> = {
  dark: "#2a1810",
  hazel: "#8b6033",
  light: "#5a7a90",
  green: "#3a6b3f",
  grey: "#6f6f70",
};

export function avatarSvg(a: Appearance, size = 200): string {
  const skin = SKIN_TONES[a.skin];
  const skinShade = shadeHex(skin, -18);
  const skinLight = shadeHex(skin, 12);
  const eye = EYE_COLORS[a.eyes];

  const isFemale = a.style === "shayla" || a.style === "abaya";
  const beard = !isFemale ? a.beard : "none";
  const ageLines = a.age === "mature" || a.age === "elder";
  const elder = a.age === "elder";

  // ── 14 layered fragments ──
  const parts: string[] = [];

  // L1 — background (transparent — let parent set bg)
  parts.push(`<rect width="200" height="200" fill="transparent"/>`);

  // L2 — neck
  parts.push(`<rect x="84" y="138" width="32" height="22" fill="${skinShade}"/>`);

  // L3 — shoulders/garment base
  if (isFemale) {
    const c = SHAYLA_COLORS[a.shayla];
    parts.push(`<path d="M30 200 Q30 150 100 150 Q170 150 170 200 Z" fill="${c}"/>`);
  } else {
    parts.push(`<path d="M30 200 Q30 155 100 155 Q170 155 170 200 Z" fill="#fafafa" stroke="#ddd" stroke-width="0.5"/>`);
  }

  // L4 — face shape
  parts.push(
    `<ellipse cx="100" cy="95" rx="42" ry="52" fill="${skin}"/>`
  );
  // jaw shadow
  parts.push(
    `<path d="M62 115 Q62 142 100 145 Q138 142 138 115" fill="${skinShade}" opacity="0.18"/>`
  );

  // L5 — ears
  parts.push(`<ellipse cx="58" cy="100" rx="6" ry="9" fill="${skinShade}"/>`);
  parts.push(`<ellipse cx="142" cy="100" rx="6" ry="9" fill="${skinShade}"/>`);

  // L6 — hair / head covering
  if (a.style === "ghutra") {
    const g = GHUTRA_COLORS[a.ghutra];
    // ghutra cloth
    parts.push(`<path d="M44 80 Q44 36 100 36 Q156 36 156 80 L156 130 Q156 150 100 150 Q44 150 44 130 Z" fill="${g}" stroke="${shadeHex(g, -25)}" stroke-width="0.6"/>`);
    // agal (black ring)
    parts.push(`<ellipse cx="100" cy="48" rx="48" ry="7" fill="#1a1a1a"/>`);
    parts.push(`<ellipse cx="100" cy="51" rx="48" ry="5" fill="#0a0a0a"/>`);
  } else if (a.style === "shemagh") {
    const isRed = a.ghutra === "red";
    const base = isRed ? "#c83a3a" : GHUTRA_COLORS[a.ghutra];
    parts.push(`<path d="M44 80 Q44 36 100 36 Q156 36 156 80 L156 130 Q156 150 100 150 Q44 150 44 130 Z" fill="${base}" stroke="${shadeHex(base, -25)}" stroke-width="0.6"/>`);
    if (isRed) {
      // red checkered pattern
      for (let i = 0; i < 8; i++) {
        const y = 50 + i * 12;
        parts.push(`<line x1="48" y1="${y}" x2="152" y2="${y}" stroke="#fff" stroke-width="1" opacity="0.55"/>`);
      }
      for (let i = 0; i < 9; i++) {
        const x = 52 + i * 12;
        parts.push(`<line x1="${x}" y1="44" x2="${x}" y2="146" stroke="#fff" stroke-width="1" opacity="0.55"/>`);
      }
    }
    parts.push(`<ellipse cx="100" cy="48" rx="48" ry="7" fill="#1a1a1a"/>`);
  } else if (a.style === "shayla") {
    const sh = SHAYLA_COLORS[a.shayla];
    parts.push(`<path d="M40 100 Q40 28 100 28 Q160 28 160 100 L160 165 Q100 180 40 165 Z" fill="${sh}" stroke="${shadeHex(sh, -25)}" stroke-width="0.6"/>`);
    // soft highlight
    parts.push(`<path d="M52 80 Q60 50 100 44" fill="none" stroke="${shadeHex(sh, 18)}" stroke-width="2" opacity="0.4"/>`);
  } else if (a.style === "abaya") {
    const sh = SHAYLA_COLORS[a.shayla];
    parts.push(`<path d="M36 110 Q36 22 100 22 Q164 22 164 110 L164 200 L36 200 Z" fill="${sh}"/>`);
    parts.push(`<path d="M52 80 Q60 50 100 44" fill="none" stroke="${shadeHex(sh, 18)}" stroke-width="2" opacity="0.4"/>`);
  } else {
    // bare — show short hair
    const hair = elder ? "#c8c2b3" : a.age === "mature" ? "#3a2a1c" : "#1f140d";
    parts.push(`<path d="M58 70 Q58 38 100 38 Q142 38 142 70 Q142 80 130 78 Q120 70 100 70 Q80 70 70 78 Q58 80 58 70 Z" fill="${hair}"/>`);
    if (elder) {
      parts.push(`<path d="M70 60 Q80 56 90 60" stroke="#fff" stroke-width="0.5" fill="none" opacity="0.7"/>`);
    }
  }

  // L7 — eyebrows
  const browColor = elder ? "#9a8e7c" : "#1a1208";
  const browStroke =
    a.eyebrows === "thick" ? 3.5 :
    a.eyebrows === "thin" ? 1.5 : 2.5;
  if (a.eyebrows === "arched") {
    parts.push(`<path d="M76 86 Q83 80 92 86" stroke="${browColor}" stroke-width="${browStroke}" fill="none" stroke-linecap="round"/>`);
    parts.push(`<path d="M108 86 Q117 80 124 86" stroke="${browColor}" stroke-width="${browStroke}" fill="none" stroke-linecap="round"/>`);
  } else {
    parts.push(`<path d="M76 88 Q84 84 92 88" stroke="${browColor}" stroke-width="${browStroke}" fill="none" stroke-linecap="round"/>`);
    parts.push(`<path d="M108 88 Q116 84 124 88" stroke="${browColor}" stroke-width="${browStroke}" fill="none" stroke-linecap="round"/>`);
  }

  // L8 — eyes (whites + iris + pupil)
  parts.push(`<ellipse cx="84" cy="98" rx="5.5" ry="3.5" fill="#fff"/>`);
  parts.push(`<ellipse cx="116" cy="98" rx="5.5" ry="3.5" fill="#fff"/>`);
  parts.push(`<circle cx="84" cy="98" r="2.6" fill="${eye}"/>`);
  parts.push(`<circle cx="116" cy="98" r="2.6" fill="${eye}"/>`);
  parts.push(`<circle cx="84" cy="98" r="1.1" fill="#000"/>`);
  parts.push(`<circle cx="116" cy="98" r="1.1" fill="#000"/>`);
  // eye highlight
  parts.push(`<circle cx="85" cy="97" r="0.6" fill="#fff"/>`);
  parts.push(`<circle cx="117" cy="97" r="0.6" fill="#fff"/>`);

  // L9 — age lines (crow's feet + forehead)
  if (ageLines) {
    parts.push(`<path d="M74 100 Q70 102 68 105" stroke="${shadeHex(skin, -28)}" stroke-width="0.6" fill="none" opacity="0.6"/>`);
    parts.push(`<path d="M126 100 Q130 102 132 105" stroke="${shadeHex(skin, -28)}" stroke-width="0.6" fill="none" opacity="0.6"/>`);
    if (elder) {
      parts.push(`<path d="M84 78 Q100 76 116 78" stroke="${shadeHex(skin, -25)}" stroke-width="0.5" fill="none" opacity="0.5"/>`);
      parts.push(`<path d="M84 82 Q100 80 116 82" stroke="${shadeHex(skin, -25)}" stroke-width="0.5" fill="none" opacity="0.5"/>`);
    }
  }

  // L10 — nose
  parts.push(`<path d="M100 102 Q97 116 100 122 Q103 116 100 102" fill="${shadeHex(skin, -10)}" opacity="0.6"/>`);
  parts.push(`<ellipse cx="100" cy="121" rx="3" ry="1.4" fill="${shadeHex(skin, -18)}" opacity="0.5"/>`);

  // L11 — mouth
  parts.push(`<path d="M89 132 Q100 137 111 132" stroke="${shadeHex(skin, -38)}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
  parts.push(`<path d="M92 134 Q100 138 108 134" fill="#a85a55" opacity="0.4"/>`);

  // L12 — beard
  if (beard !== "none" && !isFemale) {
    const beardColor = elder ? "#bdb6a6" : a.age === "mature" ? "#1f160e" : "#0f0a05";
    if (beard === "stubble") {
      parts.push(`<path d="M68 122 Q100 144 132 122 Q132 138 100 148 Q68 138 68 122" fill="${beardColor}" opacity="0.18"/>`);
    } else if (beard === "mustache") {
      parts.push(`<path d="M86 128 Q100 130 114 128 Q114 124 100 126 Q86 124 86 128" fill="${beardColor}"/>`);
    } else if (beard === "trimmed") {
      parts.push(`<path d="M72 122 Q100 148 128 122 Q128 142 100 152 Q72 142 72 122" fill="${beardColor}"/>`);
      parts.push(`<path d="M86 128 Q100 130 114 128 Q114 124 100 126 Q86 124 86 128" fill="${beardColor}"/>`);
    } else if (beard === "full") {
      parts.push(`<path d="M64 116 Q100 158 136 116 Q136 148 100 162 Q64 148 64 116" fill="${beardColor}"/>`);
      parts.push(`<path d="M84 128 Q100 132 116 128 Q116 124 100 126 Q84 124 84 128" fill="${beardColor}"/>`);
    }
  }

  // L13 — glasses
  if (a.glasses !== "none") {
    const gCol = "#2a2620";
    const gStroke = a.glasses === "reading" ? 1.0 : 1.5;
    if (a.glasses === "round") {
      parts.push(`<circle cx="84" cy="98" r="9" fill="none" stroke="${gCol}" stroke-width="${gStroke}"/>`);
      parts.push(`<circle cx="116" cy="98" r="9" fill="none" stroke="${gCol}" stroke-width="${gStroke}"/>`);
      parts.push(`<line x1="93" y1="98" x2="107" y2="98" stroke="${gCol}" stroke-width="${gStroke}"/>`);
    } else if (a.glasses === "square") {
      parts.push(`<rect x="74" y="91" width="20" height="14" rx="2" fill="none" stroke="${gCol}" stroke-width="${gStroke}"/>`);
      parts.push(`<rect x="106" y="91" width="20" height="14" rx="2" fill="none" stroke="${gCol}" stroke-width="${gStroke}"/>`);
      parts.push(`<line x1="94" y1="98" x2="106" y2="98" stroke="${gCol}" stroke-width="${gStroke}"/>`);
    } else {
      parts.push(`<ellipse cx="84" cy="98" rx="10" ry="6" fill="none" stroke="${gCol}" stroke-width="${gStroke}"/>`);
      parts.push(`<ellipse cx="116" cy="98" rx="10" ry="6" fill="none" stroke="${gCol}" stroke-width="${gStroke}"/>`);
      parts.push(`<line x1="94" y1="98" x2="106" y2="98" stroke="${gCol}" stroke-width="${gStroke}"/>`);
    }
  }

  // L14 — soft highlight on cheek
  parts.push(`<ellipse cx="78" cy="112" rx="6" ry="3" fill="${skinLight}" opacity="0.35"/>`);
  parts.push(`<ellipse cx="122" cy="112" rx="6" ry="3" fill="${skinLight}" opacity="0.35"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}">${parts.join(
    ""
  )}</svg>`;
}
