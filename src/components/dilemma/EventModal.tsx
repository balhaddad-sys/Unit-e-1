"use client";

import Dialog from "@/components/Dialog";
import type { ScandalEvent, SeasonalEvent, EventOption } from "@/lib/types";
import { useGame } from "@/engine/store";
import { applyReward } from "@/engine/rewards";
import { useState } from "react";
import DuelModal from "@/components/duel/DuelModal";

export default function EventModal({
  event,
  onResolve,
}: {
  event: SeasonalEvent | ScandalEvent;
  onResolve: () => void;
}) {
  const setState = useGame((s) => s.setState);
  const pushToast = useGame((s) => s.pushToast);
  const [resultText, setResultText] = useState<string | null>(null);
  const [duelType, setDuelType] = useState<"gahwa" | "debate" | "falconry" | "brawl" | null>(null);

  function pick(opt: EventOption) {
    if (opt.triggerDuel) {
      setDuelType(opt.triggerDuel);
      return;
    }
    setState((s) => {
      applyReward(s, opt);
      if (opt.branch) s.worldFlags[opt.branch] = true;
      s.story.push({ day: s.day, time: s.time, text: `${event.title}: ${opt.label}` });
    });
    setResultText(opt.label);
  }

  function close() {
    setResultText(null);
    onResolve();
  }

  if (duelType) {
    return (
      <DuelModal
        typeId={duelType}
        onResolve={(result) => {
          pushToast(result === "win" ? "You won the duel." : result === "lose" ? "You lost." : "A draw.");
          setDuelType(null);
          onResolve();
        }}
      />
    );
  }

  return (
    <Dialog open={true} blocking title={event.title} arabic={event.arabic}>
      <p className="serif text-base leading-relaxed mb-5 text-ink">{event.text}</p>

      {resultText ? (
        <>
          <div className="text-sm text-ash mb-3">{resultText}</div>
          <div className="flex justify-end pt-2">
            <button className="btn btn-primary" onClick={close}>
              Continue
            </button>
          </div>
        </>
      ) : (
        <div className="grid gap-2">
          {event.options.map((o, i) => (
            <button
              key={i}
              onClick={() => pick(o)}
              className="text-left p-3 rounded-xl border border-line bg-card"
            >
              <div className="text-sm text-ink">{o.label}</div>
            </button>
          ))}
        </div>
      )}
    </Dialog>
  );
}
