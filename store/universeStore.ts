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

export type TransitionPhase = "idle" | "exiting" | "entering" | "complete";
export type NexusMode = "ARCHITECT" | "CYBER" | "QUEST" | "MENTOR" | "AMBIENT";
export type NexusAnimState = "IDLE" | "SPEAKING" | "THINKING" | "ALERT" | "EXCITED";

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

  // — Device (runtime, not persisted) —
  deviceTier: DeviceTier;
  webglSupported: boolean;
  prefersReducedMotion: boolean;

  // — Actions —
  enterRealm: (slug: string) => void;
  exitRealm: () => void;
  selectRealm: (slug: string | null) => void;
  hoverRealm: (slug: string | null) => void;
  unlockSkill: (id: string) => void;
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

      deviceTier: 2,
      webglSupported: true,
      prefersReducedMotion: false,

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
      }),
    },
  ),
);
