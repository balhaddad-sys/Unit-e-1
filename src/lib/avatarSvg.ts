// src/lib/avatarSvg.ts
// 14-layer SVG portrait generator. Returns a complete <svg> string.
// Ported from the v1 HTML reference — keep visual parity.

import type { Appearance } from "@/lib/types";
import {
  skinTones,
  styles,
  ghutraColors,
  shaylaColors,
  eyeStyles,
} from "@/data/appearance";
import { getAccent } from "@/data/accents";
import { shadeHex } from "./shadeHex";

let _idCounter = 0;
function nextId() {
  _idCounter = (_idCounter + 1) >>> 0;
  return "av" + _idCounter.toString(36);
}

export function avatarSVG(a: Appearance, accentId: string = "emerald"): string {
  const skin = (skinTones.find((x) => x.id === a.skin) || skinTones[1]).hex;
  const skinShade = shadeHex(skin, -18);
  const skinDeep = shadeHex(skin, -32);
  const skinLight = shadeHex(skin, 12);

  const styleObj = styles.find((s) => s.id === a.style) || styles[0];
  const isHijab = styleObj.hijab;
  const headColor = isHijab
    ? (shaylaColors.find((x) => x.id === a.shayla) || shaylaColors[0]).hex
    : (ghutraColors.find((x) => x.id === a.ghutra) || ghutraColors[0]).hex;
  const headPattern =
    !isHijab && styleObj.hasHead
      ? (ghutraColors.find((x) => x.id === a.ghutra) || ghutraColors[0]).pattern
      : "plain";

  const eyeC = (eyeStyles.find((x) => x.id === a.eyes) || eyeStyles[0]).hex;
  const beardId = a.beard;
  const beardC = "#241a12";

  const dishColor = isHijab ? "#1a1816" : "#fafafa";
  const dishShade = isHijab ? "#0e0d0c" : "#e8e0cf";

  const accent = getAccent(accentId).c;
  const id = nextId();

  let svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">`;

  svg += `<defs>
    <radialGradient id="bg-${id}" cx="50%" cy="100%" r="80%">
      <stop offset="0%" stop-color="${shadeHex(headColor, -8)}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <linearGradient id="skin-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${skinLight}"/>
      <stop offset="55%" stop-color="${skin}"/>
      <stop offset="100%" stop-color="${skinShade}"/>
    </linearGradient>
    <linearGradient id="head-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${shadeHex(headColor, 8)}"/>
      <stop offset="100%" stop-color="${shadeHex(headColor, -14)}"/>
    </linearGradient>
    <linearGradient id="dish-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${dishColor}"/>
      <stop offset="100%" stop-color="${dishShade}"/>
    </linearGradient>
    ${headPattern === "check" ? `
      <pattern id="check-${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="8" height="8" fill="${headColor}"/>
        <line x1="0" y1="0" x2="8" y2="0" stroke="${shadeHex(headColor, -25)}" stroke-width="0.6"/>
        <line x1="0" y1="4" x2="8" y2="4" stroke="${shadeHex(headColor, -25)}" stroke-width="0.6"/>
        <line x1="0" y1="0" x2="0" y2="8" stroke="${shadeHex(headColor, -25)}" stroke-width="0.6"/>
        <line x1="4" y1="0" x2="4" y2="8" stroke="${shadeHex(headColor, -25)}" stroke-width="0.6"/>
      </pattern>` : ""}
  </defs>`;

  // Background tint
  svg += `<rect width="200" height="200" fill="url(#bg-${id})"/>`;

  // L1: Body / dishdasha base
  svg += `<path d="M 22 200 L 30 168 Q 60 152 100 152 Q 140 152 170 168 L 178 200 Z" fill="url(#dish-${id})"/>`;
  svg += `<path d="M 86 152 L 94 165 Q 100 168 106 165 L 114 152 Z" fill="${shadeHex(dishColor, -14)}"/>`;
  if (!isHijab) {
    svg += `<path d="M 88 154 L 94 162 Q 100 165 106 162 L 112 154" stroke="${accent}" stroke-width="0.8" fill="none" stroke-linejoin="round" opacity="0.35"/>`;
  }

  // L2: Neck
  svg += `<path d="M 82 138 L 82 158 Q 100 162 118 158 L 118 138 Z" fill="${skinShade}"/>`;
  svg += `<path d="M 82 145 Q 100 150 118 145" stroke="${skinDeep}" stroke-width="0.8" fill="none" opacity="0.5"/>`;

  // L3: Hair (only if bareheaded)
  if (!styleObj.hasHead) {
    svg += `<path d="M 68 76 Q 70 56 100 50 Q 130 56 132 76 Q 132 70 100 64 Q 68 70 68 76 Z" fill="#1a1108"/>`;
  }

  // L4: Face
  const facePath = `M 68 92 Q 68 65 100 60 Q 132 65 132 92 Q 132 116 124 132 Q 116 144 100 145 Q 84 144 76 132 Q 68 116 68 92 Z`;
  svg += `<path d="${facePath}" fill="url(#skin-${id})"/>`;

  // L5: Ears (only when bareheaded)
  if (!styleObj.hasHead) {
    svg += `<path d="M 67 102 Q 62 102 62 112 Q 62 122 68 122 Z" fill="${skinShade}"/>`;
    svg += `<path d="M 64 108 Q 65 113 67 117" stroke="${skinDeep}" stroke-width="0.6" fill="none" opacity="0.6"/>`;
    svg += `<path d="M 133 102 Q 138 102 138 112 Q 138 122 132 122 Z" fill="${skinShade}"/>`;
    svg += `<path d="M 136 108 Q 135 113 133 117" stroke="${skinDeep}" stroke-width="0.6" fill="none" opacity="0.6"/>`;
  }

  // L6: Cheek shading
  svg += `<ellipse cx="78" cy="116" rx="7" ry="11" fill="${skinShade}" opacity="0.22"/>`;
  svg += `<ellipse cx="122" cy="116" rx="7" ry="11" fill="${skinShade}" opacity="0.22"/>`;

  // L7: Headwear
  if (styleObj.hasHead) {
    if (isHijab) {
      svg += `<path fill="url(#head-${id})" d="
        M 50 78
        Q 52 48 100 42
        Q 148 48 150 78
        Q 152 110 154 132
        L 170 180 L 154 182
        L 138 152 Q 140 130 136 110 Q 134 96 130 92
        Q 130 84 100 78 Q 70 84 70 92
        Q 66 96 64 110 Q 60 130 62 152
        L 46 182 L 30 180
        L 46 132 Q 48 110 50 78 Z"/>`;
      svg += `<path d="M 56 84 Q 78 74 100 72" stroke="${shadeHex(headColor, -22)}" stroke-width="1" fill="none" opacity="0.55"/>`;
      svg += `<path d="M 100 72 Q 122 74 144 84" stroke="${shadeHex(headColor, -22)}" stroke-width="1" fill="none" opacity="0.55"/>`;
      if (a.style === "abaya") {
        svg += `<path d="M 18 200 L 25 165 Q 50 150 100 148 Q 150 150 175 165 L 182 200 Z" fill="#0a0908"/>`;
        svg += `<path d="M 25 165 Q 100 174 175 165" stroke="${shadeHex("#0a0908", 18)}" stroke-width="0.8" fill="none" opacity="0.6"/>`;
        svg += `<path d="M 86 152 L 94 165 Q 100 168 106 165 L 114 152" stroke="${accent}" stroke-width="1" fill="none" stroke-linejoin="round" opacity="0.5"/>`;
      }
    } else {
      const fill = headPattern === "check" ? `url(#check-${id})` : `url(#head-${id})`;
      svg += `<path d="
        M 50 88
        Q 50 50 100 44
        Q 150 50 150 88
        Q 156 130 175 175
        L 158 180
        Q 130 145 130 110
        L 130 100
        Q 132 92 130 88
        L 70 88
        Q 68 92 70 100
        L 70 110
        Q 70 145 42 180
        L 25 175
        Q 44 130 50 88 Z" fill="${fill}"/>`;
      svg += `<path d="M 64 90 Q 64 58 100 52 Q 136 58 136 90 Q 136 80 100 76 Q 64 80 64 90 Z" fill="${fill}"/>`;
      svg += `<path d="M 64 90 L 60 130 Q 58 140 64 132 Q 70 124 70 100 Z" fill="${shadeHex(headColor, -10)}" opacity="0.85"/>`;
      svg += `<path d="M 136 90 L 140 130 Q 142 140 136 132 Q 130 124 130 100 Z" fill="${shadeHex(headColor, -10)}" opacity="0.85"/>`;
      svg += `<path d="M 70 70 Q 100 56 130 70" stroke="${shadeHex(headColor, -22)}" stroke-width="1.2" fill="none" opacity="0.55"/>`;
      svg += `<path d="M 64 84 Q 100 70 136 84" stroke="${shadeHex(headColor, -18)}" stroke-width="0.9" fill="none" opacity="0.45"/>`;
      if (a.style === "ghutra") {
        svg += `<g>
          <ellipse cx="100" cy="70" rx="40" ry="6.5" fill="#0a0908"/>
          <ellipse cx="100" cy="68" rx="40" ry="6" fill="none" stroke="#1f1815" stroke-width="0.6"/>
          <ellipse cx="100" cy="72" rx="40" ry="6.5" fill="none" stroke="#1f1815" stroke-width="0.6"/>
          <ellipse cx="100" cy="70" rx="4.5" ry="3.8" fill="#1f1815"/>
          <ellipse cx="100" cy="70" rx="2.5" ry="2.2" fill="#0a0908"/>
        </g>`;
      }
      svg += `<path d="M 80 60 Q 100 54 120 60" stroke="${shadeHex(headColor, 18)}" stroke-width="0.8" fill="none" opacity="0.4"/>`;
    }
  }

  // L8: Eyebrows
  const browY = styleObj.hasHead ? 96 : 92;
  const browColor = "#1f1410";
  const browStyle = a.eyebrows || "natural";
  let browW = 2.4;
  let browLift = 4;
  let browArc = 0;
  if (browStyle === "thick") browW = 3.2;
  if (browStyle === "thin") browW = 1.6;
  if (browStyle === "arched") {
    browLift = 6;
    browArc = 2;
  }
  svg += `<path d="M 76 ${browY} Q 86 ${browY - browLift} 95 ${browY - 1 - browArc}" stroke="${browColor}" stroke-width="${browW}" fill="none" stroke-linecap="round"/>`;
  svg += `<path d="M 105 ${browY - 1 - browArc} Q 114 ${browY - browLift} 124 ${browY}" stroke="${browColor}" stroke-width="${browW}" fill="none" stroke-linecap="round"/>`;

  // L9: Eyes
  const eyeY = browY + 8;
  svg += `<g>
    <ellipse cx="86" cy="${eyeY}" rx="5.5" ry="3.4" fill="white"/>
    <ellipse cx="114" cy="${eyeY}" rx="5.5" ry="3.4" fill="white"/>
    <circle cx="87" cy="${eyeY}" r="2.6" fill="${eyeC}"/>
    <circle cx="115" cy="${eyeY}" r="2.6" fill="${eyeC}"/>
    <circle cx="87.7" cy="${eyeY - 0.7}" r="0.8" fill="white"/>
    <circle cx="115.7" cy="${eyeY - 0.7}" r="0.8" fill="white"/>
    <path d="M 80 ${eyeY - 1} Q 86 ${eyeY - 3.5} 92 ${eyeY - 1}" stroke="${shadeHex(skin, -55)}" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M 108 ${eyeY - 1} Q 114 ${eyeY - 3.5} 120 ${eyeY - 1}" stroke="${shadeHex(skin, -55)}" stroke-width="1" fill="none" stroke-linecap="round"/>
  </g>`;

  // L10: Nose
  const noseTop = eyeY + 4;
  svg += `<path d="M 100 ${noseTop} Q 96 ${noseTop + 10} 99 ${noseTop + 18} Q 100 ${noseTop + 20} 101 ${noseTop + 18} Q 104 ${noseTop + 10} 100 ${noseTop}" fill="${skinShade}" opacity="0.45"/>`;
  svg += `<path d="M 96 ${noseTop + 18} Q 100 ${noseTop + 20} 104 ${noseTop + 18}" stroke="${skinDeep}" stroke-width="0.7" fill="none" opacity="0.5"/>`;

  // L11: Mouth
  const mouthY = noseTop + 28;
  const lipC = isHijab ? "#a8485a" : shadeHex(skin, -50);
  const lipStrokeW = isHijab ? 1.6 : 1.4;
  if (beardId === "full" || beardId === "mustache") {
    svg += `<path d="M 92 ${mouthY} Q 100 ${mouthY + 2} 108 ${mouthY}" stroke="${shadeHex(skin, -55)}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  } else {
    svg += `<path d="M 92 ${mouthY - 1} Q 100 ${mouthY + 2.5} 108 ${mouthY - 1}" stroke="${lipC}" stroke-width="${lipStrokeW}" fill="none" stroke-linecap="round"/>`;
    if (isHijab) {
      svg += `<path d="M 94 ${mouthY - 2} Q 100 ${mouthY - 4} 106 ${mouthY - 2}" stroke="${lipC}" stroke-width="0.8" fill="none" stroke-linecap="round" opacity="0.5"/>`;
    }
  }

  // L12: Beard
  if (styleObj.hasBeard) {
    if (beardId === "stubble") {
      svg += `<path d="M 76 124 Q 100 138 124 124 Q 124 142 100 145 Q 76 142 76 124 Z" fill="${beardC}" opacity="0.22"/>`;
    } else if (beardId === "trimmed") {
      svg += `<path d="M 78 124 Q 100 140 122 124 Q 124 144 100 146 Q 76 144 78 124 Z" fill="${beardC}" opacity="0.92"/>`;
      svg += `<path d="M 88 132 Q 100 136 112 132 Q 110 138 100 140 Q 90 138 88 132 Z" fill="#0e0805" opacity="0.8"/>`;
    } else if (beardId === "full") {
      svg += `<path d="M 70 116 Q 74 142 100 152 Q 126 142 130 116 Q 130 148 100 154 Q 70 148 70 116 Z" fill="${beardC}"/>`;
      svg += `<path d="M 90 134 Q 100 136 110 134" stroke="${shadeHex(beardC, -15)}" stroke-width="1" fill="none"/>`;
      svg += `<path d="M 76 130 Q 88 145 100 148" stroke="${shadeHex(beardC, 18)}" stroke-width="0.5" fill="none" opacity="0.5"/>`;
    } else if (beardId === "mustache") {
      svg += `<path d="M 86 ${mouthY - 2} Q 92 ${mouthY - 4} 100 ${mouthY - 1} Q 108 ${mouthY - 4} 114 ${mouthY - 2} Q 110 ${mouthY + 3} 100 ${mouthY + 3} Q 90 ${mouthY + 3} 86 ${mouthY - 2} Z" fill="${beardC}"/>`;
    }
  }

  // L13: Age lines
  const age = a.age || "adult";
  if (age === "mature" || age === "elder") {
    svg += `<path d="M 75 ${eyeY - 1} L 79 ${eyeY - 2}" stroke="${shadeHex(skin, -30)}" stroke-width="0.5" fill="none" opacity="0.55"/>`;
    svg += `<path d="M 75 ${eyeY + 1} L 79 ${eyeY + 1}" stroke="${shadeHex(skin, -30)}" stroke-width="0.5" fill="none" opacity="0.55"/>`;
    svg += `<path d="M 121 ${eyeY - 1} L 125 ${eyeY - 2}" stroke="${shadeHex(skin, -30)}" stroke-width="0.5" fill="none" opacity="0.55"/>`;
    svg += `<path d="M 121 ${eyeY + 1} L 125 ${eyeY + 1}" stroke="${shadeHex(skin, -30)}" stroke-width="0.5" fill="none" opacity="0.55"/>`;
    if (!styleObj.hasHead) {
      svg += `<path d="M 78 ${browY - 8} Q 100 ${browY - 10} 122 ${browY - 8}" stroke="${shadeHex(skin, -25)}" stroke-width="0.6" fill="none" opacity="0.5"/>`;
    }
    svg += `<path d="M 88 ${noseTop + 18} Q 86 ${mouthY - 3} 90 ${mouthY + 2}" stroke="${shadeHex(skin, -30)}" stroke-width="0.5" fill="none" opacity="0.5"/>`;
    svg += `<path d="M 112 ${noseTop + 18} Q 114 ${mouthY - 3} 110 ${mouthY + 2}" stroke="${shadeHex(skin, -30)}" stroke-width="0.5" fill="none" opacity="0.5"/>`;
  }
  if (age === "elder") {
    if (styleObj.hasBeard && (beardId === "trimmed" || beardId === "full")) {
      svg += `<path d="M 82 130 Q 90 135 96 134" stroke="#8a8275" stroke-width="0.5" fill="none" opacity="0.7"/>`;
      svg += `<path d="M 104 134 Q 110 135 118 130" stroke="#8a8275" stroke-width="0.5" fill="none" opacity="0.7"/>`;
    }
    svg += `<path d="M 78 ${browY - 1} L 84 ${browY - 3}" stroke="#a89e88" stroke-width="0.5" fill="none" opacity="0.6"/>`;
    svg += `<path d="M 116 ${browY - 3} L 122 ${browY - 1}" stroke="#a89e88" stroke-width="0.5" fill="none" opacity="0.6"/>`;
  }

  // L14: Glasses
  const gl = a.glasses || "none";
  if (gl !== "none") {
    const frameC = "#2a2418";
    const lensFill = "rgba(180,200,220,0.15)";
    if (gl === "reading") {
      svg += `<g stroke="${frameC}" stroke-width="1.2" fill="none">
        <path d="M 78 ${eyeY + 2} Q 86 ${eyeY + 5} 94 ${eyeY + 2}" stroke-linecap="round"/>
        <path d="M 106 ${eyeY + 2} Q 114 ${eyeY + 5} 122 ${eyeY + 2}" stroke-linecap="round"/>
      </g>`;
    } else if (gl === "square") {
      svg += `<g stroke="${frameC}" stroke-width="1.5" fill="${lensFill}">
        <rect x="78" y="${eyeY - 5}" width="16" height="10" rx="1.5"/>
        <rect x="106" y="${eyeY - 5}" width="16" height="10" rx="1.5"/>
      </g>
      <line x1="94" y1="${eyeY}" x2="106" y2="${eyeY}" stroke="${frameC}" stroke-width="1.5"/>`;
    } else if (gl === "round") {
      svg += `<g stroke="${frameC}" stroke-width="1.4" fill="${lensFill}">
        <circle cx="86" cy="${eyeY}" r="6.5"/>
        <circle cx="114" cy="${eyeY}" r="6.5"/>
      </g>
      <line x1="92.5" y1="${eyeY}" x2="107.5" y2="${eyeY}" stroke="${frameC}" stroke-width="1.4"/>`;
    }
  }

  svg += `</svg>`;
  return svg;
}
