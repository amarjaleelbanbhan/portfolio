/**
 * Raw canonical content.
 *
 * UI code should NOT import from here — import from `@/lib/content`, which
 * exposes the selector API. This barrel exists so the selector layer (and the
 * validation script) have a single place to load content from, and so swapping
 * the static files for a Supabase-backed loader later touches one file.
 */
export * from './types';

export { profile } from './profile';
export {
  aboutIntro,
  engineeringPrinciples,
  featuredDecisions,
  opportunities,
  resumeSummary,
} from './about';
export type {
  AboutIntro,
  EngineeringPrinciple,
  FeaturedDecision,
  Opportunity,
} from './about';
export { contactCategories } from './contact';
export type { ContactCategory } from './contact';
export { coreDomains } from './domains';
export type { DomainMeta } from './domains';
export { storyStages } from './story';
export type { StoryStage, StoryStep } from './story';
export { projects } from './projects';
export { researchProjects, researchCategories } from './research';
export type { ResearchCategoryMeta } from './research';
export { openSourceContributions } from './open-source';
export { skills } from './skills';
export { credentials } from './credentials';
export { education } from './education';
