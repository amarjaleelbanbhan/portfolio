/**
 * Content integrity rules.
 *
 * Pure functions with no I/O so the same checks can run from the CLI script, a
 * test, or (later) a CMS save handler. No validation framework — the rules are
 * specific enough that a schema library would add a dependency without adding
 * safety.
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
import {
  CONTRIBUTION_STATUSES,
  DOMAINS,
  PROJECT_STATUSES,
  PROJECT_TIERS,
  PROOF_TYPES,
  RESEARCH_CATEGORIES,
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

/**
 * Routes that exist today.
 *
 * The Engineering Core must not link at pages a later phase has not built yet,
 * so its destinations are checked against this list. Add to it when a phase
 * actually ships the route.
 */
const EXISTING_ROUTES = new Set([
  '/',
  '/projects',
  '/work',
  '/open-source',
  '/research',
  '/skills',
  '/certifications',
  '/contact',
  '/hire',
  '/studio',
]);

/**
 * The anchors each route actually renders.
 *
 * A destination like `/research#research-knowledgeguard` is only as good as its
 * anchor: a wrong one scrolls nowhere and looks like a broken page. Before
 * Phase 15 this was checked against project slugs alone, which meant any route
 * with its own anchor scheme could only be linked by loosening the rule.
 *
 * Returns `null` for a route with no known anchor scheme, which means "do not
 * check" rather than "no anchors are valid" — better to skip than to reject a
 * correct link.
 */
function anchorsFor(
  path: string,
  projectSlugs: Set<string>,
  researchSlugs: Set<string>
): Set<string> | null {
  switch (path) {
    case '/work':
    case '/projects':
      // Project cards carry their slug as an id; `open-source` is the
      // contributions section.
      return new Set([...projectSlugs, 'open-source']);
    case '/research':
      return new Set([...[...researchSlugs].map((slug) => `research-${slug}`), 'ledger']);
    case '/':
      return new Set([
        'engineering-story',
        'projects',
        ...storyStages.map((stage) => stage.id),
      ]);
    default:
      return null;
  }
}

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

  // Needed by the domain and story anchor checks, which run before the research
  // section builds its own set.
  const allResearchSlugs = new Set(researchProjects.map((entry) => entry.slug));

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

  // SCAR-OS (previously named VICE OS) must not drift into looking like shipped
  // software. The rename changed the name only, never the stage.
  const scarOs = projects.find((p) => p.slug === 'scar-os');
  if (scarOs) {
    if (IMPLEMENTATION_STATUSES.has(scarOs.status)) {
      add('project', 'scar-os', `status "${scarOs.status}" implies implemented software; it has none`);
    }
    if (scarOs.tier !== 'current-fyp') {
      add('project', 'scar-os', `tier must be "current-fyp", found "${scarOs.tier}"`);
    }
    if (scarOs.featured) {
      add('project', 'scar-os', 'must not be featured while at research/architecture stage');
    }
  } else {
    add('project', 'scar-os', 'SCAR-OS is missing from the project registry');
  }

  // The old name must not reappear on a public surface. The GitHub repository is
  // still called VICE-OS, but it is private and publishes no URL.
  for (const project of projects) {
    if (/vice[- ]?os/i.test(project.slug) || /vice[- ]?os/i.test(project.title)) {
      add('project', project.slug, 'uses the superseded name "VICE OS" — the project is now SCAR-OS');
    }
  }

  // Phase 1 removed this because the repository 404s.
  if (projects.some((p) => /bus[- ]?reservation/i.test(p.slug) || /bus reservation/i.test(p.title))) {
    add('project', 'bus-reservation', 'Bus Reservation System must not be restored — its repository 404s');
  }

  // ─────────────────────────── Core domains ───────────────────────────
  // The homepage Engineering Core presents these five. Copy is curated; every
  // fact it implies is checked here, so the core cannot advertise a technology
  // that is not genuinely part of that work or link somewhere that does not
  // exist.
  const seenDomains = new Set<string>();
  const seenAngles = new Set<number>();

  for (const meta of coreDomains) {
    const ref = meta.domain;

    if (!DOMAINS.includes(meta.domain)) {
      add('domain', ref, `"${meta.domain}" is not a canonical Domain`);
    }
    if (seenDomains.has(meta.domain)) add('domain', ref, `duplicate domain "${meta.domain}"`);
    seenDomains.add(meta.domain);

    if (!meta.label?.trim()) add('domain', ref, 'missing label');
    if (!meta.description?.trim()) add('domain', ref, 'missing description');

    // Two nodes at one angle would overlap on the core ring.
    if (seenAngles.has(meta.angle)) add('domain', ref, `duplicate ring angle ${meta.angle}`);
    seenAngles.add(meta.angle);
    if (meta.angle < 0 || meta.angle >= 360) {
      add('domain', ref, `ring angle ${meta.angle} is outside 0–359`);
    }

    // Destinations must be routes that exist today. Phase 4 explicitly forbids
    // linking the core at pages a later phase has not built yet.
    const [path, hash] = meta.href.split('#');
    if (!EXISTING_ROUTES.has(path)) {
      add('domain', ref, `href "${meta.href}" points at a route that does not exist yet`);
    }
    // The anchor must be one the destination route actually renders.
    const domainAnchors = anchorsFor(path, projectSlugs, allResearchSlugs);
    if (hash && domainAnchors && !domainAnchors.has(hash)) {
      add('domain', ref, `href anchor "#${hash}" is not rendered by ${path}`);
    }

    // Curated technologies must be real skills actually used in this domain.
    const domainProjectTech = new Set(
      projects
        .filter((p) => p.tier !== 'archive' && p.domains?.includes(meta.domain))
        .flatMap((p) => p.technologies ?? [])
    );
    for (const slug of meta.technologies ?? []) {
      if (!skills.some((sk) => sk.slug === slug)) {
        add('domain', ref, `technology "${slug}" does not exist in the skill registry`);
      } else if (!domainProjectTech.has(slug)) {
        add(
          'domain',
          ref,
          `technology "${slug}" is not used by any non-archive project in this domain`
        );
      }
    }

    if (meta.domain !== 'open-source' && (meta.technologies ?? []).length === 0) {
      add('domain', ref, 'has no technologies to display');
    }
  }

  // The core is designed around five nodes; a sixth would break the ring layout
  // and the keyboard order that mirrors it.
  if (coreDomains.length !== 5) {
    add('domain', 'core', `expected 5 core domains, found ${coreDomains.length}`);
  }

  // ──────────────────── Homepage engineering story ────────────────────
  // The narrative authors its own copy, so these rules exist to stop that copy
  // drifting away from the projects it describes.
  const storyIds = new Set<string>();
  const storyOrder = ['Built', 'Verified', 'Researched', 'Systems', 'Contributed'];

  for (const stage of storyStages) {
    const ref = stage.id || '(missing id)';

    if (!stage.id) add('story', ref, 'missing id');
    if (storyIds.has(stage.id)) add('story', ref, `duplicate stage id "${stage.id}"`);
    storyIds.add(stage.id);

    if (!stage.title?.trim()) add('story', ref, 'missing title');
    if (!stage.lede?.trim()) add('story', ref, 'missing lede');

    if (!DOMAINS.includes(stage.domain)) {
      add('story', ref, `invalid domain "${stage.domain}"`);
    }
    // Every stage must map onto a domain the Engineering Core actually shows,
    // otherwise the story and the hero would be telling different stories.
    if (!coreDomains.some((d) => d.domain === stage.domain)) {
      add('story', ref, `domain "${stage.domain}" is not one of the core domains`);
    }

    // A stage is about a real project or about upstream contributions.
    if (!stage.projectSlug && !stage.contributions) {
      add('story', ref, 'stage references neither a project nor contributions');
    }
    if (stage.projectSlug) {
      const project = projects.find((p) => p.slug === stage.projectSlug);
      if (!project) {
        add('story', ref, `projectSlug "${stage.projectSlug}" does not exist`);
      } else if (!project.domains?.includes(stage.domain)) {
        // The clearest way the story could lie: telling a security story about a
        // project that is not security work.
        add(
          'story',
          ref,
          `stage domain "${stage.domain}" is not one of ${stage.projectSlug}'s domains`
        );
      }
    }

    // Each diagram is an authored drawing, so each must say so.
    if (!stage.caveat?.trim()) {
      add('story', ref, 'missing caveat — every stage diagram must be labelled illustrative');
    }
    if (stage.steps.length < 3) {
      add('story', ref, `only ${stage.steps.length} steps; a pipeline needs at least 3`);
    }
    const stepIds = new Set<string>();
    for (const step of stage.steps) {
      if (stepIds.has(step.id)) add('story', ref, `duplicate step id "${step.id}"`);
      stepIds.add(step.id);
      if (!step.label?.trim()) add('story', ref, `step "${step.id}" has no label`);
    }

    const [path, hash] = stage.href.split('#');
    if (!EXISTING_ROUTES.has(path)) {
      add('story', ref, `href "${stage.href}" points at a route that does not exist yet`);
    }
    const storyAnchors = anchorsFor(path, projectSlugs, allResearchSlugs);
    if (hash && storyAnchors && !storyAnchors.has(hash)) {
      add('story', ref, `href anchor "#${hash}" is not rendered by ${path}`);
    }
  }

  if (storyStages.length !== 5) {
    add('story', 'story', `expected 5 narrative stages, found ${storyStages.length}`);
  }
  // BUILT → VERIFIED → RESEARCHED → SYSTEMS → CONTRIBUTED is the narrative; the
  // order is the argument, so it is checked rather than assumed.
  storyStages.forEach((stage, index) => {
    if (stage.kicker !== storyOrder[index]) {
      add('story', stage.id, `expected stage ${index + 1} to be "${storyOrder[index]}", found "${stage.kicker}"`);
    }
  });

  // ──────────────────────────── Case studies ────────────────────────────
  // A case study is the most detailed thing the site publishes about a project,
  // so its internal references are checked rather than trusted.
  for (const project of projects) {
    const study = project.caseStudy;
    if (!study) continue;
    const ref = project.slug;

    const arch = study.architecture;
    if (arch) {
      if (!arch.summary?.trim()) add('case-study', ref, 'architecture has no summary');
      // Sanitized diagrams describe private systems; saying so is required.
      if (!arch.caveat?.trim()) {
        add('case-study', ref, 'architecture has no caveat — diagrams must be labelled');
      }
      const nodeIds = new Set<string>();
      for (const node of arch.nodes ?? []) {
        if (!node.id) add('case-study', ref, 'architecture node has no id');
        if (nodeIds.has(node.id)) add('case-study', ref, `duplicate architecture node "${node.id}"`);
        nodeIds.add(node.id);
        if (!node.label?.trim()) add('case-study', ref, `architecture node "${node.id}" has no label`);
      }
      if ((arch.nodes ?? []).length === 0) {
        add('case-study', ref, 'architecture has no nodes');
      }
      // A flow to a component that does not exist would draw an integration
      // that was never built.
      for (const flow of arch.flows ?? []) {
        if (!nodeIds.has(flow.from)) {
          add('case-study', ref, `architecture flow from unknown node "${flow.from}"`);
        }
        if (!nodeIds.has(flow.to)) {
          add('case-study', ref, `architecture flow to unknown node "${flow.to}"`);
        }
      }
    }

    const decisionIds = new Set<string>();
    for (const decision of study.decisions ?? []) {
      if (decisionIds.has(decision.id)) {
        add('case-study', ref, `duplicate decision id "${decision.id}"`);
      }
      decisionIds.add(decision.id);
      if (!decision.decision?.trim() || !decision.rationale?.trim()) {
        add('case-study', ref, `decision "${decision.id}" needs both a decision and a rationale`);
      }
    }

    const verificationIds = new Set<string>();
    for (const item of study.verification ?? []) {
      if (verificationIds.has(item.id)) {
        add('case-study', ref, `duplicate verification id "${item.id}"`);
      }
      verificationIds.add(item.id);
      if (typeof item.verified !== 'boolean') {
        add('case-study', ref, `verification "${item.id}" must state whether it is evidenced`);
      }
    }

    // A factorial grid is the central artifact of a research case study, so its
    // internal references are checked rather than trusted.
    const grid = study.experiment;
    if (grid) {
      const rowIds = new Set((grid.rows ?? []).map((r) => r.id));
      const colIds = new Set((grid.cols ?? []).map((c) => c.id));
      if (rowIds.size === 0 || colIds.size === 0) {
        add('case-study', ref, 'experiment grid has no rows or no columns');
      }
      if (!grid.caveat?.trim()) {
        add('case-study', ref, 'experiment grid has no caveat');
      }
      for (const axis of [...(grid.rows ?? []), ...(grid.cols ?? [])]) {
        if (!axis.detail?.trim()) {
          add('case-study', ref, `experiment axis "${axis.id}" has no detail — the grid must stay useful without values`);
        }
      }
      const seenCells = new Set<string>();
      for (const cell of grid.cells ?? []) {
        const [rowId, colId] = cell.key.split('|');
        if (!rowIds.has(rowId) || !colIds.has(colId)) {
          add('case-study', ref, `experiment cell "${cell.key}" references a level that does not exist`);
        }
        if (seenCells.has(cell.key)) {
          add('case-study', ref, `duplicate experiment cell "${cell.key}"`);
        }
        seenCells.add(cell.key);
        if (typeof cell.value !== 'number' || Number.isNaN(cell.value)) {
          add('case-study', ref, `experiment cell "${cell.key}" has no numeric value`);
        }
      }
      // A partially filled grid invites reading absence as zero. Either the
      // results are publishable or they are not.
      const expected = rowIds.size * colIds.size;
      if (seenCells.size > 0 && seenCells.size !== expected) {
        add(
          'case-study',
          ref,
          `experiment grid is partially filled (${seenCells.size} of ${expected} cells) — publish all measured cells or none`
        );
      }
    }

    for (const finding of study.findings ?? []) {
      if (!finding.interpretation?.trim()) {
        add('case-study', ref, `finding "${finding.id}" has a value with no interpretation`);
      }
    }
    if (study.correction && !study.correction.status?.trim()) {
      add('case-study', ref, 'correction has no status saying what it does and does not settle');
    }

    // A private project publishing a case study must say what is withheld,
    // otherwise a reader cannot tell absence from omission.
    if (project.source.visibility !== 'public' && !study.disclosure?.trim()) {
      add(
        'case-study',
        ref,
        'private project has a case study but no disclosure note explaining what is withheld'
      );
    }
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
    if (!RESEARCH_CATEGORIES.includes(entry.category)) {
      add('research', ref, `invalid category "${entry.category}"`);
    }
    if (!entry.researchQuestion?.trim()) add('research', ref, 'missing researchQuestion');
    if (!entry.publicStage?.trim()) add('research', ref, 'missing publicStage');

    // "Executed" is the strongest claim the research page makes, so it has to
    // be backed by something: a completed status and at least one verified
    // piece of evidence. A plan cannot be filed under executed research by
    // editing one field.
    if (entry.category === 'executed') {
      if (entry.status !== 'complete') {
        add('research', ref, `category "executed" requires status "complete", found "${entry.status}"`);
      }
      if (!entry.results?.trim()) {
        add('research', ref, 'category "executed" requires recorded results');
      }
      if (!entry.proof.some((item) => item.verified)) {
        add('research', ref, 'category "executed" requires at least one verified proof entry');
      }
    }

    // Work that has not been done must never be filed as a result.
    if (entry.category !== 'executed' && entry.results?.trim()) {
      add('research', ref, `category "${entry.category}" carries results — recheck the category`);
    }

    // Research that is still at the architecture stage must say so and must not
    // carry results. This is the SCAR-OS guard, generalised.
    if (entry.status === 'architecture-stage') {
      if (entry.category !== 'current-fyp') {
        add('research', ref, 'architecture-stage research must be categorised as current-fyp');
      }
      if ((entry.limitations ?? []).length === 0) {
        add('research', ref, 'architecture-stage research must record what is not built');
      }
    }

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

    // The point of the Open Source page is what the change was for and what it
    // did. A contribution without both is a link, not evidence.
    if (!contribution.problem?.trim()) add('contribution', ref, 'missing problem');
    if (!contribution.change?.trim()) add('contribution', ref, 'missing change');

    // Phase 14's hard rule: an unmerged request must never carry the merged
    // badge. Enforced in the data as well as in the component, because the
    // badge is green and says "merged", and that is not a mistake worth
    // leaving to one render path.
    if (contribution.status !== 'merged') {
      for (const item of contribution.proof) {
        if (item.type === 'merged-pr') {
          add(
            'contribution',
            ref,
            `status is "${contribution.status}" but proof "${item.id}" is typed merged-pr`
          );
        }
      }
    }

    // A merge that predates its own opening would mean one of the two dates is
    // wrong, and both are shown publicly.
    if (contribution.openedAt && contribution.mergedAt && contribution.mergedAt < contribution.openedAt) {
      add('contribution', ref, `mergedAt ${contribution.mergedAt} is before openedAt ${contribution.openedAt}`);
    }

    // Diff figures come from the GitHub API and are displayed as measurements,
    // so they are checked for internal consistency rather than trusted.
    const diff = contribution.diff;
    if (diff) {
      if (diff.files < 1) add('contribution', ref, 'diff claims fewer than one changed file');
      if (diff.paths.length > diff.files) {
        add('contribution', ref, `diff lists ${diff.paths.length} paths but claims ${diff.files} changed files`);
      }
      const pathAdditions = diff.paths.reduce((sum, file) => sum + file.additions, 0);
      const pathDeletions = diff.paths.reduce((sum, file) => sum + file.deletions, 0);
      // Only checked when the path list is complete; a truncated list legitimately
      // sums to less than the totals.
      if (diff.paths.length === diff.files) {
        if (pathAdditions !== diff.additions) {
          add('contribution', ref, `diff additions ${diff.additions} do not match the per-file total ${pathAdditions}`);
        }
        if (pathDeletions !== diff.deletions) {
          add('contribution', ref, `diff deletions ${diff.deletions} do not match the per-file total ${pathDeletions}`);
        }
      }
      for (const file of diff.paths) {
        if (!file.path?.trim()) add('contribution', ref, 'diff path entry has no path');
        if (file.additions < 0 || file.deletions < 0) {
          add('contribution', ref, `diff path "${file.path}" has a negative line count`);
        }
      }
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
