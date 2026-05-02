"use client";

import { useState } from "react";
import { useGame } from "@/engine/store";
import { npcs } from "@/data/npcs";
import { NpcCard } from "@/components/npc/NpcCard";
import { Dialog } from "@/components/Dialog";
import { Avatar } from "@/components/Avatar";
import { appearanceForNpc } from "@/engine/npcAppearance";
import type { NPC } from "@/lib/types";
import { greet, askFavor, helpThem } from "@/engine/actions";
import { tickProgression } from "@/engine/progression";

export function PeopleView() {
  const s = useGame((g) => g.state);
  const setStore = useGame((g) => g.set);
  const [selected, setSelected] = useState<NPC | null>(null);

  const here = npcs.filter((n) => n.zone === s.location);
  const elsewhere = npcs.filter((n) => n.zone !== s.location);

  function act(name: keyof Actions) {
    const n = selected;
    if (!n) return;
    setStore((g) => {
      ACTIONS[name](g, n);
      tickProgression(g);
    });
  }

  return (
    <div className="space-y-4 fade-in">
      <section>
        <h3 className="serif text-base mb-3">Here with you</h3>
        {here.length === 0 ? (
          <p className="text-sm text-[var(--muted)] px-1">Nobody you know is at this zone right now.</p>
        ) : (
          <div className="space-y-2">
            {here.map((n) => <NpcCard key={n.name} npc={n} onClick={(npc) => setSelected(npc)} />)}
          </div>
        )}
      </section>

      <section>
        <h3 className="serif text-base mb-3">Across Kuwait</h3>
        <div className="space-y-2">
          {elsewhere.map((n) => <NpcCard key={n.name} npc={n} onClick={(npc) => setSelected(npc)} />)}
        </div>
      </section>

      {selected && (
        <Dialog open onClose={() => setSelected(null)} title={selected.name}>
          <div className="flex gap-3 mb-4">
            <Avatar appearance={appearanceForNpc(selected)} size={88} />
            <div className="flex-1">
              <div className="text-xs text-[var(--muted)]">{selected.role} · {selected.faction}</div>
              <p className="text-sm mt-2 leading-relaxed">{selected.goal}</p>
              <p className="text-xs text-[var(--muted)] mt-2 italic">{selected.initial}</p>
            </div>
          </div>

          {selected.zone !== s.location && (
            <div className="pill mb-4">Travel to their zone to interact.</div>
          )}

          <div className="space-y-2">
            <button
              className="btn btn-primary"
              disabled={selected.zone !== s.location}
              onClick={() => act("greet")}
            >Greet · 4⚡</button>
            <button
              className="btn"
              disabled={selected.zone !== s.location}
              onClick={() => act("helpThem")}
            >Help them · 12⚡</button>
            <button
              className="btn"
              disabled={selected.zone !== s.location || (s.relationships[selected.name] || 0) < 50}
              onClick={() => act("askFavor")}
            >Ask a favor · 6⚡ (need 50+ rel)</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

type Actions = {
  greet: typeof greet;
  helpThem: typeof helpThem;
  askFavor: typeof askFavor;
};

const ACTIONS: Actions = { greet, helpThem, askFavor };
