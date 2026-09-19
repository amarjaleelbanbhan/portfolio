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
export { coreDomains } from './domains';
export type { DomainMeta } from './domains';
export { projects } from './projects';
export { researchProjects } from './research';
export { openSourceContributions } from './open-source';
export { skills } from './skills';
export { credentials } from './credentials';
export { education } from './education';
