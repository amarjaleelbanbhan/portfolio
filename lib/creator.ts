/**
 * CODEX INFINITUM — the Architect's identity content (Architect's Core +
 * Observatory). A Journey Archive, not a résumé. Professional links are read
 * from data/portfolio.js (single source of truth) inside the Observatory.
 */

export interface JourneyStep {
  phase: string;
  text: string;
}

export interface DnaStrand {
  /** realm slug — colors the strand and links back into the universe */
  slug: string;
  trait: string;
  note: string;
}

export const CREATOR = {
  identity: "AI Product Engineer",
  oneLine: "A creator who transforms ideas into intelligent digital products.",
  originQuestion: "How does this computer work?",
  originStory:
    "It began with a child and a glowing machine, and a single stubborn question. Not 'what can it do for me' — but 'how does it work?' That question never closed. It only grew into a universe.",

  journey: [
    { phase: "Hardware Curiosity", text: "Taking the machine apart in his head — wanting to know what was beneath the screen." },
    { phase: "Software Creation", text: "Discovering that ideas could be given a language, and a language could be given to a machine." },
    { phase: "Systems Engineering", text: "Learning to see the whole — how pieces connect before a single line is written." },
    { phase: "Artificial Intelligence", text: "Watching machines learn, and deciding to build with that, not just marvel at it." },
    { phase: "Intelligent Products", text: "Turning all of it into real systems people depend on — the work of an AI Product Engineer." },
  ] as JourneyStep[],

  focus: [
    "Full-Stack Systems",
    "Artificial Intelligence",
    "Product Engineering",
    "Cybersecurity Curiosity",
    "Computer Science Exploration",
  ],

  /** How each realm shaped the creator. */
  dna: [
    { slug: "the-foundations", trait: "Computational Thinking", note: "reduce the unknown to the knowable" },
    { slug: "code-helix", trait: "Building Systems", note: "turn intention into structure" },
    { slug: "neural-nebula", trait: "Intelligent Products", note: "bend models toward human purpose" },
    { slug: "the-citadel", trait: "Secure Thinking", note: "trust is proven, never assumed" },
    { slug: "data-archives", trait: "Information Design", note: "find the story in the numbers" },
    { slug: "soul-quarter", trait: "Experience Creation", note: "make it felt, not just functional" },
  ] as DnaStrand[],

  mission: "Building intelligent digital products.",
  futureInterests: ["AI Engineering", "AI Security", "Open Source", "Advanced Systems"],
  horizon: ["AGI & Alignment", "Quantum Computing", "Human-Machine Systems"],
  invitation: "Let's build something the universe hasn't seen yet.",
};
