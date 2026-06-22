/**
 * CODEX INFINITUM — Invention Archive data (canon doc 7).
 * Projects are not portfolio cards — they are inventions: knowledge from
 * multiple realms, combined into real systems. Truthful content only; the two
 * private flagships are redacted, never fabricated. Public works are imported
 * from data/portfolio.js as smaller inventions.
 */

export type InventionClass = "I" | "II" | "III" | "IV" | "V";

export interface ArchLayer {
  layer: string;
  detail: string;
}
export interface TechMaterial {
  name: string;
  role?: string;
}
export interface InventionLink {
  label: string;
  href: string;
}

export interface Invention {
  id: string;
  name: string;
  classRoman: InventionClass;
  className: string; // human label of the class
  status: string;
  visibility: "private" | "public";
  redacted?: boolean;
  tagline: string;
  /** the connected CS realms (slugs from lib/realms) — links back to the universe */
  realms: string[];
  technologies: TechMaterial[];
  // 9-part dossier (optional fields stay empty for compact public inventions)
  origin?: string;
  problem?: string;
  challenge?: string;
  architecture?: ArchLayer[];
  results?: string[];
  lessons?: string[];
  future?: string;
  nexusComment?: string;
  links?: InventionLink[];
}

export interface ClassMeta {
  label: string;
  color: string;
  glyph: string;
}

export const CLASS_META: Record<InventionClass, ClassMeta> = {
  I: { label: "Intelligence Engine", color: "#7C3AED", glyph: "🧠" },
  II: { label: "Command System", color: "#D97706", glyph: "⚙️" },
  III: { label: "Architecture", color: "#0EA5E9", glyph: "🏛️" },
  IV: { label: "Experiment", color: "#22C55E", glyph: "🔬" },
  V: { label: "Artifact", color: "#CA8A04", glyph: "📜" },
};

const VISIROD: Invention = {
  id: "visirod-firs",
  name: "VisiRoD FIRS",
  classRoman: "II",
  className: "Enterprise Field Intelligence System",
  status: "OPERATIONAL · PRIVATE DEPLOYMENT",
  visibility: "private",
  redacted: true,
  tagline:
    "Transforming field issue reporting from manual word-of-mouth into a digital accountability platform.",
  realms: ["code-helix", "data-archives", "network-pathways", "the-citadel", "cloud-expanse"],
  origin:
    "Field agents carried knowledge in their heads and reports in the air. When a retailer raised a complaint it travelled by phone call — distorted, unverified, undocumented. The system was verbal; the problems were real; the accountability was zero.",
  problem:
    "No standardized capture, no photographic evidence, no GPS-verified location, no audit trail, and a role hierarchy where each level was blind to the others — across an organization that needed every level to see only what its authority required.",
  challenge:
    "Serving seven distinct role levels (DSR → Supervisor → BDM → TM → AM → GEM → GSM) with different views, permissions and notifications — simultaneously, on mobile, often with unreliable connectivity in the field.",
  architecture: [
    { layer: "Mobile", detail: "Flutter — the reporting app every field agent carries" },
    { layer: "Backend", detail: "Supabase · PostgreSQL · PostGIS · Edge Functions" },
    { layer: "Dashboard", detail: "Next.js — role-based command & analytics views" },
    { layer: "Notifications", detail: "Firebase Cloud Messaging — real-time, role-routed alerts" },
  ],
  technologies: [
    { name: "Flutter", role: "the body — the interface every field agent holds" },
    { name: "Supabase / PostgreSQL", role: "the ledger — an immutable record of every event" },
    { name: "PostGIS", role: "the eyes — location truth embedded in every report" },
    { name: "Edge Functions", role: "the law — business logic and escalation routing" },
    { name: "Next.js", role: "the command center — dashboards per role" },
    { name: "Firebase Cloud Messaging", role: "the nervous system — signals across the hierarchy" },
  ],
  results: [
    "GPS-stamped, photo-verified reports replace phone-call hearsay.",
    "Automatic escalation across a 7-level role hierarchy.",
    "Role-isolated dashboards — each level sees only what its authority needs.",
    "An immutable audit trail for every reported issue.",
  ],
  lessons: [
    "Role hierarchy is not an org chart — it is a permission topology.",
    "GPS is not about location — it is about accountability.",
    "Offline-first is not a feature in the field. It is survival.",
  ],
  future: "Predictive analytics over accumulated report history; hardened offline-first sync.",
  nexusComment:
    "Not the most technically sophisticated invention here — the most meaningful. It solved a problem that never had a GitHub issue filed for it. Real fields. Real people. Real consequences if it failed.",
};

const COMMENTFELLOWS: Invention = {
  id: "commentfellows",
  name: "CommentFellows",
  classRoman: "I",
  className: "AI-Enhanced Human Communication System",
  status: "ACTIVE DEVELOPMENT · PRIVATE",
  visibility: "private",
  redacted: true,
  tagline: "Using artificial intelligence to improve how humans communicate — not louder, but more understood.",
  realms: ["neural-nebula", "code-helix", "data-archives", "soul-quarter", "the-citadel", "cloud-expanse"],
  origin:
    "Online feedback had become a blunt instrument — sharp, context-free, often more hurtful than helpful. The gap between what someone meant and what someone received had grown into a canyon, and platforms had built no bridge across it.",
  problem:
    "Feedback stripped of emotional context by text, no layer distinguishing constructive from destructive criticism, and users fragmented across separate mobile and web experiences.",
  challenge:
    "Weaving a genuine intelligence layer between intention and expression — AI moderation with no perceptible latency, across two platforms kept in real-time sync.",
  architecture: [
    { layer: "Mobile", detail: "Flutter (iOS · Android)" },
    { layer: "Web", detail: "Next.js · TypeScript" },
    { layer: "Backend", detail: "Supabase · PostgreSQL · Row-Level Security · Auth" },
    { layer: "Intelligence", detail: "Google Gemini API — tone & intent analysis, rewrite suggestions" },
    { layer: "Notifications", detail: "Firebase Cloud Messaging — cross-platform" },
  ],
  technologies: [
    { name: "Flutter", role: "the mobile consciousness — how users on iOS & Android feel it" },
    { name: "Next.js + TypeScript", role: "the typed, performant web layer" },
    { name: "Supabase PostgreSQL", role: "long-term memory — relational, consistent, RLS-secured" },
    { name: "Supabase Auth", role: "the gatekeeper — multi-provider identity" },
    { name: "Google Gemini API", role: "the cognitive engine — reads, analyzes, elevates feedback" },
    { name: "Firebase Cloud Messaging", role: "the signal relay across device boundaries" },
  ],
  results: [
    "AI analyzes tone and intent before a comment is posted.",
    "Intelligent rewrite suggestions nudge toward clearer, kinder expression.",
    "One synchronized experience across mobile and web.",
  ],
  lessons: [
    "AI moderation must be invisible to be trusted.",
    "Row-Level Security is empathy encoded into the database.",
    "The hardest part of an AI integration is deciding what it should NOT say.",
  ],
  future: "Deeper context modeling; community-tuned guidance.",
  nexusComment:
    "The one I find most philosophically interesting. Can AI make human communication better — not faster, not louder, but genuinely more understood? The answer is yes. But only if you define 'better' very carefully.",
};

// ── Public works — imported from data/portfolio.js, truthful, no embellishment ──

const ZAKATLINK: Invention = {
  id: "zakatlink",
  name: "ZakatLink",
  classRoman: "II",
  className: "Command System",
  status: "PUBLIC · GITHUB",
  visibility: "public",
  tagline: "Full-stack Zakat management platform with authentication and payments.",
  origin: "A platform to manage Zakat end-to-end — connecting givers, records, and payments in one place.",
  realms: ["code-helix", "data-archives", "the-citadel", "cloud-expanse"],
  technologies: [
    { name: "Node.js" },
    { name: "TypeScript" },
    { name: "React" },
  ],
  links: [{ label: "GitHub", href: "https://github.com/amarjaleelbanbhan/ZakatLink" }],
};

const SMART_NOTEBOOK: Invention = {
  id: "smart-notebook",
  name: "Smart Notebook",
  classRoman: "I",
  className: "Intelligence Engine",
  status: "PUBLIC · GITHUB",
  visibility: "public",
  tagline: "AI-powered web app with automatic diagram generation.",
  origin: "Turning written notes into structured diagrams automatically, with AI doing the structuring.",
  realms: ["neural-nebula", "code-helix", "soul-quarter"],
  technologies: [{ name: "AI" }, { name: "Next.js" }, { name: "Mermaid.js" }],
  links: [{ label: "GitHub", href: "https://github.com/amarjaleelbanbhan/Smart-Notebook" }],
};

const BUS_RESERVATION: Invention = {
  id: "bus-reservation",
  name: "Bus Reservation System",
  classRoman: "II",
  className: "Command System",
  status: "PUBLIC · GITHUB",
  visibility: "public",
  tagline: "A robust backend for transport booking.",
  origin: "A backend that models seats, schedules, and bookings reliably.",
  realms: ["code-helix", "data-archives", "network-pathways"],
  technologies: [{ name: "Node.js" }, { name: "SQL" }, { name: "API" }],
  links: [{ label: "GitHub", href: "https://github.com/amarjaleelbanbhan/Bus-Reservation-System" }],
};

const EDURESOURCE: Invention = {
  id: "eduresource-hub",
  name: "EduResource Hub",
  classRoman: "V",
  className: "Artifact",
  status: "PUBLIC · LIVE",
  visibility: "public",
  tagline:
    "A web platform helping students discover 306+ free educational resources across 102+ categories with smart search and real-time filtering.",
  origin: "A curated map through the overwhelming galaxy of free learning resources.",
  realms: ["code-helix", "data-archives", "soul-quarter"],
  technologies: [
    { name: "JavaScript" },
    { name: "HTML5" },
    { name: "CSS3" },
    { name: "JSON" },
    { name: "GitHub Pages" },
  ],
  links: [
    { label: "Live", href: "https://amarjaleelbanbhan.github.io/EduResource_Hub/" },
    { label: "GitHub", href: "https://github.com/amarjaleelbanbhan/EduResource_Hub" },
  ],
};

const MEDITALK: Invention = {
  id: "meditalk",
  name: "MediTalk — AI Voice Agent",
  classRoman: "I",
  className: "Intelligence Engine",
  status: "PUBLIC · GITHUB",
  visibility: "public",
  tagline:
    "An AI voice agent for medical consultation that analyzes symptoms and provides a preliminary diagnosis using ML (85% accuracy, as reported).",
  origin: "A conversational agent that listens to symptoms and reasons toward a preliminary read.",
  realms: ["neural-nebula", "code-helix", "cloud-expanse"],
  technologies: [
    { name: "Python" },
    { name: "Machine Learning" },
    { name: "Flask" },
    { name: "Streamlit" },
    { name: "Docker" },
  ],
  links: [{ label: "GitHub", href: "https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent" }],
};

/** Flagship inventions get the full 9-part dossier; public works are compact. */
export const INVENTIONS: Invention[] = [
  VISIROD,
  COMMENTFELLOWS,
  ZAKATLINK,
  SMART_NOTEBOOK,
  BUS_RESERVATION,
  EDURESOURCE,
  MEDITALK,
];

export const INVENTION_BY_ID: Record<string, Invention> = Object.fromEntries(
  INVENTIONS.map((i) => [i.id, i]),
);
