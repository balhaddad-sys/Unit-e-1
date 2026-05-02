// src/lib/shadeHex.ts
// Lighten/darken a hex color. amt in [-100, 100] — positive lightens.

export function shadeHex(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const adj = (c: number) => {
    const v = c + Math.round((amt / 100) * 255);
    return Math.max(0, Math.min(255, v));
  };
  return "#" + [adj(r), adj(g), adj(b)].map((v) => v.toString(16).padStart(2, "0")).join("");
}
