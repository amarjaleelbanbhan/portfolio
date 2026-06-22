/**
 * CODEX INFINITUM — Simulation type contracts (Phase 10.0).
 * A "simulation" turns one realm's invisible CS process into something the
 * visitor watches happen, step by step. Text becomes secondary captioning;
 * the simulation is the primary experience (EXPERIENCE_TRANSFORMATION_PLAN.md §1).
 */

export type SimStepId = "electricity" | "logic" | "cpu" | "memory" | "result";

export interface SimStep {
  id: SimStepId;
  /** short HUD label, e.g. "FETCH" */
  label: string;
  /** the real CS process being depicted — plain, technically accurate */
  caption: string;
  /** JARVIS-toned guide line NEXUS speaks while this step is active */
  nexusLine: string;
}

export interface SimulationDefinition {
  /** the realm this simulation belongs to */
  realmSlug: string;
  /** in-world title for the stage, e.g. "Signal Path — Electricity to Result" */
  title: string;
  steps: SimStep[];
}
