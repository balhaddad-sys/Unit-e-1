"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { prologueScenes } from "@/lib/data/prologue";
import { acts } from "@/lib/data/acts";
import { PrologueScene } from "@/components/game/PrologueScene";
import { ActTransition } from "@/components/game/ActTransition";
import { Tutorial } from "@/components/game/Tutorial";

type Phase = "prologue" | "tutorial" | "act_transition";

export default function ProloguePage() {
  const router = useRouter();
  const state = useGameStore((s) => s.state);
  const dispatch = useGameStore((s) => s.dispatch);
  const [phase, setPhase] = useState<Phase>("prologue");

  useEffect(() => {
    if (!state) router.replace("/");
  }, [state, router]);

  if (!state) return null;

  const idx = state.prologueIndex;
  const scene = prologueScenes[idx];

  function handleChoice(opt: { flag: string; traitLean?: import("@/lib/types").Trait }) {
    dispatch({
      type: "PROLOGUE_CHOICE",
      sceneIdx: idx,
      flag: opt.flag,
      trait: opt.traitLean,
    });

    // After last scene, show tutorial then act transition
    if (idx >= prologueScenes.length - 1) {
      setTimeout(() => setPhase("tutorial"), 500);
    }
  }

  function finishTutorial() {
    dispatch({ type: "TUTORIAL_DONE" });
    setPhase("act_transition");
  }

  function startGame() {
    router.replace("/play");
  }

  return (
    <>
      {phase === "prologue" && scene && (
        <PrologueScene scene={scene} onChoice={handleChoice} />
      )}
      {phase === "tutorial" && <Tutorial onDone={finishTutorial} />}
      {phase === "act_transition" && (
        <ActTransition act={acts[0]} state={state} onContinue={startGame} />
      )}
    </>
  );
}
