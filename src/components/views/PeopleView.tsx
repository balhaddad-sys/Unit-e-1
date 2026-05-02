"use client";

import { useGame } from "@/engine/store";
import { npcs } from "@/data/npcs";
import NpcCard from "@/components/npc/NpcCard";
import { useState } from "react";

type Filter = "all" | "here" | "close";

export default function PeopleView() {
  const state = useGame((s) => s.state);
  const [filter, setFilter] = useState<Filter>("here");

  let visible = npcs;
  if (filter === "here") visible = npcs.filter((n) => n.zone === state.location);
  if (filter === "close")
    visible = npcs
      .filter((n) => (state.relationships[n.name] || n.baseRel) >= 30)
      .sort(
        (a, b) =>
          (state.relationships[b.name] || b.baseRel) -
          (state.relationships[a.name] || a.baseRel),
      );

  return (
    <div className="px-4 pt-4 pb-24 max-w-page mx-auto fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="display text-xl">People</h2>
        <div className="flex gap-1">
          {(["here", "close", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-2.5 py-1 rounded-full border ${
                filter === f
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-line text-ash"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-ash">No one matching here.</p>
      ) : (
        <div className="grid gap-3">
          {visible.map((n) => (
            <NpcCard key={n.name} npc={n} />
          ))}
        </div>
      )}
    </div>
  );
}
