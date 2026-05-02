"use client";

import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { id: "home", label: "البيت", icon: "⌂", path: "/play" },
  { id: "places", label: "الأماكن", icon: "⛬", path: "/play/places" },
  { id: "people", label: "الناس", icon: "☺", path: "/play/people" },
  { id: "quests", label: "المهام", icon: "❖", path: "/play/quests" },
  { id: "you", label: "أنت", icon: "◐", path: "/play/you" },
];

export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-3 grid grid-cols-5 z-40 pb-[var(--safe-bottom)]"
      dir="rtl"
    >
      {tabs.map((t) => {
        const active = pathname === t.path || (t.id === "home" && pathname === "/play");
        return (
          <button
            key={t.id}
            onClick={() => router.push(t.path)}
            className={`flex flex-col items-center justify-center py-2.5 gap-0.5 ${
              active ? "text-accent" : "text-ink-3"
            }`}
          >
            <div className="text-lg">{t.icon}</div>
            <div className="text-[11px] font-medium">{t.label}</div>
          </button>
        );
      })}
    </nav>
  );
}
