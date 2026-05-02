"use client";

export type TabId = "home" | "places" | "people" | "quests" | "you";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "home",   label: "Home",    icon: "◇" },
  { id: "places", label: "Places",  icon: "◯" },
  { id: "people", label: "People",  icon: "❀" },
  { id: "quests", label: "Quests",  icon: "❖" },
  { id: "you",    label: "You",     icon: "◆" },
];

export function TabBar({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-cream/95 backdrop-blur border-t border-[var(--line)]">
      <div className="max-w-screen mx-auto flex">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => onChange(t.id)}>
            <span className="text-base leading-none">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
