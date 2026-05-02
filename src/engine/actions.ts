// Player actions — mutate state directly. Use through useGame().set(s => action(s, ...)).

import type { GameState, NPC, Zone } from "@/lib/types";
import { traitAffinityBonus } from "@/engine/traits";
import { applyReward } from "@/engine/rewards";

export function logStory(s: GameState, text: string) {
  s.story.unshift({ day: s.day, time: s.time, text });
  if (s.story.length > 60) s.story.length = 60;
}

export function advanceTime(s: GameState, hours: number) {
  s.time += hours;
  while (s.time >= 24) {
    s.time -= 24;
    s.day += 1;
    s.stats.energy = Math.min(100, s.stats.energy + 35); // overnight regen
  }
}

export function travel(s: GameState, zone: Zone) {
  if (s.stats.energy < zone.cost) {
    logStory(s, `Too tired to travel to ${zone.en}.`);
    return false;
  }
  s.stats.energy -= zone.cost;
  s.location = zone.id;
  s.subLocation = null;
  if (!s.zonesVisited.includes(zone.id)) s.zonesVisited.push(zone.id);
  advanceTime(s, 1);
  logStory(s, `Travelled to ${zone.en}.`);
  return true;
}

export function visitSubLocation(s: GameState, subId: string, name: string, energyCost: number) {
  if (s.stats.energy < energyCost) {
    logStory(s, `Too tired to visit ${name}.`);
    return false;
  }
  s.stats.energy -= energyCost;
  s.subLocation = subId;
  advanceTime(s, 1);
  logStory(s, `At ${name}.`);
  return true;
}

export function rest(s: GameState) {
  s.stats.energy = Math.min(100, s.stats.energy + 30);
  advanceTime(s, 4);
  logStory(s, "You rested.");
}

export function greet(s: GameState, npc: NPC) {
  const cost = 4;
  if (s.stats.energy < cost) {
    logStory(s, `Too tired to greet ${npc.name}.`);
    return;
  }
  s.stats.energy -= cost;
  const cur = s.relationships[npc.name] || npc.baseRel;
  const bonus = traitAffinityBonus(s, npc.values, npc.dislikes);
  const charisma = s.personality === "charismatic" ? 2 : 0;
  const gain = Math.max(1, 4 + bonus + charisma);
  s.relationships[npc.name] = Math.min(100, cur + gain);
  s.factions[npc.faction] = Math.min(100, s.factions[npc.faction] + 1);
  logStory(s, `Greeted ${npc.name}. Relationship +${gain}.`);
  advanceTime(s, 1);
}

export function helpThem(s: GameState, npc: NPC) {
  const cost = 12;
  if (s.stats.energy < cost) {
    logStory(s, `Too tired to help ${npc.name}.`);
    return;
  }
  s.stats.energy -= cost;
  const cur = s.relationships[npc.name] || npc.baseRel;
  const bonus = traitAffinityBonus(s, npc.values, npc.dislikes);
  const gain = Math.max(3, 8 + bonus);
  s.relationships[npc.name] = Math.min(100, cur + gain);
  s.favors.push({ who: npc.name, kind: "owedToYou", weight: "small" });
  applyReward(s, { rep: 2, faction: npc.faction, factionAmt: 2 });
  logStory(s, `Helped ${npc.name}. They owe you a small favor.`);
  advanceTime(s, 2);
}

export function askFavor(s: GameState, npc: NPC) {
  const cost = 6;
  if (s.stats.energy < cost) {
    logStory(s, `Too tired to ask ${npc.name} for a favor.`);
    return;
  }
  const cur = s.relationships[npc.name] || npc.baseRel;
  if (cur < 50) {
    logStory(s, `${npc.name} is not close enough to ask.`);
    return;
  }
  s.stats.energy -= cost;
  s.favors.push({ who: npc.name, kind: "youOwe", weight: "small" });
  s.relationships[npc.name] = Math.max(0, cur - 5);
  applyReward(s, { wasta: 3, money: 100 });
  logStory(s, `Asked ${npc.name} for a favor. You owe one back.`);
  advanceTime(s, 2);
}
