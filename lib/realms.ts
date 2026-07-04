/**
 * CODEX INFINITUM — Realm Registry
 * The canonical, typed source of the universe's 15 places.
 * Mirrors universe-design/4_cs_worlds.md (Appendix B) + doc 10.
 * Every realm color matches styles/tokens.css [data-realm] exactly.
 */

export type RealmClass = "core" | "explorable" | "structural" | "connective" | "frontier";

export type NexusMode = "ARCHITECT" | "CYBER" | "QUEST" | "MENTOR" | "AMBIENT";

export interface Realm {
  /** kebab-case slug — matches [data-realm] in tokens.css and the route segment */
  slug: string;
  /** canonical display name */
  name: string;
  /** short subtitle / domain framing */
  subtitle: string;
  /** the CS domain(s) this realm represents */
  domain: string;
  /** the persona the visitor embodies here */
  identity: string;
  realmClass: RealmClass;
  /** NEXUS's dominant personality mode in this realm (doc 3 §4) */
  nexusMode: NexusMode;
  /** the deepest-layer unlock challenge, if any (doc 4 §14.2) */
  challenge?: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
}

export const REALMS: Realm[] = [
  {
    slug: "architect-core",
    name: "The Architect's Core",
    subtitle: "About · Amar Jaleel",
    domain: "The creator himself",
    identity: "The Architect",
    realmClass: "core",
    nexusMode: "ARCHITECT",
    colors: { primary: "#FBBF24", secondary: "#F59E0B", accent: "#FBBF24" },
  },
  {
    slug: "silicon-foundry",
    name: "The Silicon Foundry",
    subtitle: "Hardware · The Body of the Universe",
    domain: "Hardware · Architecture · Digital Logic · Electronics · Edge/IoT",
    identity: "The Engineer",
    realmClass: "explorable",
    nexusMode: "ARCHITECT",
    challenge: "Logic Gate Puzzle",
    colors: { primary: "#F59E0B", secondary: "#B45309", accent: "#FFF7E6" },
  },
  {
    slug: "the-foundations",
    name: "The Foundations",
    subtitle: "Mathematics & Theory of Computation",
    domain: "Discrete Math · Logic · Automata · Computability · Complexity",
    identity: "The Theorist",
    realmClass: "explorable",
    nexusMode: "MENTOR",
    challenge: "Decidable or Not?",
    colors: { primary: "#EAB308", secondary: "#F1F5F9", accent: "#DC2626" },
  },
  {
    slug: "code-helix",
    name: "The Code Helix",
    subtitle: "Software · The Language of Civilization",
    domain: "Programming · OOP · Data Structures · Algorithms · Compilers · SE",
    identity: "The Architect (as builder)",
    realmClass: "explorable",
    nexusMode: "ARCHITECT",
    challenge: "Complexity Match",
    colors: { primary: "#7C3AED", secondary: "#8B5CF6", accent: "#22C55E" },
  },
  {
    slug: "neural-nebula",
    name: "The Neural Nebula",
    subtitle: "AI · The Emergent Mind",
    domain: "Artificial Intelligence · Machine Learning · Deep Learning · Data Science",
    identity: "Scientist + Inventor + Product Creator",
    realmClass: "explorable",
    nexusMode: "MENTOR",
    challenge: "Architecture Question",
    colors: { primary: "#3B82F6", secondary: "#06B6D4", accent: "#8B5CF6" },
  },
  {
    slug: "the-citadel",
    name: "The Citadel",
    subtitle: "Cyber · The Immune System",
    domain: "Cybersecurity · Networking · Privacy",
    identity: "The System Defender",
    realmClass: "explorable",
    nexusMode: "CYBER",
    challenge: "Spot the Vulnerability",
    colors: { primary: "#EF4444", secondary: "#1F2937", accent: "#22C55E" },
  },
  {
    slug: "data-archives",
    name: "The Data Archives",
    subtitle: "Data · The Memory of the Universe",
    domain: "Databases · Data Analytics · Information Systems · Research",
    identity: "The Researcher",
    realmClass: "explorable",
    nexusMode: "MENTOR",
    challenge: "Read the Chart",
    colors: { primary: "#7DD3FC", secondary: "#F8FAFC", accent: "#F59E0B" },
  },
  {
    slug: "soul-quarter",
    name: "The Soul Quarter",
    subtitle: "Creative · The Soul & The Spark",
    domain: "Design · Creativity · Graphics · Games · Interactive Experiences",
    identity: "The Creator + Artist",
    realmClass: "explorable",
    nexusMode: "QUEST",
    challenge: "The Aesthetic Eye",
    colors: { primary: "#C084FC", secondary: "#F0ABFC" },
  },
  {
    slug: "founders-constellation",
    name: "The Founders' Constellation",
    subtitle: "The History of Computing",
    domain: "The field's past — the ancestry of CS",
    identity: "The collective ancestry",
    realmClass: "structural",
    nexusMode: "MENTOR",
    colors: { primary: "#B08D57", secondary: "#F8FAFC", accent: "#67E8F9" },
  },
  {
    slug: "the-observatory",
    name: "The Observatory",
    subtitle: "The Future · Contact · Collaboration",
    domain: "The future / the invitation",
    identity: "The Architect, looking outward",
    realmClass: "structural",
    nexusMode: "ARCHITECT",
    colors: { primary: "#312E81", secondary: "#F8FAFC" },
  },
  {
    slug: "legacy-archive",
    name: "The Legacy Archive",
    subtitle: "Portfolio v1.0 · The First Gateway",
    domain: "The creator's past — preserved",
    identity: "The origin",
    realmClass: "structural",
    nexusMode: "QUEST",
    colors: { primary: "#78350F", secondary: "#6B7280", accent: "#92400E" },
  },
  {
    slug: "the-kernel",
    name: "The Kernel",
    subtitle: "Operating Systems · The Breathable Atmosphere",
    domain: "Operating Systems · Concurrency · Memory · Scheduling",
    identity: "The Arbiter",
    realmClass: "connective",
    nexusMode: "AMBIENT",
    colors: { primary: "#94A3B8", secondary: "#22D3EE" },
  },
  {
    slug: "network-pathways",
    name: "Network Pathways",
    subtitle: "The Nervous System · The Connective Layer",
    domain: "Networking · the medium of connection",
    identity: "The infrastructure of awareness",
    realmClass: "connective",
    nexusMode: "AMBIENT",
    colors: { primary: "#0D9488", secondary: "#EA580C" },
  },
  {
    slug: "cloud-expanse",
    name: "The Cloud Expanse",
    subtitle: "The Sky · The Infinite Expanse Above",
    domain: "Cloud · Distributed Systems",
    identity: "Computation that lives nowhere and everywhere",
    realmClass: "connective",
    nexusMode: "ARCHITECT",
    colors: { primary: "#38BDF8", secondary: "#FFFFFF" },
  },
  {
    slug: "invention-archive",
    name: "The Invention Archive",
    subtitle: "The Cross-Realm Vault · Where Projects Live",
    domain: "The works themselves",
    identity: "The hall of inventions",
    realmClass: "connective",
    nexusMode: "QUEST",
    colors: { primary: "#00F5FF", secondary: "#1E3A5F" },
  },
];

/** The six (now seven) worlds the visitor travels *into*. */
export const EXPLORABLE_REALMS = REALMS.filter((r) => r.realmClass === "explorable");

export const REALM_BY_SLUG: Record<string, Realm> = Object.fromEntries(
  REALMS.map((r) => [r.slug, r]),
);

export function getRealm(slug: string): Realm | undefined {
  return REALM_BY_SLUG[slug];
}

/** The frontier fog — fields not yet mastered (doc 4 §13). Honesty made visible. */
export const UNEXPLORED_TERRITORIES = [
  "Quantum Computing",
  "Neuromorphic Engineering",
  "Advanced Robotics",
  "Formal Verification",
  "Computational Biology",
  "AR / VR Systems",
  "Brain-Computer Interfaces",
  "AGI & Alignment",
] as const;
