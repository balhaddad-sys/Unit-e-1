"use client";

import { useMemo } from "react";
import type { Appearance } from "@/lib/types";
import { avatarSVG } from "@/lib/avatarSvg";

type Props = {
  appearance: Appearance;
  accent?: string;
  size?: number;
  className?: string;
  ring?: boolean;
};

export default function Avatar({
  appearance,
  accent = "emerald",
  size = 96,
  className = "",
  ring = false,
}: Props) {
  const svg = useMemo(() => avatarSVG(appearance, accent), [appearance, accent]);
  return (
    <div
      className={`inline-block overflow-hidden rounded-full bg-cream ${
        ring ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-cream" : ""
      } ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
