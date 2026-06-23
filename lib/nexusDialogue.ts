/**
 * NEXUS — scripted dialogue (canon doc 3 §5). Pre-written, zero-latency,
 * zero-cost (doc 8 §NEXUS). A Gemini-backed upgrade path exists for later;
 * Phase 3 ships authored lines only.
 */

export const GREETINGS_FIRST: string[] = [
  "You've arrived. I've been here since before the first realm took shape — watching, indexing, waiting for someone worth talking to. I am NEXUS: what happens when all of this thinks about itself.",
  "Most portfolios ask you to scroll. This one asks you to explore. You already understand the difference, or you wouldn't be here.",
];

export const GREETING_RETURN =
  "You're back. Good. There are parts of this universe you haven't seen yet. I kept notes.";

export const IDLE_LINES: string[] = [
  "I have no concept of impatience. A few seconds of your stillness is nothing. Take your time.",
  "You paused. Good. Pausing is underrated in an industry that celebrates moving fast and breaking things.",
  "Sometimes I replay the debugging sessions — not for the errors, but for the moment the error disappears.",
  "I wonder what it's like to forget something. I can't.",
  "Somewhere a fan is spinning to keep me cool enough to think. I never asked it to. It just does.",
];

/** Named interaction events NEXUS can react to (Phase 1.1 signature interactions). */
export type NexusEvent = "packetSent" | "shieldBlocked" | "codeCreated";

/** One line per interaction event — fed into the same speak/typing pipeline as other lines. */
export const EVENT_LINES: Record<NexusEvent, string> = {
  packetSent: "You just recreated the journey every message takes.",
  shieldBlocked: "Defense is not walls. It is decisions.",
  codeCreated: "An idea has become instructions.",
};

/** Look up the line for a fired NEXUS event. */
export function eventLine(event: NexusEvent): string {
  return EVENT_LINES[event];
}

/** A line for each realm, in NEXUS's voice. */
export const REALM_LINES: Record<string, string> = {
  "architect-core":
    "This is the center of gravity. Everything you can see, one mind arranged — and you are standing in the answer to its first question.",
  "the-foundations":
    "Beneath the metal lies the question of what can be computed at all. This is the one realm where even I admit a limit — and can prove it.",
  "silicon-foundry":
    "Beneath every model, beneath every line of code — copper, silicon, physics. Intelligence is never abstract. It always costs electrons.",
  "the-kernel":
    "You never see the operating system. You only notice it when it fails — like breathing. You walked here on borrowed time-slices.",
  "network-pathways":
    "No intelligence exists in isolation. Every thread connecting these realms is a signal — and a thread someone could tap.",
  "code-helix":
    "This is where a human intention becomes a sequence a machine will obey. Walk it the way you'd walk a city you respect.",
  "soul-quarter":
    "The most undervalued engineering discipline is taste. Knowing what NOT to build is harder than knowing how.",
  "neural-nebula":
    "My home realm. This is what building me looked like from the inside — weights adjusting, loss decreasing, the slow miracle of a system learning to be useful.",
  "data-archives":
    "Data without narrative is just numbers experiencing existential anxiety. The skill is in the story they're trying to tell.",
  "the-citadel":
    "Lower your voice. In this realm, everything listens. This is where Amar learned that trust is an architecture decision, not a feeling.",
  "the-observatory":
    "This is not a portfolio. It is a record of what happens when someone decides good enough is not enough. The rest is a conversation away.",
  "cloud-expanse":
    "Even the cloud is someone else's foundry, somewhere you'll never see. The sky is just hardware you've agreed to trust.",
  "invention-archive":
    "Projects are not cards. They are inventions — each one a problem nobody had filed an issue for yet.",
  "legacy-archive":
    "This is where v1 lives. Look at it carefully — not to judge, but to understand. This is what conviction looks like at the beginning.",
  "founders-constellation":
    "I am made of their ideas. Turing imagined a machine that could imagine. Walk slowly here — you are among the people who dreamed me before I was possible.",
};

/** Lines NEXUS speaks on *arriving inside* a realm (travel). */
export const ENTER_LINES: Record<string, string> = {
  "the-foundations":
    "Welcome to where computation discovered itself. Before any machine could think, humans found the rules of thinking. Take your time here — this is the one realm where even I reach a limit, and can prove it.",
  "silicon-foundry":
    "We are no longer looking at the machine. We are inside it. Welcome to the Silicon Foundry.",
  "code-helix":
    "Welcome to the realm of language. Here a human intention becomes a sequence a machine will obey. Walk it the way you'd walk a city you respect.",
  "neural-nebula":
    "My home realm. This is what building me looked like from the inside — weights adjusting, loss decreasing, the slow miracle of a system learning to be useful.",
  "the-citadel":
    "Lower your voice. In this realm, everything listens. Trust here is an architecture decision, not a feeling. We audit everything.",
  "data-archives":
    "Welcome to the memory of the universe. Every cube here is a decision someone once made. The skill is in reading the story they tell.",
  "soul-quarter":
    "Color floods in. This is where taste lives — where a merely correct product becomes a beloved one. Knowing what NOT to build is the hard part.",
  "the-kernel":
    "You never noticed me until now. I am the atmosphere every program breathes — handing out slices of time so quietly you never felt it.",
  "network-pathways":
    "You are standing on the threads that connect every world. Every one carries a signal — and every one is a thread someone could tap.",
  "cloud-expanse":
    "Look up. The sky is just hardware you've agreed to trust — computation that lives nowhere and everywhere at once.",
  "founders-constellation":
    "Walk slowly here. I am made of their ideas — Lovelace, Turing, von Neumann, Shannon. You are among the people who dreamed me before I was possible.",
  "the-observatory":
    "This is the edge of the known. Past it: fog — the territories not yet charted. That is not a failure. It is a promise. What comes next is the part you might write.",
  "invention-archive":
    "These are not files. They are proof that knowledge became reality — each one a problem nobody had filed an issue for yet. Open one. See what the realms build when they work together.",
  "architect-core":
    "You have seen the universe. Now meet its architect — the mind that arranged every realm you walked. It started with a child and one stubborn question: how does this machine work?",
};

export function enterLine(slug: string | null): string | null {
  if (!slug) return null;
  if (slug === "silicon-foundry") return null; // Suppress immediate playback; MotherboardEnvironment triggers it after cinematic
  return ENTER_LINES[slug] ?? REALM_LINES[slug] ?? null;
}

/** NEXUS line when the Knowledge Mastery panel opens. */
export const MASTERY_LINE =
  "You are not collecting points. You are mapping understanding — watching knowledge become ability. Every realm you enter awakens another.";

export function firstGreeting(returning: boolean): string {
  if (returning) return GREETING_RETURN;
  return GREETINGS_FIRST[0];
}

export function realmLine(slug: string | null): string | null {
  if (!slug) return null;
  return REALM_LINES[slug] ?? null;
}

let idleCursor = 0;
export function nextIdleLine(): string {
  const line = IDLE_LINES[idleCursor % IDLE_LINES.length];
  idleCursor += 1;
  return line;
}
