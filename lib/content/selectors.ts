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
  researchCategories,
  researchProjects,
  skills,
} from '@/content';
import { SKILL_CATEGORIES } from '@/content/types';
import type {
  Credential,
  Domain,
  EducationEntry,
  EvidenceState,
  OpenSourceContribution,
  Profile,
  Project,
  ProjectStatus,
  Proof,
  ProjectTier,
  ResearchProject,
  Skill,
  SkillCategory,
  VerificationItem,
} from '@/content/types';
import type { DomainMeta } from '@/content/domains';
import type { ResearchCategoryMeta } from '@/content/research';
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

export function getResearchCategories(): ResearchCategoryMeta[] {
  return researchCategories;
}

/**
 * One documented capability or finding, tagged with the strongest evidence that
 * exists for it.
 *
 * `source` records which canonical structure it came from, so a reader — and a
 * future maintainer — can see that nothing here was written by hand for the
 * research page.
 */
export interface EvidenceItem {
  id: string;
  label: string;
  detail: string;
  state: EvidenceState;
  source: 'finding' | 'protocol-step' | 'ladder-rung' | 'future-work' | 'limitation';
}

/**
 * Evidence state for one research entry, derived — never authored.
 *
 * The three sources are the structures the case studies already carry:
 *
 * | Canonical record          | Maps to                                    |
 * |---------------------------|--------------------------------------------|
 * | `caseStudy.findings`      | `executed` — a measured result exists       |
 * | `caseStudy.network.steps` | `live` → executed, `simulated` → simulated, |
 * |                           | `not-implemented` → not-built               |
 * | `caseStudy.ladder.stages` | `implemented`/`partial` → built,            |
 * |                           | `planned` → not-built                       |
 * | `research.futureWork`     | `not-built`                                 |
 *
 * A protocol step marked `live` is `executed` rather than `built` because the
 * canonical record means it was exercised on real hardware, which is a result,
 * not a feature. A ladder rung marked implemented is `built`: the code exists
 * and nothing has measured how well it works.
 *
 * Counts from different entries are NOT comparable — they count different kinds
 * of item — and every surface that renders them has to say so.
 */
export function getResearchEvidence(entry: ResearchProject): EvidenceItem[] {
  const project = entry.projectSlug ? getProjectBySlug(entry.projectSlug) : undefined;
  const study = project?.caseStudy;
  const items: EvidenceItem[] = [];

  for (const finding of study?.findings ?? []) {
    items.push({
      id: finding.id,
      label: finding.label,
      detail: finding.interpretation,
      state: 'executed',
      source: 'finding',
    });
  }

  for (const step of study?.network?.steps ?? []) {
    items.push({
      id: step.id,
      label: step.label,
      detail: step.detail,
      state:
        step.status === 'live' ? 'executed' : step.status === 'simulated' ? 'simulated' : 'not-built',
      source: 'protocol-step',
    });
  }

  for (const rung of study?.ladder?.stages ?? []) {
    items.push({
      id: rung.id,
      label: `${rung.level} · ${rung.label}`,
      detail: rung.status === 'planned' && rung.gap ? rung.gap : rung.meaning,
      state: rung.status === 'planned' ? 'not-built' : 'built',
      source: 'ladder-rung',
    });
  }

  for (const [index, work] of (entry.futureWork ?? []).entries()) {
    items.push({
      id: `${entry.slug}-future-${index}`,
      // Future work is written as one sentence; the first clause is its name.
      label: work.split(/ — |\. /)[0],
      detail: work,
      state: 'not-built',
      source: 'future-work',
    });
  }

  // An entry with no case study and no future work still has to say something
  // true about what exists. Its limitations are the only structured record of
  // that, and for SCAR-OS they say exactly the right thing.
  if (items.length === 0) {
    for (const [index, limitation] of (entry.limitations ?? []).entries()) {
      items.push({
        id: `${entry.slug}-limit-${index}`,
        label: 'Not implemented',
        detail: limitation,
        state: 'not-built',
        source: 'limitation',
      });
    }
  }

  return items;
}

export interface ResearchOverview {
  research: ResearchProject;
  categoryMeta: ResearchCategoryMeta;
  project?: Project;
  /** `/work/<slug>` when the project has a reviewed case study. */
  caseStudyHref?: string;
  evidence: EvidenceItem[];
  /** Count of evidence items in each state, for the ledger. */
  counts: Record<EvidenceState, number>;
  /** Verified proof only, matching the rule the rest of the site follows. */
  proof: Proof[];
  /**
   * Verification activities the case study records as *not* independently
   * evidenced — "the native stack has not been verified on a device", "mesh
   * behaviour beyond one hop exists only in simulation".
   *
   * Kept out of the ledger deliberately. These are qualifications on work that
   * exists, not items in their own right, and counting them alongside protocol
   * steps would both double-count single-hop transfer and quietly turn a
   * caveat into a tally. They are the answer to "what is still missing", so
   * they get their own block instead.
   */
  gaps: VerificationItem[];
}

/**
 * Every research entry with its category copy, its project, and its derived
 * evidence, in category order.
 */
export function getResearchOverviews(): ResearchOverview[] {
  const order = new Map(researchCategories.map((meta, index) => [meta.category, index]));

  return researchProjects
    .map((entry): ResearchOverview | undefined => {
      const categoryMeta = researchCategories.find((meta) => meta.category === entry.category);
      if (!categoryMeta) return undefined;

      const project = entry.projectSlug ? getProjectBySlug(entry.projectSlug) : undefined;
      const evidence = getResearchEvidence(entry);
      const counts: Record<EvidenceState, number> = {
        executed: 0,
        built: 0,
        simulated: 0,
        'not-built': 0,
      };
      for (const item of evidence) counts[item.state] += 1;

      return {
        research: entry,
        categoryMeta,
        project,
        caseStudyHref: project?.caseStudy ? `/work/${project.slug}` : undefined,
        evidence,
        counts,
        proof: entry.proof.filter((item) => item.verified),
        gaps: (project?.caseStudy?.verification ?? []).filter((item) => !item.verified),
      };
    })
    .filter((overview): overview is ResearchOverview => Boolean(overview))
    .sort(
      (a, b) =>
        (order.get(a.research.category) ?? 99) - (order.get(b.research.category) ?? 99)
    );
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

/**
 * Technical areas that contributions actually carry, each with its count.
 *
 * Derived rather than listed: an area nobody has worked in would be a filter
 * button that always returns nothing, and a new area should appear without
 * anyone editing the page.
 */
export function getContributionAreas(): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const contribution of openSourceContributions) {
    for (const area of contribution.areas) {
      counts.set(area, (counts.get(area) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

/** Languages across all contributions, most-used first. */
export function getContributionLanguages(): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const contribution of openSourceContributions) {
    for (const language of contribution.languages) {
      counts.set(language, (counts.get(language) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

export interface UpstreamRepository {
  /** `owner/repo`. */
  repository: string;
  organization: string;
  /** Just the repository half, for compact labels. */
  name: string;
  contributions: OpenSourceContribution[];
  mergedCount: number;
  openCount: number;
}

/**
 * Upstream repositories worked in, with the contributions that landed in each.
 *
 * This is the whole basis of the repository graph on /open-source: the graph
 * draws exactly these relationships and nothing else, so it cannot depict
 * activity, reviews or influence that the contribution records do not contain.
 */
export function getUpstreamRepositories(): UpstreamRepository[] {
  const byRepository = new Map<string, UpstreamRepository>();
  for (const contribution of getContributionsForDisplay()) {
    const existing = byRepository.get(contribution.repository);
    const entry: UpstreamRepository = existing ?? {
      repository: contribution.repository,
      organization: contribution.organization,
      name: contribution.repository.split('/')[1] ?? contribution.repository,
      contributions: [],
      mergedCount: 0,
      openCount: 0,
    };
    entry.contributions.push(contribution);
    if (contribution.status === 'merged') entry.mergedCount += 1;
    if (contribution.status === 'open') entry.openCount += 1;
    byRepository.set(contribution.repository, entry);
  }
  return [...byRepository.values()].sort(
    (a, b) => b.contributions.length - a.contributions.length || a.name.localeCompare(b.name)
  );
}

export interface ContributionStats {
  merged: number;
  open: number;
  total: number;
  repositories: number;
  organizations: number;
  /** Files, additions and deletions summed across every recorded diff. */
  filesChanged: number;
  additions: number;
  deletions: number;
  /** Contributions whose pull request documents tests or checks. */
  withVerification: number;
  /**
   * The oldest `asOf` across every contribution's proof — the date the whole
   * set can honestly be described as verified to, since it is only as current
   * as its least recently checked member.
   */
  verifiedAsOf: string | null;
}

/**
 * Headline numbers for /open-source, every one of them counted from the
 * records rather than written down. There is deliberately no "contribution
 * score" here — the only figures are things that were individually verified.
 */
export function getContributionStats(): ContributionStats {
  const stats: ContributionStats = {
    merged: 0,
    open: 0,
    total: openSourceContributions.length,
    repositories: new Set(openSourceContributions.map((c) => c.repository)).size,
    organizations: new Set(openSourceContributions.map((c) => c.organization)).size,
    filesChanged: 0,
    additions: 0,
    deletions: 0,
    withVerification: 0,
    verifiedAsOf: null,
  };
  for (const contribution of openSourceContributions) {
    if (contribution.status === 'merged') stats.merged += 1;
    if (contribution.status === 'open') stats.open += 1;
    if (contribution.verification?.length) stats.withVerification += 1;
    if (contribution.diff) {
      stats.filesChanged += contribution.diff.files;
      stats.additions += contribution.diff.additions;
      stats.deletions += contribution.diff.deletions;
    }
    for (const item of contribution.proof) {
      // The oldest check is the honest one to advertise: the set as a whole is
      // only as current as its least recently verified member.
      if (!item.asOf) continue;
      if (stats.verifiedAsOf === null || item.asOf < stats.verifiedAsOf) {
        stats.verifiedAsOf = item.asOf;
      }
    }
  }
  return stats;
}

/**
 * Whole days between opening and merge, or null when either date is unknown or
 * the request is not merged. Same-day merges return 0, which is a real answer
 * and not a missing one.
 */
export function getDaysToMerge(contribution: OpenSourceContribution): number | null {
  if (contribution.status !== 'merged' || !contribution.openedAt || !contribution.mergedAt) {
    return null;
  }
  const opened = Date.parse(`${contribution.openedAt}T00:00:00Z`);
  const merged = Date.parse(`${contribution.mergedAt}T00:00:00Z`);
  if (Number.isNaN(opened) || Number.isNaN(merged)) return null;
  return Math.round((merged - opened) / 86_400_000);
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

/**
 * Where a piece of evidence can be opened.
 *
 * A project with a reviewed case study goes to its own page; one without goes
 * to its card on /work, which is a real anchor rather than a dead end. Research
 * goes to its entry on /research, and a contribution goes to the pull request
 * itself. Nothing here ever returns a link to a page that does not exist —
 * that decision lives in this one function rather than in each component.
 */
export interface SkillEvidenceLink {
  key: string;
  label: string;
  /** Short qualifier: a project status, a research stage, a PR state. */
  meta: string;
  href: string;
  /** True when the destination leaves the site. */
  external: boolean;
}

export interface SkillEvidenceDetail {
  skill: Skill;
  projects: SkillEvidenceLink[];
  research: SkillEvidenceLink[];
  contributions: SkillEvidenceLink[];
  /** Total across all three, for compact counts. */
  total: number;
  /**
   * Other skills used in at least one of the same pieces of work. Derived, not
   * curated — this is what the galaxy's edges are drawn from.
   */
  relatedSkills: { slug: string; label: string }[];
}

/** Everything the Skill Galaxy needs about one skill, resolved to real links. */
export function getSkillEvidenceDetail(slug: string): SkillEvidenceDetail | undefined {
  const skill = getSkillBySlug(slug);
  if (!skill) return undefined;

  const projects: SkillEvidenceLink[] = skill.projectSlugs
    .map((projectSlug) => getProjectBySlug(projectSlug))
    .filter((project): project is Project => Boolean(project))
    .map((project) => ({
      key: project.slug,
      label: project.shortTitle ?? project.title,
      meta: project.status,
      href: project.caseStudy ? `/work/${project.slug}` : `/work#${project.slug}`,
      external: false,
    }));

  const research: SkillEvidenceLink[] = skill.researchSlugs
    .map((researchSlug) => getResearchBySlug(researchSlug))
    .filter((entry): entry is ResearchProject => Boolean(entry))
    .map((entry) => ({
      key: entry.slug,
      label: entry.title.split(' — ')[0],
      meta: entry.publicStage,
      href: `/research#research-${entry.slug}`,
      external: false,
    }));

  const contributions: SkillEvidenceLink[] = skill.contributionIds
    .map((id) => getContributionById(id))
    .filter((contribution): contribution is OpenSourceContribution => Boolean(contribution))
    .map((contribution) => ({
      key: contribution.id,
      label: `${contribution.repository.split('/')[1]}#${contribution.prNumber}`,
      meta: contribution.status,
      href: contribution.url,
      external: true,
    }));

  return {
    skill,
    projects,
    research,
    contributions,
    total: projects.length + research.length + contributions.length,
    relatedSkills: getRelatedSkills(slug).map((relatedSlug) => {
      const related = getSkillBySlug(relatedSlug);
      return { slug: relatedSlug, label: related?.shortName ?? related?.name ?? relatedSlug };
    }),
  };
}

/**
 * Skills that share a piece of work with this one.
 *
 * Co-occurrence, not similarity. Two skills are related here because they were
 * genuinely used on the same project, research entry or pull request — which is
 * a fact in the records — rather than because they feel like they belong to the
 * same family, which would be an opinion.
 */
export function getRelatedSkills(slug: string): string[] {
  const skill = getSkillBySlug(slug);
  if (!skill) return [];

  const mine = {
    projects: new Set(skill.projectSlugs),
    research: new Set(skill.researchSlugs),
    contributions: new Set(skill.contributionIds),
  };

  return skills
    .filter(
      (other) =>
        other.slug !== slug &&
        (other.projectSlugs.some((s) => mine.projects.has(s)) ||
          other.researchSlugs.some((s) => mine.research.has(s)) ||
          other.contributionIds.some((s) => mine.contributions.has(s)))
    )
    .map((other) => other.slug);
}

export interface SkillGraphNode {
  slug: string;
  label: string;
  category: SkillCategory;
  color: string;
  /** How many pieces of evidence back it. Drives node size. */
  evidenceCount: number;
}

export interface SkillGraphEdge {
  id: string;
  from: string;
  to: string;
  /** How many pieces of work the two skills share. */
  weight: number;
  /** The shared work, for the "used together in" line. */
  shared: string[];
}

export interface SkillGraph {
  categories: { category: SkillCategory; skills: SkillGraphNode[] }[];
  nodes: SkillGraphNode[];
  edges: SkillGraphEdge[];
}

/**
 * The skill ecosystem as a graph, grouped by category.
 *
 * Nodes are skills; **edges are shared work, not resemblance**. That is the
 * whole point of the visualisation: the clusters that appear — Flutter beside
 * Dart, BLE and cryptography; Python beside RAG and evaluation — appear because
 * those technologies were used on the same thing, and a reader can open the
 * thing and check.
 *
 * Categories with no skills are omitted rather than rendered as an empty
 * cluster. Ordering is the canonical `SKILL_CATEGORIES` order, then each
 * category's own `sortOrder`, so the layout is deterministic and identical on
 * the server and the client.
 */
export function getSkillGraph(): SkillGraph {
  const nodes: SkillGraphNode[] = skills.map((skill) => ({
    slug: skill.slug,
    label: skill.shortName ?? skill.name,
    category: skill.category,
    color: skill.color ?? '#14b8a6',
    evidenceCount:
      skill.projectSlugs.length + skill.researchSlugs.length + skill.contributionIds.length,
  }));

  const categories = SKILL_CATEGORIES.map((category) => ({
    category,
    skills: nodes
      .filter((node) => node.category === category)
      .sort((a, b) => {
        const orderA = getSkillBySlug(a.slug)?.sortOrder ?? Number.MAX_SAFE_INTEGER;
        const orderB = getSkillBySlug(b.slug)?.sortOrder ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB || a.label.localeCompare(b.label);
      }),
  })).filter((group) => group.skills.length > 0);

  // Undirected, so each pair is visited once.
  const edges: SkillGraphEdge[] = [];
  for (let i = 0; i < skills.length; i++) {
    for (let j = i + 1; j < skills.length; j++) {
      const a = skills[i];
      const b = skills[j];
      const shared = [
        ...a.projectSlugs.filter((slug) => b.projectSlugs.includes(slug)),
        ...a.researchSlugs.filter((slug) => b.researchSlugs.includes(slug)),
        ...a.contributionIds.filter((id) => b.contributionIds.includes(id)),
      ];
      if (shared.length === 0) continue;
      edges.push({
        id: `${a.slug}--${b.slug}`,
        from: a.slug,
        to: b.slug,
        weight: shared.length,
        shared,
      });
    }
  }

  return { categories, nodes, edges };
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
