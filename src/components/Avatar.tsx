"use client";

import { useMemo } from "react";
import type { Appearance } from "@/lib/types";
import { avatarSvg } from "@/lib/avatarSvg";

export function Avatar({ appearance, size = 96 }: { appearance: Appearance; size?: number }) {
  const html = useMemo(() => avatarSvg(appearance, size), [appearance, size]);
  return (
    <div
      className="inline-block rounded-2xl overflow-hidden"
      style={{ width: size, height: size, background: "#f3eedf" }}
      // SVG is generated locally — safe.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
