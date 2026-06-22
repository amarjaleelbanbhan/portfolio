/**
 * CODEX INFINITUM — Simulation registry (Phase 10.0).
 * Maps a realm slug to its SimulationDefinition. Realms with no entry here
 * are untouched — RealmShell falls back to its original card-based render
 * (Phase 10.0 proves the engine on ONE realm only: Silicon Foundry).
 */

import type { SimulationDefinition } from "./types";
import { REALM_KNOWLEDGE } from "../environments/registry";

export const REALM_SIMULATIONS: Record<string, SimulationDefinition> = Object.keys(REALM_KNOWLEDGE).reduce((acc, slug) => {
  const knowledge = REALM_KNOWLEDGE[slug];
  acc[slug] = {
    realmSlug: knowledge.realmSlug,
    title: knowledge.title,
    steps: knowledge.steps.map((s) => ({
      id: s.id,
      label: s.label,
      caption: s.caption,
      nexusLine: s.nexusLine,
    })),
  };
  return acc;
}, {} as Record<string, SimulationDefinition>);

export function getSimulation(slug: string): SimulationDefinition | null {
  return REALM_SIMULATIONS[slug] ?? null;
}

