"use client";

import { Dispatch, SetStateAction } from "react";

export type Tab = "home" | "places" | "people" | "quests" | "you";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "places", label: "Places", icon: "⌖" },
  { id: "people", label: "People", icon: "☻" },
  { id: "quests", label: "Quests", icon: "✦" },
  { id: "you", label: "You", icon: "◐" },
];

export default function TabBar({
  active,
  setActive,
}: {
  active: Tab;
  setActive: Dispatch<SetStateAction<Tab>>;
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-cream/95 backdrop-blur border-t border-line/70"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-page mx-auto grid grid-cols-5">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] tracking-wide ${
                isActive ? "text-[var(--accent)]" : "text-ash"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {t.icon}
              </span>
              <span>{t.label}</span>
              {isActive && (
                <span className="absolute bottom-0 mb-1 w-1 h-1 rounded-full bg-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
