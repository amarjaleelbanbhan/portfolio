/**
 * CODEX INFINITUM — Universe Map Layout
 * The realms are NOT randomly placed. Position + connections encode the
 * architecture of Computer Science (canon doc 4 §0/§14.3 + doc 10).
 *
 * Conceptual layers, center outward:
 *   Core → Foundation → Physical → System → Creation → Intelligence
 *        → Protection → Future, with History/Legacy as far poles.
 * Edges = real CS relationships (the map teaches CS).
 */

import { REALM_BY_SLUG, type Realm } from "@/lib/realms";

export type Vec3 = [number, number, number];

interface RawPlacement {
  slug: string;
  layer: string;
  radius: number;
  angleDeg: number;
  z: number;
  tagline: string;
  concepts: string[];
}

const RAW: RawPlacement[] = [
  { slug: "architect-core", layer: "The Core Spark", radius: 0, angleDeg: 0, z: 0,
    tagline: "Every universe has a center of gravity. This one has a person.",
    concepts: ["Systems Thinking", "AI Product Engineering", "The First Question"] },

  { slug: "the-foundations", layer: "Foundation", radius: 4.5, angleDeg: 270, z: 0,
    tagline: "The laws beneath every digital world.",
    concepts: ["Automata", "Logic", "Computability", "Complexity", "Discrete Math"] },

  { slug: "silicon-foundry", layer: "Physical", radius: 5.6, angleDeg: 232, z: 0.2,
    tagline: "Where the digital body is forged.",
    concepts: ["Digital Logic", "Computer Architecture", "Memory Hierarchy", "Electronics", "Edge / IoT"] },

  { slug: "the-kernel", layer: "System", radius: 6.6, angleDeg: 198, z: -1,
    tagline: "The atmosphere every program breathes.",
    concepts: ["Processes", "Scheduling", "Virtual Memory", "Concurrency"] },

  { slug: "network-pathways", layer: "System", radius: 6.6, angleDeg: 158, z: 0.6,
    tagline: "No intelligence exists in isolation.",
    concepts: ["TCP/IP", "DNS", "Routing", "Protocols"] },

  { slug: "code-helix", layer: "Creation", radius: 6, angleDeg: 112, z: 0,
    tagline: "Where ideas receive a language.",
    concepts: ["Programming", "Data Structures", "Algorithms", "OOP", "Compilers"] },

  { slug: "soul-quarter", layer: "Creation", radius: 6, angleDeg: 70, z: 0.6,
    tagline: "Imagination becomes reality.",
    concepts: ["Design", "HCI", "Graphics", "Game Dev", "Creative Coding"] },

  { slug: "neural-nebula", layer: "Intelligence", radius: 6.6, angleDeg: 22, z: -1,
    tagline: "Where machines learn.",
    concepts: ["Machine Learning", "Deep Learning", "Neural Nets", "Data Science"] },

  { slug: "data-archives", layer: "Intelligence", radius: 6.6, angleDeg: 340, z: 0.2,
    tagline: "The memory of the universe.",
    concepts: ["Databases", "SQL", "Analytics", "Information Systems"] },

  { slug: "the-citadel", layer: "Protection", radius: 6, angleDeg: 302, z: 0,
    tagline: "Where the universe protects itself.",
    concepts: ["Cybersecurity", "OWASP", "Network Defense", "Threat Modeling"] },

  { slug: "the-observatory", layer: "Future", radius: 9, angleDeg: 90, z: -2,
    tagline: "The journey never ends.",
    concepts: ["AGI & Alignment", "Quantum", "Frontiers", "Collaboration"] },

  { slug: "cloud-expanse", layer: "Connective · Sky", radius: 5, angleDeg: 90, z: 3.6,
    tagline: "Computation that lives nowhere and everywhere.",
    concepts: ["Cloud", "Distributed Systems", "Serverless", "Scalability"] },

  { slug: "invention-archive", layer: "Connective · Works", radius: 2.9, angleDeg: 315, z: 3,
    tagline: "Projects are not cards. They are inventions.",
    concepts: ["VisiRoD FIRS", "CommentFellows", "GitHub Works"] },

  { slug: "legacy-archive", layer: "The Past", radius: 9.6, angleDeg: 214, z: -3,
    tagline: "The first gateway before the universe.",
    concepts: ["Portfolio v1.0", "The Origin"] },

  { slug: "founders-constellation", layer: "History", radius: 10.6, angleDeg: 34, z: -3,
    tagline: "Every realm was once an impossible idea.",
    concepts: ["Turing", "von Neumann", "Shannon", "Lovelace"] },
];

export interface RealmPlacement extends RawPlacement {
  realm: Realm;
  position: Vec3;
  /** normalized -1..1 coords for the 2D / SVG fallback */
  nx: number;
  ny: number;
}

const EXTENT = 11; // for 2D normalization

export const PLACEMENTS: RealmPlacement[] = RAW.map((r) => {
  const a = (r.angleDeg * Math.PI) / 180;
  const x = r.radius * Math.cos(a);
  const y = r.radius * Math.sin(a);
  return {
    ...r,
    realm: REALM_BY_SLUG[r.slug],
    position: [x, y, r.z] as Vec3,
    nx: x / EXTENT,
    ny: y / EXTENT,
  };
});

export const PLACEMENT_BY_SLUG: Record<string, RealmPlacement> = Object.fromEntries(
  PLACEMENTS.map((p) => [p.slug, p]),
);

/** Conceptual layer order for the accessible Realm Index grouping. */
export const LAYER_ORDER = [
  "The Core Spark",
  "Foundation",
  "Physical",
  "System",
  "Creation",
  "Intelligence",
  "Protection",
  "Connective · Sky",
  "Connective · Works",
  "Future",
  "History",
  "The Past",
];

export interface Edge {
  from: string;
  to: string;
  /** the CS insight this connection represents (canon doc 4 §14.3) */
  label?: string;
}

/** Relationship topology — the dependencies that make the map teach CS. */
export const EDGES: Edge[] = [
  { from: "architect-core", to: "the-foundations" },
  { from: "architect-core", to: "code-helix" },
  { from: "architect-core", to: "neural-nebula" },
  { from: "architect-core", to: "invention-archive" },
  { from: "legacy-archive", to: "architect-core", label: "where it began" },

  { from: "the-foundations", to: "silicon-foundry", label: "a Turing machine became a CPU" },
  { from: "the-foundations", to: "code-helix", label: "algorithms are applied theory" },

  { from: "silicon-foundry", to: "the-kernel", label: "the OS is the first program the hardware trusts" },
  { from: "the-kernel", to: "network-pathways" },
  { from: "the-kernel", to: "cloud-expanse", label: "distributed systems are concurrency that crossed an ocean" },

  { from: "network-pathways", to: "the-citadel", label: "every connection is a tap point" },

  { from: "code-helix", to: "neural-nebula", label: "an AI is software with learned rules" },
  { from: "code-helix", to: "soul-quarter", label: "taste without craft is a wish" },
  { from: "code-helix", to: "invention-archive" },

  { from: "neural-nebula", to: "data-archives", label: "no memory, no mind" },
  { from: "neural-nebula", to: "the-citadel", label: "a model is an attack surface" },
  { from: "neural-nebula", to: "invention-archive" },
  { from: "neural-nebula", to: "the-observatory", label: "the trajectory continues" },

  { from: "data-archives", to: "cloud-expanse", label: "your memory lives in someone's sky" },

  { from: "founders-constellation", to: "the-foundations", label: "lineage" },
  { from: "founders-constellation", to: "silicon-foundry", label: "lineage" },
  { from: "founders-constellation", to: "neural-nebula", label: "lineage" },
];

export function edgeSegment(e: Edge): { a: Vec3; b: Vec3 } | null {
  const a = PLACEMENT_BY_SLUG[e.from];
  const b = PLACEMENT_BY_SLUG[e.to];
  if (!a || !b) return null;
  return { a: a.position, b: b.position };
}
