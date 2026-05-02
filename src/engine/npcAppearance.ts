// Deterministically derive an Appearance from an NPC's name+role+faction.
// Same NPC always renders the same portrait.

import type { Appearance, NPC } from "@/lib/types";
import { seedHash } from "@/lib/seedHash";

const STYLE_M: Appearance["style"][] = ["ghutra", "shemagh", "bare"];
const STYLE_F: Appearance["style"][] = ["shayla", "abaya"];
const SKIN: Appearance["skin"][] = ["s1", "s2", "s3", "s4", "s5"];
const GHUTRA: Appearance["ghutra"][] = ["white", "red", "black", "emerald", "navy"];
const SHAYLA: Appearance["shayla"][] = ["black", "cream", "emerald", "crimson", "navy", "oud"];
const BEARDS: Appearance["beard"][] = ["none", "stubble", "trimmed", "full", "mustache"];
const EYES: Appearance["eyes"][] = ["dark", "hazel", "light", "green", "grey"];
const BROWS: Appearance["eyebrows"][] = ["natural", "thick", "thin", "arched"];
const AGES: Appearance["age"][] = ["adult", "mature", "elder"];
const GLASSES: Appearance["glasses"][] = ["none", "none", "reading", "square", "round"];

function isFemaleName(n: string) {
  return /^(Umm|Hajja|Sheikha|Dalal|Lulwa|Ghanima|Hessa)/.test(n);
}

export function appearanceForNpc(npc: NPC): Appearance {
  const seed = seedHash(`${npc.name}|${npc.role}|${npc.faction}`);
  const female = isFemaleName(npc.name);
  const styles = female ? STYLE_F : STYLE_M;

  // role-aware tweaks
  const roleLower = (npc.role || "").toLowerCase();
  const elderRole = /imam|patron|sheikh|reciter|matriarch|trader/.test(roleLower);
  const youngRole = /snap|star|designer|trainer/.test(roleLower);

  let age: Appearance["age"];
  if (elderRole) age = (seed >> 3) & 1 ? "elder" : "mature";
  else if (youngRole) age = "adult";
  else age = AGES[seed % AGES.length];

  const beard = female ? "none" : BEARDS[(seed >> 5) % BEARDS.length];

  return {
    style: styles[(seed >> 1) % styles.length],
    skin: SKIN[(seed >> 7) % SKIN.length],
    ghutra: GHUTRA[(seed >> 9) % GHUTRA.length],
    shayla: SHAYLA[(seed >> 11) % SHAYLA.length],
    beard,
    eyes: EYES[(seed >> 13) % EYES.length],
    eyebrows: BROWS[(seed >> 15) % BROWS.length],
    age,
    glasses: GLASSES[(seed >> 17) % GLASSES.length],
  };
}
