/**
 * Derived queries over canonical content.
 *
 * Every filter/sort rule lives here exactly once, so no component re-implements
 * "what is featured" or "what counts as merged". When content moves to Supabase,
 * these function signatures stay and only their bodies change.
 */
import {
  coreDomains,
  credentials,
  storyStages,
  education,
  openSourceContributions,
  profile,
  projects,
  researchProjects,
  skills,
} from '@/content';
import { SKILL_CATEGORIES } from '@/content/types';
import type {
  Credential,
  Domain,
  EducationEntry,
  OpenSourceContribution,
  Profile,
  Project,
  ProjectStatus,
  Proof,
  ProjectTier,
  ResearchProject,
  Skill,
  SkillCategory,
} from '@/content/types';
import type { DomainMeta } from '@/content/domains';
import type { StoryStage } from '@/content/story';

// ─────────────────────────────── Profile ───────────────────────────────

export function getProfile(): Profile {
  return profile;
}

export function getEducation(): EducationEntry[] {
  return education;
}

/**
 * Social links that actually exist, in display order. Callers render whatever
 * comes back rather than assuming a fixed set, so removing a dead account is a
 * content edit and not a UI change.
 */
export function getSocialLinks(): { key: string; label: string; url: string }[] {
  const order: { key: keyof Profile['social']; label: string }[] = [
    { key: 'github', label: 'GitHub' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'instagram', label: 'Instagram' },
  ];
  return order
    .filter(({ key }) => Boolean(profile.social[key]))
    .map(({ key, label }) => ({ key, label, url: profile.social[key] as string }));
}

// ─────────────────────────────── Projects ───────────────────────────────

const bySortOrder = (a: Project, b: Project) => a.sortOrder - b.sortOrder;

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectsByTier(tier: ProjectTier): Project[] {
  return projects.filter((p) => p.tier === tier).sort(bySortOrder);
}

export function getFlagshipProjects(): Project[] {
  return getProjectsByTier('flagship');
}

export function getSecondaryProjects(): Project[] {
  return getProjectsByTier('secondary');
}

export function getCurrentFypProjects(): Project[] {
  return getProjectsByTier('current-fyp');
}

export function getArchivedProjects(): Project[] {
  return getProjectsByTier('archive');
}

/**
 * Featured work in intentional order. Ordering comes from `featuredRank`, never
 * from array position — that was the bug behind the old `.slice(0, 3)`.
 */
export function getFeaturedProjects(limit?: number): Project[] {
  const featured = projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredRank ?? Number.MAX_SAFE_INTEGER) - (b.featuredRank ?? Number.MAX_SAFE_INTEGER));
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByStatus(status: ProjectStatus): Project[] {
  return projects.filter((p) => p.status === status);
}

/** Projects whose source cannot be linked. Used to render an honest marker. */
export function getPrivateProjects(): Project[] {
  return projects.filter((p) => p.source.visibility !== 'public');
}

// ─────────────────────────────── Research ───────────────────────────────

export function getAllResearch(): ResearchProject[] {
  return researchProjects;
}

export function getResearchBySlug(slug: string): ResearchProject | undefined {
  return researchProjects.find((r) => r.slug === slug);
}

export function getResearchForProject(projectSlug: string): ResearchProject | undefined {
  return researchProjects.find((r) => r.projectSlug === projectSlug);
}

// ───────────────────────────── Open source ─────────────────────────────

export function getAllContributions(): OpenSourceContribution[] {
  return openSourceContributions;
}

export function getMergedContributions(): OpenSourceContribution[] {
  return openSourceContributions.filter((c) => c.status === 'merged');
}

export function getOpenContributions(): OpenSourceContribution[] {
  return openSourceContributions.filter((c) => c.status === 'open');
}

export function getContributionById(id: string): OpenSourceContribution | undefined {
  return openSourceContributions.find((c) => c.id === id);
}

/** Merged first, then open; newest merge first within each group. */
export function getContributionsForDisplay(): OpenSourceContribution[] {
  return [...openSourceContributions].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'merged' ? -1 : 1;
    return (b.mergedAt ?? '').localeCompare(a.mergedAt ?? '');
  });
}

// ─────────────────────────────── Skills ───────────────────────────────

const bySkillOrder = (a: Skill, b: Skill) =>
  (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER);

export function getAllSkills(): Skill[] {
  return skills;
}

export function getFeaturedSkills(): Skill[] {
  return skills.filter((s) => s.featured).sort(bySkillOrder);
}

export function getSkillsByCategory(category: SkillCategory): Skill[] {
  return skills.filter((s) => s.category === category).sort(bySkillOrder);
}

export function getSkillBySlug(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug);
}

/**
 * Featured skills grouped by category, in the given category order. Categories
 * with no featured skills are omitted so callers never render an empty column.
 */
export function getFeaturedSkillsGrouped(
  categories: SkillCategory[]
): { category: SkillCategory; skills: Skill[] }[] {
  return categories
    .map((category) => ({
      category,
      skills: getSkillsByCategory(category).filter((s) => s.featured),
    }))
    .filter((group) => group.skills.length > 0);
}

/**
 * One representative featured skill per category, for surfaces that can only
 * carry a handful of labels (the Matter.js physics canvas).
 *
 * The rule is explicit — highest-ranked featured skill in each category — so the
 * set is never "whatever the first N entries of the array happen to be". Adding
 * a skill to an existing category cannot silently change what renders; only
 * promoting it above its siblings can.
 */
export function getRepresentativeSkills(): Skill[] {
  return getFeaturedSkillsGrouped([...SKILL_CATEGORIES]).map(
    (group) => group.skills[0]
  );
}

/** What a skill was actually used in, resolved to display names. */
export function getSkillEvidence(slug: string): {
  projects: string[];
  contributions: string[];
  research: string[];
} {
  const skill = getSkillBySlug(slug);
  if (!skill) return { projects: [], contributions: [], research: [] };

  return {
    projects: skill.projectSlugs
      .map((s) => getProjectBySlug(s))
      .filter((p): p is Project => Boolean(p))
      .map((p) => p.shortTitle ?? p.title),
    contributions: skill.contributionIds
      .map((id) => getContributionById(id))
      .filter((c): c is OpenSourceContribution => Boolean(c))
      .map((c) => c.repository.split('/')[1]),
    research: skill.researchSlugs
      .map((s) => getResearchBySlug(s))
      .filter((r): r is ResearchProject => Boolean(r))
      .map((r) => r.slug),
  };
}

/**
 * Flat evidence labels for a skill, for compact single-line rendering.
 * De-duplicated: two contributions to the same repository are one piece of
 * evidence to a reader, not two.
 */
export function getSkillEvidenceLabels(slug: string): string[] {
  const evidence = getSkillEvidence(slug);
  return [...new Set([...evidence.projects, ...evidence.contributions])];
}

// ───────────────────────────── Credentials ─────────────────────────────

export function getAllCredentials(): Credential[] {
  return credentials;
}

export function getFeaturedCredentials(): Credential[] {
  return credentials.filter((c) => c.featured);
}

export function getCredentialCount(): number {
  return credentials.length;
}

// ─────────────────────── Derived evidence numbers ───────────────────────

/**
 * Headline numbers, derived rather than typed by hand. Phase 1 removed
 * "500+ commits" and "10+ projects" precisely because hand-typed counts drift
 * away from the content they claim to describe.
 */
export interface EvidenceStat {
  key: string;
  label: string;
  value: number;
}

export function getEvidenceStats(): EvidenceStat[] {
  return [
    {
      key: 'merged-prs',
      label: 'Merged Upstream PRs',
      value: getMergedContributions().length,
    },
    {
      key: 'published-packages',
      label: 'Published npm Package',
      value: projects.filter((p) => Boolean(p.links.package)).length,
    },
    {
      key: 'credentials',
      label: 'Verified Credentials',
      value: getCredentialCount(),
    },
  ];
}

export function getMergedContributionCount(): number {
  return getMergedContributions().length;
}

export function getFlagshipCount(): number {
  return getFlagshipProjects().length;
}

export function getPublishedPackageCount(): number {
  return projects.filter((p) => Boolean(p.links.package)).length;
}

export function getProductionSystemCount(): number {
  return getProjectsByStatus('production').length;
}

// ─────────────────────────── Engineering domains ───────────────────────────

const DOMAIN_COLORS: Record<Domain, string> = {
  product: '#14b8a6',
  ai: '#8b5cf6',
  security: '#f59e0b',
  systems: '#38bdf8',
  research: '#a855f7',
  'open-source': '#22c55e',
};

/** Domain accent, matching --domain-* in styles/tokens.css. */
export function getDomainColor(domain: Domain): string {
  return DOMAIN_COLORS[domain];
}

/**
 * Projects in a domain, strongest first, excluding the archive.
 *
 * The homepage core represents current work; a retired 2023 project should not
 * pull weight in a domain's technology list.
 */
export function getProjectsByDomain(domain: Domain): Project[] {
  const rank: Record<string, number> = {
    flagship: 0,
    'current-fyp': 1,
    secondary: 2,
    archive: 3,
  };
  return projects
    .filter((p) => p.domains?.includes(domain) && p.tier !== 'archive')
    .sort(
      (a, b) =>
        (rank[a.tier] ?? 9) - (rank[b.tier] ?? 9) ||
        (a.featuredRank ?? 99) - (b.featuredRank ?? 99) ||
        (a.sortOrder ?? 99) - (b.sortOrder ?? 99)
    );
}

export interface DomainTechnology {
  key: string;
  label: string;
  color: string;
}

/**
 * The technologies shown for a domain.
 *
 * Ordering is curated in content/domains.ts rather than derived. Deriving it was
 * tried and produced misleading lists: ranking by how exclusive a technology is
 * to a domain surfaced one-off tech (Product opened with "WebGL, FFmpeg,
 * Headless") and buried the stack the domain is actually built on. Ranking by
 * frequency instead surfaced Node.js everywhere and said nothing.
 *
 * Curation is safe here because validation enforces the facts: every slug must
 * exist in the skill registry AND be used by a non-archive project in that
 * domain. So the list can be ordered for a reader, but it cannot claim a
 * technology that is not genuinely part of that work.
 *
 * Open Source is the exception and stays fully derived — what matters there is
 * whose codebase the work landed in, which comes straight from merged
 * contributions.
 */
export function getDomainTechnologies(domain: Domain, limit = 4): DomainTechnology[] {
  if (domain === 'open-source') {
    const seen = new Set<string>();
    const repos: DomainTechnology[] = [];
    for (const contribution of getMergedContributions()) {
      const name = contribution.repository.split('/')[1] ?? contribution.repository;
      if (seen.has(name)) continue;
      seen.add(name);
      repos.push({ key: name, label: name, color: DOMAIN_COLORS['open-source'] });
    }
    return repos.slice(0, limit);
  }

  const meta = coreDomains.find((d) => d.domain === domain);
  return (meta?.technologies ?? [])
    .map((slug) => ({ slug, skill: getSkillBySlug(slug) }))
    .filter((entry) => Boolean(entry.skill))
    .slice(0, limit)
    .map((entry) => ({
      key: entry.slug,
      label: entry.skill!.shortName ?? entry.skill!.name,
      color: entry.skill!.color ?? DOMAIN_COLORS[domain],
    }));
}

// `technologies` is deliberately re-typed: DomainMeta carries curated skill
// slugs, while a summary carries them resolved to label + colour.
export interface DomainSummary extends Omit<DomainMeta, 'technologies'> {
  color: string;
  projects: Project[];
  technologies: DomainTechnology[];
  /** Derived headline evidence for the domain. Never hand-typed. */
  stat: { value: number; label: string };
}

/**
 * Everything the Engineering Core needs about one domain.
 *
 * Copy and destination come from content/domains.ts; every fact is derived here,
 * so a new project or merged PR updates the homepage without anyone editing it.
 */
export function getDomainSummary(domain: Domain): DomainSummary | undefined {
  const meta = coreDomains.find((d) => d.domain === domain);
  if (!meta) return undefined;

  const domainProjects = getProjectsByDomain(domain);
  const stat =
    domain === 'open-source'
      ? { value: getMergedContributions().length, label: 'merged upstream PRs' }
      : {
          value: domainProjects.length,
          label: domainProjects.length === 1 ? 'project' : 'projects',
        };

  return {
    ...meta,
    color: DOMAIN_COLORS[domain],
    projects: domainProjects,
    technologies: getDomainTechnologies(domain),
    stat,
  };
}

/** All five core domains, in ring order. */
export function getCoreDomains(): DomainSummary[] {
  return coreDomains
    .map((meta) => getDomainSummary(meta.domain))
    .filter((d): d is DomainSummary => Boolean(d));
}


// ──────────────────────── Homepage engineering story ────────────────────────

export interface ResolvedStoryStage extends StoryStage {
  /** Domain accent, shared with the Engineering Core. */
  color: string;
  /** The canonical project, when the stage is about one. */
  project?: Project;
  /** Verified proof for that project. Unverified evidence is never returned. */
  proof: Proof[];
  /** Documented limitations, straight from the canonical record. */
  limitations: string[];
  /** Technology labels, resolved through the skill registry. */
  technologies: DomainTechnology[];
  /** Upstream contributions, for the CONTRIBUTED stage only. */
  contributionList: OpenSourceContribution[];
  /** Research record, when the project has one. */
  research?: ResearchProject;
}

/**
 * The five story stages with their canonical facts attached.
 *
 * The narrative owns its copy; everything checkable is looked up here. A stage
 * therefore cannot claim a status, technology, proof item or limitation that the
 * project record does not also carry.
 *
 * Proof is filtered to verified entries only, matching the rule the rest of the
 * site follows: unverified evidence is never displayed publicly.
 */
export function getStoryStages(): ResolvedStoryStage[] {
  return storyStages.map((stage) => {
    const project = stage.projectSlug ? getProjectBySlug(stage.projectSlug) : undefined;
    const research = project?.researchSlug ? getResearchBySlug(project.researchSlug) : undefined;

    // Research records carry their own limitations; a stage surfaces both so
    // nothing documented is quietly dropped on the way to the homepage.
    //
    // De-duplicated on a normalised prefix rather than on exact text. A project
    // and its research record routinely state the same limitation in slightly
    // different words — Emergency Mesh has "built and tested, but the user
    // interface..." on the project and "built and tested; the user interface..."
    // on the research record — and printing both reads as a stutter. Comparing
    // the opening of each sentence catches that without the fragility of fuzzy
    // matching. The first wording wins.
    const seenLimitations = new Set<string>();
    const limitations: string[] = [];
    for (const limitation of [...(project?.limitations ?? []), ...(research?.limitations ?? [])]) {
      const key = limitation.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 60);
      if (seenLimitations.has(key)) continue;
      seenLimitations.add(key);
      limitations.push(limitation);
    }

    const technologies = (project?.technologies ?? [])
      .map((slug) => ({ slug, skill: getSkillBySlug(slug) }))
      .filter((entry) => Boolean(entry.skill))
      .map((entry) => ({
        key: entry.slug,
        label: entry.skill!.shortName ?? entry.skill!.name,
        color: entry.skill!.color ?? getDomainColor(stage.domain),
      }));

    return {
      ...stage,
      color: getDomainColor(stage.domain),
      project,
      research,
      proof: (project?.proof ?? []).filter((item) => item.verified),
      limitations,
      technologies,
      contributionList: stage.contributions ? getContributionsForDisplay() : [],
    };
  });
}

/** One stage by id, for anchor and skip-link targets. */
export function getStoryStageById(id: string): ResolvedStoryStage | undefined {
  return getStoryStages().find((stage) => stage.id === id);
}


// ─────────────────────────────── Case studies ───────────────────────────────

/**
 * Projects that have reviewed case-study material.
 *
 * This is the single definition of "has a detail page". `/work/[slug]` generates
 * routes from it, `/work` decides whether to show a case-study action from it,
 * and RelatedWork uses it to avoid linking at a page that does not exist.
 */
export function getCaseStudyProjects(): Project[] {
  return projects
    .filter((p) => Boolean(p.caseStudy))
    .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));
}

export function hasCaseStudy(slug: string): boolean {
  return Boolean(getProjectBySlug(slug)?.caseStudy);
}

/**
 * Other projects sharing an engineering domain, strongest first.
 *
 * Derived rather than hand-listed, so a new project in the same domain appears
 * without anyone maintaining a "see also" list. Archived work is excluded: it is
 * kept for the record, not offered as a next thing to read.
 */
export function getRelatedProjects(slug: string, limit = 4): Project[] {
  const project = getProjectBySlug(slug);
  if (!project) return [];

  const rank: Record<string, number> = {
    flagship: 0,
    'current-fyp': 1,
    secondary: 2,
    archive: 3,
  };

  return projects
    .filter(
      (p) =>
        p.slug !== slug &&
        p.tier !== 'archive' &&
        p.domains?.some((d) => project.domains?.includes(d))
    )
    .sort(
      (a, b) =>
        (rank[a.tier] ?? 9) - (rank[b.tier] ?? 9) ||
        (a.featuredRank ?? 99) - (b.featuredRank ?? 99) ||
        (a.sortOrder ?? 99) - (b.sortOrder ?? 99)
    )
    .slice(0, limit);
}
