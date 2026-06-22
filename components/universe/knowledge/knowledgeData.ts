/**
 * CODEX INFINITUM — Knowledge Mastery (canon doc 4 Skills / doc 6 §6).
 * Not gamification: abilities are transformations, not badges. Realms create
 * skills; inventions prove mastery. State is DERIVED from what the visitor has
 * actually done (visitedRealms + unlockedSkills) — no XP, levels, or ranking.
 */

export interface Ability {
  id: string;
  name: string;
  /** the realm that forges this ability (slug → color + travel target) */
  source: string;
  /** realm skill id; present = this ability can reach "mastered" via Deep Archive */
  skillId?: string;
  meaning: string;
  usedIn: string[];
}

export interface Branch {
  id: string;
  name: string;
  intro: string;
  abilities: Ability[];
}

export interface LearningPathDef {
  id: string;
  name: string;
  intro: string;
  /** ordered realm slugs */
  stages: string[];
}

export interface Snapshot {
  bootCompleted: boolean;
  visitedRealms: string[];
  unlockedSkills: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  check: (s: Snapshot) => boolean;
}

export type AbilityState = "locked" | "unlocked" | "mastered";

export const BRANCHES: Branch[] = [
  {
    id: "foundation",
    name: "Foundation Mastery",
    intro: "The theory beneath everything — what can be known, and what can never be.",
    abilities: [
      { id: "computational-thinking", name: "Computational Thinking", source: "the-foundations", skillId: "computational-thinking", meaning: "Break reality into logical systems that can be solved.", usedIn: ["Algorithms", "Software", "AI"] },
      { id: "algorithmic-reasoning", name: "Algorithmic Reasoning", source: "the-foundations", meaning: "See the cost of a solution before building it.", usedIn: ["Problem Solving", "Optimization"] },
      { id: "complexity-awareness", name: "Complexity Awareness", source: "the-foundations", meaning: "Know the difference between hard and impossible.", usedIn: ["System Design", "Feasibility"] },
    ],
  },
  {
    id: "system",
    name: "System Mastery",
    intro: "The machine and the invisible forces that connect everything.",
    abilities: [
      { id: "system-understanding", name: "System Understanding", source: "silicon-foundry", skillId: "system-understanding", meaning: "See the metal beneath the abstraction.", usedIn: ["Performance", "Embedded"] },
      { id: "resource-management", name: "Resource Management", source: "the-kernel", skillId: "resource-orchestration", meaning: "Reason about what runs when, and what it costs.", usedIn: ["Concurrency", "Performance"] },
      { id: "connection-architecture", name: "Connection Architecture", source: "network-pathways", skillId: "connection-architecture", meaning: "Think in protocols and tradeoffs.", usedIn: ["Networking", "APIs"] },
      { id: "distributed-thinking", name: "Distributed Thinking", source: "cloud-expanse", skillId: "distributed-thinking", meaning: "Design for scale and failure together.", usedIn: ["Cloud", "Backends"] },
    ],
  },
  {
    id: "creation",
    name: "Creation Mastery",
    intro: "Turning ideas into systems people use — and love.",
    abilities: [
      { id: "software-architecture", name: "Software Architecture", source: "code-helix", skillId: "software-architecture", meaning: "Design how the pieces connect before writing a line.", usedIn: ["Systems", "Products"] },
      { id: "creative-engineering", name: "Creative Engineering", source: "soul-quarter", skillId: "creative-engineering", meaning: "Turn functional products into beloved ones.", usedIn: ["Design", "Frontend"] },
      { id: "product-thinking", name: "Product Thinking", source: "invention-archive", meaning: "Combine many realms into a real system people depend on.", usedIn: ["Inventions", "Delivery"] },
    ],
  },
  {
    id: "intelligence",
    name: "Intelligence Mastery",
    intro: "Where machines learn, and memory becomes insight.",
    abilities: [
      { id: "intelligence-engineering", name: "Intelligence Engineering", source: "neural-nebula", skillId: "intelligence-engineering", meaning: "Bend models toward human purpose.", usedIn: ["AI Products", "ML"] },
      { id: "data-intelligence", name: "Data Intelligence", source: "data-archives", skillId: "data-intelligence", meaning: "Turn rows into decisions.", usedIn: ["Analytics", "BI"] },
      { id: "pattern-discovery", name: "Pattern Discovery", source: "neural-nebula", meaning: "Find the signal the data is hiding.", usedIn: ["ML", "Research"] },
    ],
  },
  {
    id: "security",
    name: "Security Mastery",
    intro: "The immune system — seeing the surface before the adversary does.",
    abilities: [
      { id: "security-thinking", name: "Security Thinking", source: "the-citadel", skillId: "security-thinking", meaning: "See the attack surface before the attacker.", usedIn: ["Secure Systems", "Auth"] },
      { id: "threat-awareness", name: "Threat Awareness", source: "the-citadel", meaning: "Assume users are adversaries too.", usedIn: ["Risk", "Defense"] },
      { id: "defensive-design", name: "Defensive Design", source: "the-citadel", meaning: "Build systems that fail safe, not open.", usedIn: ["Architecture", "Auth"] },
    ],
  },
];

export const LEARNING_PATHS: LearningPathDef[] = [
  { id: "architect", name: "The Architect Path", intro: "Theory → Software → Systems → Products", stages: ["the-foundations", "code-helix", "silicon-foundry", "invention-archive"] },
  { id: "ai-engineer", name: "The AI Engineer Path", intro: "Math → Data → Machine Learning → AI Products", stages: ["the-foundations", "data-archives", "neural-nebula", "invention-archive"] },
  { id: "defender", name: "The Defender Path", intro: "Systems → Networks → Security", stages: ["silicon-foundry", "network-pathways", "the-citadel"] },
  { id: "creator", name: "The Creator Path", intro: "Ideas → Design → Experiences", stages: ["soul-quarter", "code-helix", "invention-archive"] },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-awakening", name: "First Awakening", description: "You powered on the universe.", check: (s) => s.bootCompleted },
  { id: "explorer", name: "Explorer", description: "You entered your first realm.", check: (s) => s.visitedRealms.length >= 1 },
  { id: "cartographer", name: "Cartographer", description: "You explored six or more realms.", check: (s) => s.visitedRealms.length >= 6 },
  { id: "deep-thinker", name: "Deep Thinker", description: "You descended into a Deep Archive.", check: (s) => s.unlockedSkills.length >= 1 },
  { id: "builder", name: "Builder", description: "You opened the Invention Archive.", check: (s) => s.visitedRealms.includes("invention-archive") },
  { id: "historian", name: "Historian", description: "You traced the lineage in the Founders' Constellation.", check: (s) => s.visitedRealms.includes("founders-constellation") },
  { id: "architect", name: "Architect", description: "You met the creator behind the universe.", check: (s) => s.visitedRealms.includes("architect-core") },
  { id: "horizon-seeker", name: "Horizon Seeker", description: "You reached the Observatory.", check: (s) => s.visitedRealms.includes("the-observatory") },
];

export function abilityState(a: Ability, snap: Snapshot): AbilityState {
  if (a.skillId && snap.unlockedSkills.includes(a.skillId)) return "mastered";
  if (snap.visitedRealms.includes(a.source)) return "unlocked";
  return "locked";
}

export function pathProgress(p: LearningPathDef, visited: string[]) {
  const done = p.stages.filter((s) => visited.includes(s)).length;
  return { done, total: p.stages.length };
}

export interface MasteryCounts {
  abilities: number;
  unlocked: number;
  mastered: number;
}

export function masteryCounts(snap: Snapshot): MasteryCounts {
  const all = BRANCHES.flatMap((b) => b.abilities);
  let unlocked = 0;
  let mastered = 0;
  for (const a of all) {
    const st = abilityState(a, snap);
    if (st === "mastered") {
      mastered += 1;
      unlocked += 1;
    } else if (st === "unlocked") {
      unlocked += 1;
    }
  }
  return { abilities: all.length, unlocked, mastered };
}
