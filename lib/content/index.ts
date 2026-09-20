/**
 * The content API.
 *
 * This is the ONLY content entry point UI code should import from:
 *
 *     UI  →  lib/content  →  content/*.ts
 *
 * Later that becomes:
 *
 *     UI  →  lib/content  →  Supabase
 *
 * Keeping every component on this side of the boundary is what makes that swap
 * a change to one layer rather than a rewrite of every card and page.
 */
export * from './selectors';
export { validateContent } from './validation';
export type { ContentIssue } from './validation';

// Types are re-exported so components can be typed without reaching past the
// boundary into the content implementation.
export type {
  CapabilityLadder,
  CaseStudy,
  ContributionDiff,
  ContributionFile,
  ContributionStatus,
  Credential,
  Domain,
  EducationEntry,
  EvidenceState,
  ExperimentGrid,
  MediaItem,
  OpenSourceContribution,
  ResearchCategory,
  ResearchFinding,
  Profile,
  Project,
  ProjectLinks,
  ProjectSource,
  ProjectStatus,
  ProjectTier,
  Proof,
  ProofType,
  ResearchProject,
  Skill,
  SkillCategory,
  SourceVisibility,
} from '@/content/types';

export {
  DOMAINS,
  EVIDENCE_STATES,
  PROJECT_STATUSES,
  PROJECT_TIERS,
  PROOF_TYPES,
  RESEARCH_CATEGORIES,
  SKILL_CATEGORIES,
} from '@/content/types';

export type { ResearchCategoryMeta } from '@/content/research';
