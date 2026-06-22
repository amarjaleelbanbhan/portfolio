/**
 * CODEX INFINITUM — Simulation registry (Phase 10.0).
 * Maps a realm slug to its SimulationDefinition. Realms with no entry here
 * are untouched — RealmShell falls back to its original card-based render
 * (Phase 10.0 proves the engine on ONE realm only: Silicon Foundry).
 */

import type { SimulationDefinition } from "./types";

const SILICON_FOUNDRY_SIM: SimulationDefinition = {
  realmSlug: "silicon-foundry",
  title: "Signal Path — Electricity to Result",
  steps: [
    {
      id: "electricity",
      label: "ELECTRICITY",
      caption: "A voltage difference races through copper traces — the only raw material a computer ever has.",
      nexusLine: "These highways carry billions of decisions every second.",
    },
    {
      id: "logic",
      label: "LOGIC GATES",
      caption: "Two inputs meet a gate. AND, OR, and NOT are the only primitives — everything else is built from these three.",
      nexusLine: "Observe the logic gates. This is where electricity becomes logic.",
    },
    {
      id: "cpu",
      label: "CPU CYCLE",
      caption: "FETCH pulls an instruction from memory. DECODE figures out what it means. EXECUTE makes the ALU act on it.",
      nexusLine: "Every instruction begins its journey here.",
    },
    {
      id: "memory",
      label: "MEMORY",
      caption: "The CPU sends an address down the bus. RAM answers with the data that lived there.",
      nexusLine: "These structures hold the thoughts before they become action.",
    },
    {
      id: "result",
      label: "RESULT",
      caption: "The five stages collapse into one outcome — a bit, a byte, a decision the rest of the program can use.",
      nexusLine: "The calculation is complete, and the cycle begins anew.",
    },
  ],
};

export const REALM_SIMULATIONS: Record<string, SimulationDefinition> = {
  "silicon-foundry": SILICON_FOUNDRY_SIM,
};

export function getSimulation(slug: string): SimulationDefinition | null {
  return REALM_SIMULATIONS[slug] ?? null;
}
