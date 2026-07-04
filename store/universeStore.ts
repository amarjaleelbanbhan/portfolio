/**
 * CODEX INFINITUM — global state (doc 8 §State Management)
 * Zustand store. ~1KB, works outside React (so GSAP timelines can drive it),
 * with localStorage persistence so the universe "remembers" returning visitors.
 *
 * Phase 0: skeleton + actions. Realms, boot, NEXUS, and device wiring are
 * consumed by later phases.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DeviceTier } from "@/lib/deviceTier";
import type { KnowledgeLevel } from "@/lib/environments/types";

export type TransitionPhase = "idle" | "exiting" | "entering" | "complete";
export type NexusMode = "ARCHITECT" | "CYBER" | "QUEST" | "MENTOR" | "AMBIENT";
export type NexusAnimState = "IDLE" | "SPEAKING" | "THINKING" | "ALERT" | "EXCITED";

export type MasterJourneyPhase = 
  | "code-creation" 
  | "kernel-scheduler" 
  | "silicon-execution" 
  | "network-hop" 
  | "citadel-check" 
  | "database-lookup" 
  | "neural-inference" 
  | "cloud-deployment"
  | null;

interface UniverseState {
  // — Navigation —
  currentRealm: string | null;
  previousRealm: string | null;
  /** realm chosen on the map but not yet travelled into (travel preparation) */
  selectedRealm: string | null;
  /** realm currently hovered/focused on the map (shared with NEXUS) */
  hoveredRealm: string | null;
  transitionPhase: TransitionPhase;

  // — Progress (persisted) —
  visitedRealms: string[];
  unlockedEasterEggs: string[];
  unlockedSkills: string[];
  totalTimeInUniverse: number;

  // — Boot (bootCompleted persisted) —
  bootCompleted: boolean;
  bootSkipped: boolean;

  // — NEXUS —
  nexusMode: NexusMode;
  nexusAnimState: NexusAnimState;
  nexusDialogue: string | null;
  nexusVisible: boolean;

  // — Knowledge mastery panel (runtime) —
  knowledgeOpen: boolean;

  // — Device (runtime, not persisted) —
  deviceTier: DeviceTier;
  webglSupported: boolean;
  prefersReducedMotion: boolean;

  // — Living Realm Environment State (runtime) —
  activeLandmark: string | null;
  activeLevel: KnowledgeLevel;
  activeSimStep: number;
  activeMasterJourneyPhase: MasterJourneyPhase;

  // — NEXUS event reactions (runtime, Phase 1.1 signature interactions) —
  /** Incrementing token + event name; NexusCompanion watches this to speak a reaction line. */
  nexusEvent: { name: string; token: number } | null;

  // — Architect finale gating (Observatory, Phase 1.1) —
  architectFinaleShown: boolean;
  /** True once the visitor has completed the full "Follow The Data" master journey. */
  masterJourneyCompleted: boolean;

  // — Signature-action tracking (Phase 14, minimal — persisted) —
  /** Total signature actions completed across all 6 realms (SEND PACKET, CREATE CODE, etc). */
  signatureActionsCompleted: number;
  /** Per-realm count of signature actions, keyed by realm slug. */
  signatureActionsByRealm: Record<string, number>;

  // — Sound Design —
  /** Whether the synthesized sound engine is active. Off by default (WCAG 1.4.2). */
  soundEnabled: boolean;

  // — Actions —
  enterRealm: (slug: string) => void;
  exitRealm: () => void;
  selectRealm: (slug: string | null) => void;
  hoverRealm: (slug: string | null) => void;
  unlockSkill: (id: string) => void;
  toggleKnowledge: (open?: boolean) => void;
  setTransitionPhase: (phase: TransitionPhase) => void;
  completeBoot: (skipped?: boolean) => void;
  setNexusMode: (mode: NexusMode) => void;
  setNexusAnimState: (state: NexusAnimState) => void;
  sayNexus: (line: string | null) => void;
  setNexusVisible: (visible: boolean) => void;
  unlockEgg: (id: string) => void;
  setDeviceProfile: (p: {
    deviceTier: DeviceTier;
    webglSupported: boolean;
    prefersReducedMotion: boolean;
  }) => void;
  addTime: (seconds: number) => void;

  // — Living Realm Actions —
  selectLandmark: (id: string | null) => void;
  setLevel: (level: KnowledgeLevel) => void;
  setSimStep: (index: number) => void;
  setMasterJourneyPhase: (phase: MasterJourneyPhase) => void;

  /** Fire a named NEXUS reaction event (e.g. "packetSent"). */
  fireNexusEvent: (name: string) => void;
  /** Mark the one-time Architect finale line in the Observatory as shown. */
  setArchitectFinaleShown: (shown: boolean) => void;
  /** Mark the master journey ("Follow The Data") as completed. */
  setMasterJourneyCompleted: (completed: boolean) => void;
  /** Record a completed signature action for a realm (increments totals). */
  recordSignatureAction: (slug: string) => void;
  /** The realm slug with the most recorded signature actions, if any. */
  mostInteractedRealm: () => string | null;
  /** Toggle the synthesized sound engine on/off. */
  toggleSound: (on?: boolean) => void;
}

export const useUniverseStore = create<UniverseState>()(
  persist(
    (set, get) => ({
      currentRealm: null,
      previousRealm: null,
      selectedRealm: null,
      hoveredRealm: null,
      transitionPhase: "idle",

      visitedRealms: [],
      unlockedEasterEggs: [],
      unlockedSkills: [],
      totalTimeInUniverse: 0,

      bootCompleted: false,
      bootSkipped: false,

      nexusMode: "ARCHITECT",
      nexusAnimState: "IDLE",
      nexusDialogue: null,
      nexusVisible: true,

      knowledgeOpen: false,

      deviceTier: 2,
      webglSupported: true,
      prefersReducedMotion: false,

      activeLandmark: null,
      activeLevel: "beginner",
      activeSimStep: 0,
      activeMasterJourneyPhase: null,

      nexusEvent: null,
      architectFinaleShown: false,
      masterJourneyCompleted: false,

      signatureActionsCompleted: 0,
      signatureActionsByRealm: {},

      soundEnabled: false,

      enterRealm: (slug) =>
        set((s) => ({
          previousRealm: s.currentRealm,
          currentRealm: slug,
          visitedRealms: s.visitedRealms.includes(slug)
            ? s.visitedRealms
            : [...s.visitedRealms, slug],
        })),

      exitRealm: () => set((s) => ({ previousRealm: s.currentRealm, currentRealm: null })),

      selectRealm: (selectedRealm) => set({ selectedRealm }),
      hoverRealm: (hoveredRealm) => set({ hoveredRealm }),

      unlockSkill: (id) =>
        set((s) => ({
          unlockedSkills: s.unlockedSkills.includes(id)
            ? s.unlockedSkills
            : [...s.unlockedSkills, id],
        })),

      toggleKnowledge: (open) =>
        set((s) => ({ knowledgeOpen: open ?? !s.knowledgeOpen })),

      setTransitionPhase: (transitionPhase) => set({ transitionPhase }),

      completeBoot: (skipped = false) =>
        set({ bootCompleted: true, bootSkipped: skipped }),

      setNexusMode: (nexusMode) => set({ nexusMode }),
      setNexusAnimState: (nexusAnimState) => set({ nexusAnimState }),
      sayNexus: (nexusDialogue) => set({ nexusDialogue }),
      setNexusVisible: (nexusVisible) => set({ nexusVisible }),

      unlockEgg: (id) =>
        set((s) => ({
          unlockedEasterEggs: s.unlockedEasterEggs.includes(id)
            ? s.unlockedEasterEggs
            : [...s.unlockedEasterEggs, id],
        })),

      setDeviceProfile: (p) => set({ ...p }),

      addTime: (seconds) =>
        set((s) => ({ totalTimeInUniverse: s.totalTimeInUniverse + seconds })),

      selectLandmark: (activeLandmark) => set({ activeLandmark }),
      setLevel: (activeLevel) => set({ activeLevel }),
      setSimStep: (activeSimStep) => set({ activeSimStep }),
      setMasterJourneyPhase: (activeMasterJourneyPhase) => set({ activeMasterJourneyPhase }),

      fireNexusEvent: (name) =>
        set((s) => ({ nexusEvent: { name, token: (s.nexusEvent?.token ?? 0) + 1 } })),
      setArchitectFinaleShown: (architectFinaleShown) => set({ architectFinaleShown }),
      setMasterJourneyCompleted: (masterJourneyCompleted) => set({ masterJourneyCompleted }),

      recordSignatureAction: (slug) =>
        set((s) => ({
          signatureActionsCompleted: s.signatureActionsCompleted + 1,
          signatureActionsByRealm: {
            ...s.signatureActionsByRealm,
            [slug]: (s.signatureActionsByRealm[slug] ?? 0) + 1,
          },
        })),
      mostInteractedRealm: () => {
        const byRealm = get().signatureActionsByRealm;
        let best: string | null = null;
        let bestCount = 0;
        for (const [slug, count] of Object.entries(byRealm)) {
          if (count > bestCount) {
            best = slug;
            bestCount = count;
          }
        }
        return best;
      },

      toggleSound: (on) => set((s) => ({ soundEnabled: on ?? !s.soundEnabled })),
    }),
    {
      name: "codex-infinitum",
      storage: createJSONStorage(() => localStorage),
      // Only durable progress is persisted (doc 8). Runtime/device is not.
      partialize: (s) => ({
        visitedRealms: s.visitedRealms,
        unlockedEasterEggs: s.unlockedEasterEggs,
        unlockedSkills: s.unlockedSkills,
        totalTimeInUniverse: s.totalTimeInUniverse,
        bootCompleted: s.bootCompleted,
        architectFinaleShown: s.architectFinaleShown,
        masterJourneyCompleted: s.masterJourneyCompleted,
        signatureActionsCompleted: s.signatureActionsCompleted,
        signatureActionsByRealm: s.signatureActionsByRealm,
        soundEnabled: s.soundEnabled,
      }),
    },
  ),
);
