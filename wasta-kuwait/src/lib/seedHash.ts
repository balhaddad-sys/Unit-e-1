// src/lib/seedHash.ts
// FNV-1a-style integer hash of a string. Deterministic.

export function seedHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}
