// src/data/appearance.ts
// Static palettes and option lists for the avatar system.

export const skinTones = [
  { id: "s1", name: "", hex: "#f4d6b8" },
  { id: "s2", name: "", hex: "#e8b88a" },
  { id: "s3", name: "", hex: "#cc9968" },
  { id: "s4", name: "", hex: "#a87545" },
  { id: "s5", name: "", hex: "#7a522e" },
] as const;

export const styles = [
  { id: "ghutra",  name: "Ghutra & agal", hasHead: true,  hasBeard: true,  female: false, hijab: false },
  { id: "shemagh", name: "Shemagh",       hasHead: true,  hasBeard: true,  female: false, hijab: false },
  { id: "bare",    name: "Bare-headed",   hasHead: false, hasBeard: true,  female: false, hijab: false },
  { id: "shayla",  name: "Shayla (hijab)",hasHead: true,  hasBeard: false, female: true,  hijab: true  },
  { id: "abaya",   name: "Abaya & shayla",hasHead: true,  hasBeard: false, female: true,  hijab: true  },
] as const;

export const ghutraColors = [
  { id: "white",   name: "White",     hex: "#fafafa", pattern: "plain" },
  { id: "red",     name: "Red check", hex: "#d8242c", pattern: "check" },
  { id: "black",   name: "Black",     hex: "#1a1816", pattern: "plain" },
  { id: "emerald", name: "Emerald",   hex: "#0a4f2a", pattern: "plain" },
  { id: "navy",    name: "Navy",      hex: "#1a3055", pattern: "plain" },
] as const;

export const shaylaColors = [
  { id: "black",   name: "Black",   hex: "#1a1816" },
  { id: "cream",   name: "Cream",   hex: "#f0e6d2" },
  { id: "emerald", name: "Emerald", hex: "#0a4f2a" },
  { id: "crimson", name: "Crimson", hex: "#8a1228" },
  { id: "navy",    name: "Navy",    hex: "#1a3055" },
  { id: "oud",     name: "Oud",     hex: "#5a3a1c" },
] as const;

export const beardStyles = [
  { id: "none",     name: "Clean" },
  { id: "stubble",  name: "Stubble" },
  { id: "trimmed",  name: "Trimmed" },
  { id: "full",     name: "Full beard" },
  { id: "mustache", name: "Mustache" },
] as const;

export const eyeStyles = [
  { id: "dark",  name: "Dark",  hex: "#1c1612" },
  { id: "hazel", name: "Hazel", hex: "#6b4a26" },
  { id: "light", name: "Light", hex: "#a87a4e" },
  { id: "green", name: "Green", hex: "#4a6b3a" },
  { id: "grey",  name: "Grey",  hex: "#5a5a5a" },
] as const;

export const eyebrowStyles = [
  { id: "natural", name: "Natural" },
  { id: "thick",   name: "Thick" },
  { id: "thin",    name: "Thin" },
  { id: "arched",  name: "Arched" },
] as const;

export const ageLevels = [
  { id: "young",  name: "Young" },
  { id: "adult",  name: "Adult" },
  { id: "mature", name: "Mature" },
  { id: "elder",  name: "Elder" },
] as const;

export const glassesStyles = [
  { id: "none",    name: "None" },
  { id: "reading", name: "Reading" },
  { id: "square",  name: "Square frames" },
  { id: "round",   name: "Round frames" },
] as const;

import type { Appearance } from "@/lib/types";

export function defaultAppearance(): Appearance {
  return {
    style: "ghutra",
    skin: "s2",
    ghutra: "white",
    shayla: "black",
    beard: "trimmed",
    eyes: "dark",
    eyebrows: "natural",
    age: "adult",
    glasses: "none",
  };
}

export function randomAppearance(femalePref = false): Appearance {
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const allStyles = styles as readonly { id: string; hasBeard: boolean; female: boolean }[];
  const styleSet = femalePref
    ? allStyles.filter((s) => s.female)
    : allStyles.filter((s) => !s.female);
  const styleChoice = pick(styleSet);
  return {
    style: styleChoice.id as Appearance["style"],
    skin: pick(skinTones).id as Appearance["skin"],
    ghutra: pick(ghutraColors).id as Appearance["ghutra"],
    shayla: pick(shaylaColors).id as Appearance["shayla"],
    beard: (styleChoice.hasBeard ? pick(beardStyles).id : "none") as Appearance["beard"],
    eyes: pick(eyeStyles).id as Appearance["eyes"],
    eyebrows: pick(eyebrowStyles).id as Appearance["eyebrows"],
    age: pick(ageLevels).id as Appearance["age"],
    glasses: (Math.random() < 0.3 ? pick(glassesStyles.slice(1)).id : "none") as Appearance["glasses"],
  };
}
