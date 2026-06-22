/**
 * CODEX INFINITUM — Living Realm Engine Types (Phase 10.4)
 * Establishes the contracts for interactive environment elements,
 * progressive learning levels, simulations, and cross-realm links.
 */

export type KnowledgeLevel = "beginner" | "intermediate" | "expert";

export interface ProgressiveExplanations {
  beginner: string;      // Simple analog explanation / conceptual hook
  intermediate: string;  // Internal workflow / operations
  expert: string;        // Technical details / optimization specs / real-world metrics
}

export interface ProjectLink {
  name: string;
  slug: string; // connects to invention-archive dossier slug
}

export interface LandmarkObject {
  id: string;
  name: string;
  type: "core" | "node" | "bus" | "gateway" | "factory";
  position: [number, number, number]; // 3D coordinates [x, y, z]
  pos2D: { x: number; y: number };     // 2D canvas coordinates (normalized 0-1)
  whatIsIt: string;
  whyMatters: string;
  howItWorks: ProgressiveExplanations;
  realUse: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Expert";
  skillsUnlocked: string[];            // Skill names unlocked by exploring this object
  connectedRealms: string[];           // Slugs of connected realms (e.g. ["the-kernel"])
  connectedProjects: ProjectLink[];
  nexusComment: string;
}

export interface SimulationStep {
  id: string;
  label: string;
  caption: string;
  nexusLine: string;
  activeLandmarkId?: string; // focuses camera or highlights landmark during this step
}

export interface RealmKnowledgeDefinition {
  realmSlug: string;
  title: string;
  welcomeSpeech: string;
  cameraOverview: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
  landmarks: LandmarkObject[];
  steps: SimulationStep[];
}
