/**
 * Canonical content models.
 *
 * These types are the contract between content and UI. The content files next to
 * this one are the current *implementation* of that contract; a Supabase-backed
 * loader can replace them later without any UI component changing, as long as it
 * returns these same shapes.
 *
 * Deliberately no `enum` — union types from `as const` arrays keep these files
 * runnable by Node's type-stripping loader, which is what the content validation
 * script uses.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Enumerations
// ─────────────────────────────────────────────────────────────────────────────

/** Where a project actually is, not where it is heading. */
export const PROJECT_STATUSES = [
  'production',
  'released',
  'active-development',
  'research',
  'prototype',
  'pre-alpha',
  'completed',
  'archived',
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Portfolio importance. Deliberately independent of status. */
export const PROJECT_TIERS = ['flagship', 'secondary', 'current-fyp', 'archive'] as const;
export type ProjectTier = (typeof PROJECT_TIERS)[number];

/** Engineering domain, used for grouping and (later) accent colour. */
export const DOMAINS = ['product', 'ai', 'security', 'systems', 'open-source', 'research'] as const;
export type Domain = (typeof DOMAINS)[number];

export const SOURCE_VISIBILITIES = ['public', 'private', 'unavailable'] as const;
export type SourceVisibility = (typeof SOURCE_VISIBILITIES)[number];

export const PROOF_TYPES = [
  'test-suite',
  'production-release',
  'benchmark',
  'merged-pr',
  'package-release',
  'deployment',
  'research-result',
  'ci',
  'demo',
  'user-evidence',
] as const;
export type ProofType = (typeof PROOF_TYPES)[number];

export const CONTRIBUTION_STATUSES = ['merged', 'open', 'closed'] as const;
export type ContributionStatus = (typeof CONTRIBUTION_STATUSES)[number];

export const SKILL_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend',
  'AI',
  'Security',
  'Mobile',
  'Systems',
  'Research',
  'Infrastructure',
  'Developer Tools',
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const RESEARCH_STATUSES = ['active', 'complete', 'architecture-stage', 'paused'] as const;
export type ResearchStatus = (typeof RESEARCH_STATUSES)[number];

// ─────────────────────────────────────────────────────────────────────────────
// Shared shapes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evidence for a claim. Anything shown publicly must be `verified: true`, which
 * means it was checked against a primary source (an API, a registry, a release,
 * a repository) — not that it sounds plausible.
 *
 * `sourceUrl` is optional on purpose: private work can still have honest proof.
 * Never invent a URL to fill this in.
 */
export interface Proof {
  id: string;
  type: ProofType;
  label: string;
  value?: string;
  description?: string;
  sourceUrl?: string;
  verified: boolean;
  /** ISO date the evidence was last confirmed. */
  asOf?: string;
}

/**
 * Where the source lives. `private` and `unavailable` must not carry a
 * repositoryUrl — the UI renders an honest marker instead of a button that 404s.
 */
export interface ProjectSource {
  visibility: SourceVisibility;
  repositoryUrl?: string;
  /** Shown instead of a link when there is nothing to link to. */
  label?: string;
}

/** Explicit, optional links. The UI renders only what exists. */
export interface ProjectLinks {
  repository?: string;
  demo?: string;
  package?: string;
  documentation?: string;
  report?: string;
  release?: string;
  privacyPolicy?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'diagram';
  src: string;
  alt: string;
  caption?: string;
}

export interface SeoFields {
  title?: string;
  description?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Project
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────── Case-study depth ───────────────────────────
//
// Everything below is optional and exists only for projects that have a full
// case study. Phase 2 deliberately left the depth fields empty rather than
// inventing prose; these types give the later phases somewhere structured to
// put real evidence when it has actually been reviewed.
//
// The rule every consumer follows: a section renders only when its field is
// present. An absent field means "not written yet", never "nothing to say", and
// it must never surface as an empty heading.

/** A node in a sanitized architecture diagram. */
export interface ArchitectureNode {
  id: string;
  label: string;
  /** Rough role, used to pick the node's shape. */
  kind: 'client' | 'service' | 'data' | 'external' | 'process';
  /** One line explaining what it does. */
  detail?: string;
}

/** A directed relationship between two architecture nodes. */
export interface ArchitectureFlow {
  from: string;
  to: string;
  label?: string;
}

/**
 * A sanitized architecture description.
 *
 * `caveat` is required: these diagrams describe implemented components, but they
 * are drawings, and private client systems must be labelled as sanitized.
 */
export interface ArchitectureSpec {
  summary: string;
  nodes: ArchitectureNode[];
  flows: ArchitectureFlow[];
  caveat: string;
}

/** An engineering decision worth explaining, with what it cost. */
export interface TechnicalDecision {
  id: string;
  title: string;
  /** What was decided. */
  decision: string;
  /** Why. */
  rationale: string;
  /** What it gave up. Optional, but a decision without one is usually unexamined. */
  tradeoff?: string;
}

/** A named concern and how it was handled. */
export interface ConcernNote {
  id: string;
  title: string;
  detail: string;
}

/** One verification activity and whether it is evidenced. */
export interface VerificationItem {
  id: string;
  label: string;
  detail: string;
  /** False means "implemented but not independently evidenced here". */
  verified: boolean;
}

/** A dated or ordered milestone. */
export interface TimelineEntry {
  id: string;
  label: string;
  detail: string;
  /** ISO date, when one is known. */
  date?: string;
}

/**
 * A factorial experiment grid.
 *
 * Exists because a research case study's central artifact is its design, and a
 * design is a structure rather than prose. Rows and columns are the experiment's
 * own factor levels; `cells` carries measured values keyed `row|col`.
 *
 * `cells` is optional on purpose. A design is worth showing even when results
 * are not publishable, and a grid with no numbers still communicates what was
 * crossed with what. Filling empty cells with estimates is the failure this
 * shape is built to make unnecessary.
 */
export interface ExperimentAxis {
  id: string;
  label: string;
  /** What this level means, shown on inspection. */
  detail: string;
}

export interface ExperimentCell {
  /** `${rowId}|${colId}`. Validated to reference real axis levels. */
  key: string;
  value: number;
  /** Set when this cell is the row's best, for emphasis. */
  best?: boolean;
  /** A short note attached to the cell, e.g. a correction pointer. */
  note?: string;
}

export interface ExperimentGrid {
  title: string;
  /** What the numbers are, e.g. "token F1 against the gold answer". */
  measure: string;
  rowsLabel: string;
  colsLabel: string;
  rows: ExperimentAxis[];
  cols: ExperimentAxis[];
  /** Absent when results are not cleared for publication. */
  cells?: ExperimentCell[];
  /** Run provenance: n, date, counts. Never invented. */
  provenance?: string;
  caveat: string;
}

/** A finding with the claim it supports kept separate from the number. */
export interface ResearchFinding {
  id: string;
  label: string;
  /** The measured value, as written in the source. */
  value?: string;
  /** What the number does and does not license. */
  interpretation: string;
  /** Set when a later correction changes how this should be read. */
  corrected?: boolean;
}

export interface CaseStudy {
  /** The situation the work happened in. */
  context?: string;
  /** Real constraints that shaped the design. */
  constraints?: string[];
  /** What was actually built, in prose. */
  built?: string;
  architecture?: ArchitectureSpec;
  decisions?: TechnicalDecision[];
  /** Security and reliability concerns and their handling. */
  concerns?: ConcernNote[];
  verification?: VerificationItem[];
  /** Outcomes that can be stated honestly. Never invented metrics. */
  results?: string[];
  timeline?: TimelineEntry[];
  /** What a reader should know is deliberately not shown. */
  disclosure?: string;

  /** Factorial design and, where cleared for publication, its measured cells. */
  experiment?: ExperimentGrid;
  /** Findings, each pairing a number with what it licenses. */
  findings?: ResearchFinding[];
  /** A published correction to an earlier interpretation. */
  correction?: { date: string; title: string; detail: string; status: string };
}

export interface Project {
  id: string;
  /** Stable identity. Never derive identity from `title`. */
  slug: string;
  title: string;
  shortTitle?: string;

  /** One line, used on cards. */
  summary: string;
  /** Longer prose, used on a detail page. Optional until case studies exist. */
  description?: string;

  tier: ProjectTier;
  status: ProjectStatus;
  domains: Domain[];

  featured: boolean;
  /** Explicit ordering for featured work. Unique across featured projects. */
  featuredRank?: number;
  /** Ordering within a tier. */
  sortOrder: number;

  startedAt?: string;
  updatedAt?: string;

  role?: string;
  problem?: string;
  solution?: string;

  architecture?: string;
  technicalDepth?: string;
  verification?: string;
  /** Honest constraints. Populated where the project states them. */
  limitations?: string[];

  /** Skill slugs. Validated against the skill registry. */
  technologies: string[];
  /** Free-text display tags shown on the card. */
  tags: string[];

  links: ProjectLinks;
  source: ProjectSource;

  proof: Proof[];
  metrics?: { label: string; value: string; verified: boolean }[];
  media?: MediaItem[];

  /** Short caveat rendered under the card summary. */
  note?: string;

  /** Related research entry, by slug. Avoids duplicating research prose here. */
  researchSlug?: string;

  /**
   * Full case-study material. Present only for projects whose evidence has
   * actually been reviewed; its absence is why /work/[slug] renders nothing for
   * most projects rather than rendering empty sections.
   */
  caseStudy?: CaseStudy;


  seo?: SeoFields;
}

// ─────────────────────────────────────────────────────────────────────────────
// Research
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Research is modelled separately from products on purpose: a study has a
 * question and a result, not a release and users.
 */
export interface ResearchProject {
  id: string;
  slug: string;
  title: string;
  status: ResearchStatus;
  /** How this is described publicly. Keeps stage language in one place. */
  publicStage: string;

  researchQuestion: string;
  hypothesis?: string;
  method?: string;
  dataset?: string;
  experimentDesign?: string;
  results?: string;
  limitations?: string[];
  corrections?: string[];
  futureWork?: string[];

  source: ProjectSource;
  links?: ProjectLinks;
  proof: Proof[];

  /** The product-side entry this research belongs to, if any. */
  projectSlug?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Open source
// ─────────────────────────────────────────────────────────────────────────────

export interface OpenSourceContribution {
  id: string;
  /** `owner/repo`. */
  repository: string;
  organization: string;
  prNumber: number;
  url: string;
  title: string;
  summary?: string;
  status: ContributionStatus;
  /** ISO date merged, when merged. */
  mergedAt?: string;
  /** ISO date opened. */
  openedAt?: string;
  languages: string[];
  areas: string[];
  proof: Proof[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Skills
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A technology plus the evidence that it was actually used. No proficiency
 * scores — Phase 1 removed those because they were self-assigned and measured
 * nothing.
 */
export interface Skill {
  slug: string;
  name: string;
  category: SkillCategory;
  /** Short label for constrained surfaces (physics pills, chips). */
  shortName?: string;
  color?: string;

  /** Evidence links. All validated to point at entities that exist. */
  projectSlugs: string[];
  contributionIds: string[];
  researchSlugs: string[];

  featured: boolean;
  sortOrder?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Credentials, education, profile
// ─────────────────────────────────────────────────────────────────────────────

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  /** Display string as issued, e.g. "Aug 2025". */
  issuedAt: string;
  credentialUrl: string;
  category: string;
  description?: string;
  featured: boolean;
  color?: string;
  icon?: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  period: string;
  description?: string;
  grade?: string;
  icon?: string;
}

export interface Profile {
  name: string;
  /** Primary professional title. */
  title: string;
  /** One-line positioning. */
  headline: string;
  /** Short domain summary for compact surfaces. */
  tagline: string;

  university: string;
  degree: string;
  educationPeriod: string;
  location: string;

  email: string;
  phone?: string;
  whatsapp?: string;

  siteUrl: string;
  resumeUrl: string;

  social: {
    github: string;
    linkedin: string;
    twitter?: string;
    instagram?: string;
  };
}
