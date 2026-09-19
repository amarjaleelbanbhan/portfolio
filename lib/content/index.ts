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
  ContributionDiff,
  ContributionFile,
  ContributionStatus,
  Credential,
  Domain,
  EducationEntry,
  MediaItem,
  OpenSourceContribution,
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
  PROJECT_STATUSES,
  PROJECT_TIERS,
  PROOF_TYPES,
  SKILL_CATEGORIES,
} from '@/content/types';
