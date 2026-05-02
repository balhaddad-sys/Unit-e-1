// Deterministic string hash for NPC portrait seeding.
export function seedHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededPick<T>(seed: number, arr: T[]): T {
  return arr[seed % arr.length];
}

export function seededInt(seed: number, max: number): number {
  return seed % max;
}
