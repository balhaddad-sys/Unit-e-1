"use client";

import { useState } from "react";
import { useGame } from "@/engine/store";
import { acts, storyQuests } from "@/data/storyQuests";
import { personalChains } from "@/data/personalChains";
import { Dialog } from "@/components/Dialog";
import { hasTrait } from "@/engine/traits";
import { applyReward } from "@/engine/rewards";
import { tickProgression, isStoryQuestReadyForBranch } from "@/engine/progression";
import { logStory, advanceTime } from "@/engine/actions";
import { DuelModal } from "@/components/duel/DuelModal";
import type { StoryQuest, ChainStep, StoryBranchOption, PersonalChain } from "@/lib/types";

export function QuestsView() {
  const s = useGame((g) => g.state);
  const setStore = useGame((g) => g.set);

  const [openSQ, setOpenSQ] = useState<StoryQuest | null>(null);
  const [openChain, setOpenChain] = useState<{ name: string; chain: PersonalChain } | null>(null);
  const [pendingDuel, setPendingDuel] = useState<{ type: "gahwa" | "debate" | "falconry" | "brawl"; afterStep?: { npcName: string; step: ChainStep } } | null>(null);

  function chooseStoryBranch(q: StoryQuest, opt: StoryBranchOption) {
    setStore((g) => {
      // gating
      if (opt.requiresTrait && !hasTrait(g, opt.requiresTrait)) return;
      if (opt.forbidsTrait && hasTrait(g, opt.forbidsTrait)) return;
      opt.effect(g);
      applyReward(g, q.rewards);
      const prog = g.storyQuests.find((x) => x.id === q.id);
      if (prog) {
        prog.completed = true;
        prog.branchChoice = opt.id;
      }
      g.questsDone += 1;
      logStory(g, `[${q.title}] ${q.closing}`);
      tickProgression(g);
    });
    setOpenSQ(null);
  }

  function progressChain(name: string, chain: PersonalChain) {
    const prog = s.personalProgress[name];
    if (!prog) return;
    const step = chain.steps[prog.step];
    if (!step) return;

    if (step.requiresDuel) {
      setPendingDuel({ type: step.requiresDuel, afterStep: { npcName: name, step } });
      return;
    }

    completeChainStep(name, chain);
  }

  function completeChainStep(name: string, chain: PersonalChain) {
    setStore((g) => {
      const prog = g.personalProgress[name];
      if (!prog) return;
      const step = chain.steps[prog.step];
      if (!step) return;
      if (g.stats.energy < step.energy) {
        logStory(g, `Too tired for ${chain.title} step.`);
        return;
      }
      g.stats.energy -= step.energy;
      applyReward(g, step.rewards);
      logStory(g, `[${chain.title}] ${step.title}`);
      advanceTime(g, 2);
      prog.step += 1;

      if (prog.step >= chain.steps.length) {
        prog.completed = true;
        g.personalQuestsDone += 1;
        if (chain.unlocksFlag) g.worldFlags[chain.unlocksFlag] = true;
        if (chain.gainsTrait) {
          // addTrait via reward path
          applyReward(g, { trait: chain.gainsTrait });
        }
        logStory(g, chain.completion);
      }
      tickProgression(g);
    });
  }

  function chooseChainBranch(name: string, chain: PersonalChain, step: ChainStep, opt: StoryBranchOption) {
    setStore((g) => {
      opt.effect(g);
      const prog = g.personalProgress[name];
      if (prog) {
        prog.step = chain.steps.length;
        prog.completed = true;
        g.personalQuestsDone += 1;
      }
      if (chain.unlocksFlag) g.worldFlags[chain.unlocksFlag] = true;
      if (chain.gainsTrait) applyReward(g, { trait: chain.gainsTrait });
      logStory(g, chain.completion);
      tickProgression(g);
    });
    setOpenChain(null);
  }

  return (
    <div className="space-y-4 fade-in">
      <section className="card p-4">
        <h3 className="serif text-base mb-3">Story</h3>
        <div className="space-y-2">
          {acts.map((a) => {
            const sq = storyQuests.find((q) => q.act === a.id);
            if (!sq) return null;
            const prog = s.storyQuests.find((x) => x.id === sq.id);
            const ready = isStoryQuestReadyForBranch(s, sq.id);
            const done = prog?.completed;
            return (
              <button
                key={a.id}
                className={`btn ${done ? "opacity-70" : ""}`}
                onClick={() => setOpenSQ(sq)}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-[var(--muted)]">Act {a.n}</span>
                  <span className="font-semibold">{sq.title}</span>
                  <span className="ar text-xs text-[var(--muted)] ml-auto">{sq.arabic}</span>
                </div>
                <div className="text-xs text-[var(--muted)] mt-0.5">
                  {done ? "Completed" : ready ? "Ready to choose your path" : `${prog?.stepsCompleted.filter(Boolean).length || 0} / ${sq.steps.length}`}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="card p-4">
        <h3 className="serif text-base mb-3">Personal chains</h3>
        <div className="space-y-2">
          {Object.entries(personalChains).map(([name, chain]) => {
            const prog = s.personalProgress[name];
            if (!prog?.unlocked) return null;
            return (
              <button key={name} className="btn" onClick={() => setOpenChain({ name, chain })}>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{chain.title}</span>
                  <span className="ar text-xs text-[var(--muted)] ml-auto">{chain.arabic}</span>
                </div>
                <div className="text-xs text-[var(--muted)] mt-0.5">
                  {prog.completed ? "Completed" : `${prog.step} / ${chain.steps.length} — ${name}`}
                </div>
              </button>
            );
          })}
          {Object.values(s.personalProgress).every((p) => !p.unlocked) && (
            <p className="text-sm text-[var(--muted)] px-1">Build relationships to 70+ to unlock personal chains.</p>
          )}
        </div>
      </section>

      {/* Story quest dialog */}
      {openSQ && (
        <Dialog open onClose={() => setOpenSQ(null)} title={openSQ.title} arabic={openSQ.arabic}>
          <div className="text-xs text-[var(--muted)] mb-2">{openSQ.npc} · {openSQ.zone}</div>
          <p className="text-sm leading-relaxed mb-4">{openSQ.desc}</p>

          <div className="space-y-1.5 mb-4">
            {openSQ.steps.map((step, i) => {
              const prog = s.storyQuests.find((x) => x.id === openSQ.id);
              const done = prog?.stepsCompleted[i];
              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${done ? "bg-emerald text-white" : "border border-[var(--line)] text-[var(--muted)]"}`}>
                    {done ? "✓" : i + 1}
                  </span>
                  <span className={done ? "" : "text-[var(--muted)]"}>{step.label}</span>
                </div>
              );
            })}
          </div>

          {isStoryQuestReadyForBranch(s, openSQ.id) && openSQ.branch && !s.storyQuests.find((x) => x.id === openSQ.id)?.completed && (
            <div className="pt-3 border-t border-[var(--line)]">
              <div className="serif text-base mb-2">{openSQ.branch.prompt}</div>
              <div className="space-y-2">
                {openSQ.branch.options.map((opt) => {
                  const blocked =
                    (opt.requiresTrait && !hasTrait(s, opt.requiresTrait)) ||
                    (opt.forbidsTrait && hasTrait(s, opt.forbidsTrait));
                  return (
                    <button
                      key={opt.id}
                      className="btn"
                      disabled={!!blocked}
                      onClick={() => chooseStoryBranch(openSQ, opt)}
                    >
                      <div>{opt.label}</div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)] mt-1">
                        {opt.gainsTrait ? `Becomes: ${opt.gainsTrait}` : ""}
                        {opt.requiresTrait ? ` · requires ${opt.requiresTrait}` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {s.storyQuests.find((x) => x.id === openSQ.id)?.completed && (
            <div className="pt-3 border-t border-[var(--line)] text-sm text-[var(--muted)] italic">{openSQ.closing}</div>
          )}
        </Dialog>
      )}

      {/* Personal chain dialog */}
      {openChain && (
        <ChainDialog
          name={openChain.name}
          chain={openChain.chain}
          onClose={() => setOpenChain(null)}
          onProgress={() => progressChain(openChain.name, openChain.chain)}
          onChooseBranch={(step, opt) => chooseChainBranch(openChain.name, openChain.chain, step, opt)}
        />
      )}

      {/* Pending duel after step */}
      {pendingDuel && (
        <DuelModal
          typeId={pendingDuel.type}
          open
          onClose={() => setPendingDuel(null)}
          onResolved={(out) => {
            if (out === "win" && pendingDuel.afterStep && openChain) {
              completeChainStep(pendingDuel.afterStep.npcName, openChain.chain);
            }
            setPendingDuel(null);
          }}
        />
      )}
    </div>
  );
}

function ChainDialog({
  name,
  chain,
  onClose,
  onProgress,
  onChooseBranch,
}: {
  name: string;
  chain: PersonalChain;
  onClose: () => void;
  onProgress: () => void;
  onChooseBranch: (step: ChainStep, opt: StoryBranchOption) => void;
}) {
  const s = useGame((g) => g.state);
  const prog = s.personalProgress[name];
  const stepIndex = prog?.step ?? 0;
  const step = chain.steps[stepIndex];
  const onBranchStep = step?.branch;

  return (
    <Dialog open onClose={onClose} title={chain.title} arabic={chain.arabic}>
      <div className="text-xs text-[var(--muted)] mb-2">{name}</div>
      <p className="text-sm leading-relaxed mb-4">{chain.desc}</p>

      <ol className="space-y-2 mb-4">
        {chain.steps.map((st, i) => (
          <li key={i} className={`text-sm ${i < stepIndex ? "text-[var(--muted)] line-through" : i === stepIndex ? "" : "text-[var(--muted)]"}`}>
            <span className="text-xs mr-2">{i + 1}.</span>
            <span className="font-semibold">{st.title}</span>
            {st.requiresDuel && <span className="ml-2 pill">{st.requiresDuel}</span>}
          </li>
        ))}
      </ol>

      {prog?.completed ? (
        <div className="text-sm italic text-[var(--muted)] border-t border-[var(--line)] pt-3">{chain.completion}</div>
      ) : step ? (
        <div className="border-t border-[var(--line)] pt-3 space-y-3">
          <div>
            <div className="serif text-base">{step.title}</div>
            <p className="text-sm mt-1 leading-relaxed">{step.desc}</p>
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)] mt-1">
              {step.zone} · {step.energy}⚡
            </div>
          </div>

          {onBranchStep ? (
            <div className="space-y-2">
              <div className="text-xs text-[var(--muted)]">This step has a defining choice:</div>
              {onBranchStep.options.map((opt) => (
                <button key={opt.id} className="btn" onClick={() => onChooseBranch(step, opt)}>{opt.label}</button>
              ))}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onProgress}>
              {step.requiresDuel ? `Begin · triggers ${step.requiresDuel}` : "Do this step"}
            </button>
          )}
        </div>
      ) : null}
    </Dialog>
  );
}
