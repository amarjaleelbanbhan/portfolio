/**
 * Content integrity rules.
 *
 * Pure functions with no I/O so the same checks can run from the CLI script, a
 * test, or (later) a CMS save handler. No validation framework — the rules are
 * specific enough that a schema library would add a dependency without adding
 * safety.
 */
import {
  credentials,
  education,
  openSourceContributions,
  profile,
  projects,
  researchProjects,
  skills,
} from '@/content';
import {
  CONTRIBUTION_STATUSES,
  DOMAINS,
  PROJECT_STATUSES,
  PROJECT_TIERS,
  PROOF_TYPES,
  RESEARCH_STATUSES,
  SKILL_CATEGORIES,
  SOURCE_VISIBILITIES,
} from '@/content/types';

export interface ContentIssue {
  entity: string;
  id: string;
  message: string;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Statuses that imply shipped, working software. */
const IMPLEMENTATION_STATUSES = new Set(['production', 'released']);

export function validateContent(): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const add = (entity: string, id: string, message: string) =>
    issues.push({ entity, id, message });

  // ───────────────────────────── Profile ─────────────────────────────
  if (profile.title !== 'Software Engineer') {
    add('profile', 'profile', `primary title must be "Software Engineer", found "${profile.title}"`);
  }
  if (!isValidUrl(profile.siteUrl)) {
    add('profile', 'profile', `siteUrl is not a valid URL: ${profile.siteUrl}`);
  }
  for (const [key, value] of Object.entries(profile.social)) {
    if (value && !isValidUrl(value)) {
      add('profile', 'profile', `social.${key} is not a valid URL: ${value}`);
    }
  }

  // ───────────────────────────── Projects ─────────────────────────────
  const projectSlugs = new Set<string>();
  const projectIds = new Set<string>();
  const featuredRanks = new Map<number, string>();

  for (const project of projects) {
    const ref = project.slug || project.id || '(missing id)';

    if (!project.id) add('project', ref, 'missing id');
    if (!project.slug) add('project', ref, 'missing slug');
    if (project.slug && !SLUG_RE.test(project.slug)) {
      add('project', ref, `slug is not kebab-case: "${project.slug}"`);
    }
    if (project.slug && projectSlugs.has(project.slug)) {
      add('project', ref, `duplicate slug "${project.slug}"`);
    }
    projectSlugs.add(project.slug);

    if (project.id && projectIds.has(project.id)) {
      add('project', ref, `duplicate id "${project.id}"`);
    }
    projectIds.add(project.id);

    if (!PROJECT_STATUSES.includes(project.status)) {
      add('project', ref, `invalid status "${project.status}"`);
    }
    if (!PROJECT_TIERS.includes(project.tier)) {
      add('project', ref, `invalid tier "${project.tier}"`);
    }
    for (const domain of project.domains) {
      if (!DOMAINS.includes(domain)) add('project', ref, `invalid domain "${domain}"`);
    }
    if (!project.summary?.trim()) add('project', ref, 'missing summary');

    // Featured ordering must be explicit and unique.
    if (project.featured) {
      if (typeof project.featuredRank !== 'number') {
        add('project', ref, 'featured project has no featuredRank');
      } else if (featuredRanks.has(project.featuredRank)) {
        add(
          'project',
          ref,
          `duplicate featuredRank ${project.featuredRank} (also on "${featuredRanks.get(project.featuredRank)}")`
        );
      } else {
        featuredRanks.set(project.featuredRank, project.slug);
      }
    }

    // An archived project must never be promoted onto featured surfaces.
    if (project.tier === 'archive' && project.featured) {
      add('project', ref, 'archived project is marked featured');
    }
    if (project.status === 'archived' && project.featured) {
      add('project', ref, 'archived status combined with featured');
    }

    // Source visibility must match the links actually present.
    if (!SOURCE_VISIBILITIES.includes(project.source.visibility)) {
      add('project', ref, `invalid source visibility "${project.source.visibility}"`);
    }
    if (project.source.visibility === 'public') {
      if (!project.source.repositoryUrl) {
        add('project', ref, 'public source has no repositoryUrl');
      } else if (!isValidUrl(project.source.repositoryUrl)) {
        add('project', ref, `source.repositoryUrl is malformed: ${project.source.repositoryUrl}`);
      }
    } else {
      // The whole point of the private marker: no URL may leak through.
      if (project.source.repositoryUrl) {
        add(
          'project',
          ref,
          `source is "${project.source.visibility}" but carries a repositoryUrl — it would render a broken link`
        );
      }
      if (project.links.repository) {
        add(
          'project',
          ref,
          `source is "${project.source.visibility}" but links.repository is set — it would render a broken Code button`
        );
      }
    }

    for (const [key, value] of Object.entries(project.links)) {
      if (value && !isValidUrl(value)) {
        add('project', ref, `links.${key} is malformed: ${value}`);
      }
    }

    // Technologies must resolve to real skills.
    for (const tech of project.technologies) {
      if (!skills.some((s) => s.slug === tech)) {
        add('project', ref, `technology "${tech}" does not exist in the skill registry`);
      }
    }

    if (project.researchSlug && !researchProjects.some((r) => r.slug === project.researchSlug)) {
      add('project', ref, `researchSlug "${project.researchSlug}" does not exist`);
    }

    validateProof(project.proof, 'project', ref, add);
  }

  // VICE OS must not drift into looking like shipped software.
  const viceOs = projects.find((p) => p.slug === 'vice-os');
  if (viceOs) {
    if (IMPLEMENTATION_STATUSES.has(viceOs.status)) {
      add('project', 'vice-os', `status "${viceOs.status}" implies implemented software; it has none`);
    }
    if (viceOs.tier !== 'current-fyp') {
      add('project', 'vice-os', `tier must be "current-fyp", found "${viceOs.tier}"`);
    }
    if (viceOs.featured) {
      add('project', 'vice-os', 'must not be featured while at research/architecture stage');
    }
  } else {
    add('project', 'vice-os', 'VICE OS is missing from the project registry');
  }

  // Phase 1 removed this because the repository 404s.
  if (projects.some((p) => /bus[- ]?reservation/i.test(p.slug) || /bus reservation/i.test(p.title))) {
    add('project', 'bus-reservation', 'Bus Reservation System must not be restored — its repository 404s');
  }

  // ───────────────────────────── Research ─────────────────────────────
  const researchSlugs = new Set<string>();
  for (const entry of researchProjects) {
    const ref = entry.slug || entry.id;
    if (!entry.id) add('research', ref, 'missing id');
    if (!entry.slug) add('research', ref, 'missing slug');
    if (entry.slug && !SLUG_RE.test(entry.slug)) {
      add('research', ref, `slug is not kebab-case: "${entry.slug}"`);
    }
    if (researchSlugs.has(entry.slug)) add('research', ref, `duplicate slug "${entry.slug}"`);
    researchSlugs.add(entry.slug);

    if (!RESEARCH_STATUSES.includes(entry.status)) {
      add('research', ref, `invalid status "${entry.status}"`);
    }
    if (!entry.researchQuestion?.trim()) add('research', ref, 'missing researchQuestion');
    if (!entry.publicStage?.trim()) add('research', ref, 'missing publicStage');

    if (entry.projectSlug && !projectSlugs.has(entry.projectSlug)) {
      add('research', ref, `projectSlug "${entry.projectSlug}" does not exist`);
    }
    if (entry.source.visibility !== 'public' && entry.source.repositoryUrl) {
      add('research', ref, 'non-public source carries a repositoryUrl');
    }
    validateProof(entry.proof, 'research', ref, add);
  }

  // ─────────────────────────── Open source ───────────────────────────
  const contributionIds = new Set<string>();
  const prKeys = new Set<string>();

  for (const contribution of openSourceContributions) {
    const ref = contribution.id;
    if (!contribution.id) add('contribution', ref, 'missing id');
    if (contributionIds.has(contribution.id)) add('contribution', ref, `duplicate id "${contribution.id}"`);
    contributionIds.add(contribution.id);

    const prKey = `${contribution.repository}#${contribution.prNumber}`;
    if (prKeys.has(prKey)) add('contribution', ref, `duplicate pull request ${prKey}`);
    prKeys.add(prKey);

    if (!CONTRIBUTION_STATUSES.includes(contribution.status)) {
      add('contribution', ref, `invalid status "${contribution.status}"`);
    }
    if (!isValidUrl(contribution.url)) {
      add('contribution', ref, `malformed url: ${contribution.url}`);
    }
    if (!contribution.repository.includes('/')) {
      add('contribution', ref, `repository must be "owner/repo", found "${contribution.repository}"`);
    }
    // The URL must actually point at the PR it claims to be.
    if (!contribution.url.includes(`${contribution.repository}/pull/${contribution.prNumber}`)) {
      add('contribution', ref, `url does not match ${prKey}`);
    }
    if (contribution.status === 'merged' && !contribution.mergedAt) {
      add('contribution', ref, 'merged contribution has no mergedAt date');
    }
    if (contribution.status !== 'merged' && contribution.mergedAt) {
      add('contribution', ref, `status is "${contribution.status}" but mergedAt is set`);
    }
    validateProof(contribution.proof, 'contribution', ref, add);
  }

  // Guard the documented upstream mix-up from Phase 1.
  for (const contribution of openSourceContributions) {
    if (contribution.repository.endsWith('/loop-engineering') && contribution.organization !== 'cobusgreyling') {
      add(
        'contribution',
        contribution.id,
        'loop-engineering must be cobusgreyling/loop-engineering, not block/goose'
      );
    }
  }

  // ─────────────────────────────── Skills ───────────────────────────────
  const skillSlugs = new Set<string>();
  for (const skill of skills) {
    const ref = skill.slug || skill.name;
    if (!skill.slug) add('skill', ref, 'missing slug');
    if (skill.slug && !SLUG_RE.test(skill.slug)) {
      add('skill', ref, `slug is not kebab-case: "${skill.slug}"`);
    }
    if (skillSlugs.has(skill.slug)) add('skill', ref, `duplicate slug "${skill.slug}"`);
    skillSlugs.add(skill.slug);

    if (!SKILL_CATEGORIES.includes(skill.category)) {
      add('skill', ref, `invalid category "${skill.category}"`);
    }
    for (const slug of skill.projectSlugs) {
      if (!projectSlugs.has(slug)) add('skill', ref, `references nonexistent project "${slug}"`);
    }
    for (const id of skill.contributionIds) {
      if (!contributionIds.has(id)) add('skill', ref, `references nonexistent contribution "${id}"`);
    }
    for (const slug of skill.researchSlugs) {
      if (!researchSlugs.has(slug)) add('skill', ref, `references nonexistent research "${slug}"`);
    }
  }

  // ───────────────────────────── Credentials ─────────────────────────────
  const credentialIds = new Set<string>();
  for (const credential of credentials) {
    const ref = credential.id || credential.title;
    if (!credential.id) add('credential', ref, 'missing id');
    if (credentialIds.has(credential.id)) add('credential', ref, `duplicate id "${credential.id}"`);
    credentialIds.add(credential.id);

    if (!credential.title?.trim()) add('credential', ref, 'missing title');
    if (!credential.issuer?.trim()) add('credential', ref, 'missing issuer');
    if (!credential.issuedAt?.trim()) add('credential', ref, 'missing issuedAt');
    if (!isValidUrl(credential.credentialUrl)) {
      add('credential', ref, `malformed credentialUrl: ${credential.credentialUrl}`);
    }
  }

  // ───────────────────────────── Education ─────────────────────────────
  const educationIds = new Set<string>();
  for (const entry of education) {
    const ref = entry.id || entry.school;
    if (!entry.id) add('education', ref, 'missing id');
    if (educationIds.has(entry.id)) add('education', ref, `duplicate id "${entry.id}"`);
    educationIds.add(entry.id);
  }

  return issues;
}

function validateProof(
  proof: { id: string; type: string; sourceUrl?: string; verified: boolean; label: string }[],
  entity: string,
  ref: string,
  add: (entity: string, id: string, message: string) => void
): void {
  const seen = new Set<string>();
  for (const item of proof) {
    if (!item.id) add(entity, ref, 'proof entry missing id');
    if (seen.has(item.id)) add(entity, ref, `duplicate proof id "${item.id}"`);
    seen.add(item.id);

    if (!PROOF_TYPES.includes(item.type as (typeof PROOF_TYPES)[number])) {
      add(entity, ref, `proof "${item.id}" has invalid type "${item.type}"`);
    }
    if (!item.label?.trim()) add(entity, ref, `proof "${item.id}" has no label`);

    // Unverified proof must never reach a public surface.
    if (!item.verified) {
      add(entity, ref, `proof "${item.id}" is not verified and must not be published`);
    }
    if (item.sourceUrl && !isValidUrl(item.sourceUrl)) {
      add(entity, ref, `proof "${item.id}" has a malformed sourceUrl: ${item.sourceUrl}`);
    }
  }
}
