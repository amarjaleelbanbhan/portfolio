/**
 * CODEX INFINITUM — Realm content model (reusable across all realms).
 * Every explorable realm is authored as a RealmContent: three depth districts
 * (Surface / Interior / Archive, canon doc 4 §14.1) + one unlockable skill.
 * Phase 4 ships The Foundations; future realms add entries to CONTENT.
 */

export type DistrictId = "surface" | "interior" | "archive";

export interface DistrictTopic {
  name: string;
  blurb: string;
}

export interface District {
  id: DistrictId;
  /** in-world name, e.g. "The Hall of Axioms" */
  name: string;
  /** audience framing, e.g. "Surface · For everyone" */
  layerLabel: string;
  /** the emotional/explanatory lede for this layer */
  intro: string;
  topics: DistrictTopic[];
  /** archive districts are gated behind a depth unlock */
  gated?: boolean;
}

export interface RealmSkill {
  id: string;
  name: string;
  origin: string;
  effect: string;
  usedIn: string[];
}

export interface RealmContent {
  slug: string;
  /** the realm's message/koan (canon doc 4 "Message") */
  message: string;
  atmosphere: string;
  districts: District[];
  skill: RealmSkill;
}

const FOUNDATIONS: RealmContent = {
  slug: "the-foundations",
  message:
    "Before the metal, before the code — there was the question of what can be known, and what can never be.",
  atmosphere:
    "Tessellating planes of light. Glowing theorems. An infinite library where machines first learned the rules of thinking.",
  districts: [
    {
      id: "surface",
      name: "The Hall of Axioms",
      layerLabel: "Surface · For everyone",
      intro:
        "Before computers could think, humans discovered the rules of thinking. Logic. Mathematics. The quiet art of solving a problem by breaking it into truths that cannot be argued with.",
      topics: [
        { name: "Logic", blurb: "The grammar of certainty — true, false, and the rules that bind them." },
        { name: "Mathematics", blurb: "Not invented but discovered — patterns that were always there, waiting." },
        { name: "Problem Solving", blurb: "Turning a vast unknown into a sequence of knowable steps." },
      ],
    },
    {
      id: "interior",
      name: "The Computation Engine",
      layerLabel: "Interior · For developers",
      intro:
        "Descend into the machinery. Here the abstract becomes mechanical — structures, relationships, and the cost of every solution made visible before a line of code is written.",
      topics: [
        { name: "Discrete Mathematics", blurb: "The mathematics of the countable — the native language of computers." },
        { name: "Boolean Logic", blurb: "AND, OR, NOT — the atoms every circuit and condition is built from." },
        { name: "Graph Theory", blurb: "Nodes and edges: networks, dependencies, the shape of relationships." },
        { name: "Algorithms", blurb: "Recipes with guarantees — applied theory wearing work clothes." },
        { name: "Complexity", blurb: "Big-O: knowing the cost of a solution before you pay it." },
      ],
    },
    {
      id: "archive",
      name: "The Incompleteness Vault",
      layerLabel: "Deep Archive · For the curious",
      gated: true,
      intro:
        "The deepest, most honest room in the universe — where computation meets its own limits. Not everything that can be asked can be answered. This is where you learn the difference between hard and impossible.",
      topics: [
        { name: "Automata Theory", blurb: "Machines defined by states and transitions — computation, distilled." },
        { name: "Finite Automata", blurb: "The simplest computers: they accept, reject, and remember almost nothing." },
        { name: "Turing Machines", blurb: "An idea, on infinite tape, that defines what 'computable' even means." },
        { name: "Computability", blurb: "The map of what any machine, anywhere, could ever solve." },
        { name: "The Halting Problem", blurb: "Proof that some questions no program can ever answer — including about itself." },
        { name: "P vs NP", blurb: "The universe's greatest open question: is finding as easy as checking?" },
        { name: "Gödel's Incompleteness", blurb: "In any rich system, true statements exist that it can never prove." },
      ],
    },
  ],
  skill: {
    id: "computational-thinking",
    name: "Computational Thinking",
    origin: "The Foundations",
    effect:
      "Knows what can be computed, what is provably hard, and what no machine will ever solve. Reduces the unknown to the known.",
    usedIn: ["Algorithms", "Artificial Intelligence", "Software Engineering"],
  },
};

/** Realm content registry. Future realms append here. */
export const REALM_CONTENT: Record<string, RealmContent> = {
  [FOUNDATIONS.slug]: FOUNDATIONS,
};

export function getRealmContent(slug: string | null): RealmContent | undefined {
  return slug ? REALM_CONTENT[slug] : undefined;
}

/** A realm is "enterable" once its interior content exists. */
export function isEnterable(slug: string | null): boolean {
  return !!getRealmContent(slug);
}
