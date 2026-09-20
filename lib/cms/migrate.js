/**
 * Canonical content → CMS tables.
 *
 * The schema exists and is empty. This moves the verified static content into
 * it **without changing what any of it says**: statuses, evidence, limitations,
 * corrections, disclosure notes and source-visibility rules all transfer
 * exactly. Nothing is invented, nothing is upgraded, and nothing private gains
 * a URL it did not have.
 *
 * ── Why it runs in the browser ───────────────────────────────────────────────
 * Every write is governed by row-level security, which authorises the
 * *authenticated admin*, not the server. Running this from an API route would
 * mean handing a server a secret key — a much larger thing to get wrong than a
 * migration button. So it runs from the admin page, with Amar's own session,
 * under exactly the policies that protect everything else.
 *
 * ── Idempotent ───────────────────────────────────────────────────────────────
 * Records are matched on their natural key — slug, or `pr_url` for
 * contributions — and updated in place. Running it twice changes nothing the
 * second time. It never deletes.
 *
 * ── Drafts, deliberately ─────────────────────────────────────────────────────
 * Everything imports **unpublished**. The content is already public through the
 * static files, so nothing is hidden that was visible; what this avoids is a
 * migration silently becoming a publishing event. Publishing is a separate,
 * explicit step.
 */
import {
  credentials as staticCredentials,
  openSourceContributions as staticContributions,
  projects as staticProjects,
  researchProjects as staticResearch,
  skills as staticSkills,
} from '@/content';

/**
 * A month-precision date as an ISO date.
 *
 * The source records say "Nov 2025" because that is the precision a credential
 * is issued at; the column is a `date`. The first of the month is the ordinary
 * convention for that, and every surface renders month and year, so nothing is
 * claimed that the source did not say. An unparseable value stays null rather
 * than becoming a guess.
 */
export function monthPrecisionDate(display) {
  if (!display) return null;
  const text = String(display).trim();

  const monthYear = /^([A-Za-z]{3,9})\s+(\d{4})$/.exec(text);
  if (monthYear) {
    const month = new Date(`${monthYear[1]} 1, 2000`).getMonth();
    if (Number.isNaN(month)) return null;
    return `${monthYear[2]}-${String(month + 1).padStart(2, '0')}-01`;
  }

  const yearOnly = /^(\d{4})$/.exec(text);
  if (yearOnly) return `${yearOnly[1]}-01-01`;

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (iso) return text;

  return null;
}

/** `cred-google-ai-essentials` → `google-ai-essentials`. */
const slugFromId = (id, prefix) => String(id).replace(new RegExp(`^${prefix}`), '');

// ─────────────────────────────── row builders ───────────────────────────────

function projectRow(project) {
  const study = project.caseStudy ?? {};

  // Project-level prose that has no column of its own lives in `body`, which is
  // exactly the shape `validateProjectBody` accepts.
  const body = {
    ...study,
    ...(project.problem ? { problem: project.problem } : {}),
    ...(project.role ? { role: project.role } : {}),
    ...(project.solution ? { solution: project.solution } : {}),
    ...(project.technicalDepth ? { technicalDepth: project.technicalDepth } : {}),
    ...(project.verification ? { verificationNote: project.verification } : {}),
    ...(project.limitations?.length ? { limitations: project.limitations } : {}),
  };

  const isPublic = project.source.visibility === 'public';

  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary ?? '',
    body,
    status: project.status,
    tier: project.tier,
    domains: project.domains ?? [],
    technologies: project.technologies ?? [],
    source_visibility: project.source.visibility,
    // The database refuses a repository URL on a non-public source, and so does
    // the canonical model. Enforced here too so the mapping cannot be the place
    // a private repository leaks.
    repository_url: isPublic ? (project.links.repository ?? project.source.repositoryUrl ?? null) : null,
    demo_url: project.links.demo ?? null,
    package_url: project.links.package ?? null,
    featured_rank: project.featured ? (project.featuredRank ?? null) : null,
    sort_order: project.sortOrder ?? 0,
    seo: project.seo ?? {},
  };
}

function technologyRow(skill) {
  const evidence = [
    ...skill.projectSlugs.map((ref) => ({ kind: 'project', ref, label: ref })),
    ...skill.contributionIds.map((ref) => ({ kind: 'contribution', ref, label: ref })),
    ...skill.researchSlugs.map((ref) => ({ kind: 'research', ref, label: ref })),
  ];

  return {
    slug: skill.slug,
    name: skill.name,
    category: skill.category,
    description: '',
    evidence,
    sort_order: skill.sortOrder ?? 0,
  };
}

function researchRow(entry, projectIdBySlug) {
  const project = entry.projectSlug ? staticProjects.find((p) => p.slug === entry.projectSlug) : null;
  const study = project?.caseStudy ?? {};

  return {
    slug: entry.slug,
    title: entry.title,
    summary: entry.results ?? entry.researchQuestion ?? '',
    status: entry.status,
    project_id: entry.projectSlug ? (projectIdBySlug.get(entry.projectSlug) ?? null) : null,
    methodology: {
      question: entry.researchQuestion ?? '',
      hypothesis: entry.hypothesis ?? '',
      method: entry.method ?? '',
      dataset: entry.dataset ?? '',
      design: entry.experimentDesign ?? '',
      publicStage: entry.publicStage ?? '',
      category: entry.category ?? '',
    },
    results: {
      summary: entry.results ?? '',
      findings: study.findings ?? [],
      experiment: study.experiment,
    },
    // The correction keeps its date, because a correction without one cannot be
    // read against the result it corrects.
    corrections: [
      ...(entry.corrections ?? []).map((text) => ({
        text,
        date: /(\d{4}-\d{2}-\d{2})/.exec(text)?.[1] ?? study.correction?.date ?? '',
      })),
      ...(study.correction && !(entry.corrections ?? []).length
        ? [{ text: study.correction.detail, date: study.correction.date }]
        : []),
    ],
    limitations: (entry.limitations ?? []).map((text) => ({ text })),
    future_work: (entry.futureWork ?? []).map((text) => ({ text, done: false })),
    disclosure_notes: study.disclosure ?? '',
    sort_order: 0,
    seo: {},
  };
}

function contributionRow(contribution) {
  return {
    repository: contribution.repository,
    pr_number: contribution.prNumber,
    pr_url: contribution.url,
    title: contribution.title,
    summary: contribution.summary ?? '',
    status: contribution.status,
    // Only a merged request carries a merge date. The database agrees, and so
    // does every surface that renders one.
    merged_at: contribution.status === 'merged' && contribution.mergedAt
      ? new Date(`${contribution.mergedAt}T00:00:00Z`).toISOString()
      : null,
    contribution_date: contribution.openedAt ?? null,
    technical_areas: contribution.areas ?? [],
    verification: {
      problem: contribution.problem ?? '',
      change: contribution.change ?? '',
      checks: contribution.verification ?? [],
      issueRef: contribution.issueRef ?? '',
      languages: contribution.languages ?? [],
      verifiedAsOf: contribution.proof?.[0]?.asOf ?? '',
      ...(contribution.diff ? { diff: contribution.diff } : {}),
    },
    sort_order: 0,
  };
}

function credentialRow(credential) {
  return {
    slug: slugFromId(credential.id, 'cred-'),
    title: credential.title,
    issuer: credential.issuer,
    issued_at: monthPrecisionDate(credential.issuedAt),
    credential_url: credential.credentialUrl ?? null,
    description: credential.description ?? '',
    featured: Boolean(credential.featured),
    sort_order: 0,
  };
}

// ─────────────────────────────── the migration ───────────────────────────────

/** What would be written, without writing anything. */
export function plan() {
  return [
    { table: 'technologies', key: 'slug', rows: staticSkills.map(technologyRow) },
    { table: 'portfolio_projects', key: 'slug', rows: staticProjects.map(projectRow) },
    { table: 'research_projects', key: 'slug', rows: [] }, // filled during apply: needs project ids
    { table: 'open_source_contributions', key: 'pr_url', rows: staticContributions.map(contributionRow) },
    { table: 'credentials', key: 'slug', rows: staticCredentials.map(credentialRow) },
  ];
}

/**
 * Upsert one table.
 *
 * `Prefer: resolution=merge-duplicates` needs a unique constraint on the
 * conflict target, which every natural key here has. That is what makes the
 * whole migration safe to re-run.
 */
async function upsert(cms, table, key, rows) {
  if (rows.length === 0) return [];
  return (
    (await cms.request(`${table}?on_conflict=${key}`, {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=representation',
      body: rows,
    })) ?? []
  );
}

/**
 * Run the migration.
 *
 * `onProgress` reports each step so the page can show what is happening rather
 * than freezing for several seconds.
 */
export async function migrate(cms, onProgress = () => {}) {
  const report = { steps: [], errors: [] };

  const step = async (label, run) => {
    onProgress(label);
    try {
      const count = await run();
      report.steps.push({ label, count, ok: true });
    } catch (error) {
      report.steps.push({ label, count: 0, ok: false, error: error.message });
      report.errors.push(`${label}: ${error.message}`);
    }
  };

  // Technologies first: projects reference them, and the join table needs ids.
  let technologyIdBySlug = new Map();
  await step('Technologies', async () => {
    const written = await upsert(cms, 'technologies', 'slug', staticSkills.map(technologyRow));
    technologyIdBySlug = new Map(written.map((row) => [row.slug, row.id]));
    return written.length;
  });

  let projectIdBySlug = new Map();
  await step('Projects', async () => {
    const written = await upsert(cms, 'portfolio_projects', 'slug', staticProjects.map(projectRow));
    projectIdBySlug = new Map(written.map((row) => [row.slug, row.id]));
    return written.length;
  });

  // The join table is the canonical project↔technology record; the array column
  // on the project mirrors it for cheap reads. Both are written from the same
  // source, so they cannot disagree.
  await step('Project ↔ technology links', async () => {
    const links = [];
    for (const project of staticProjects) {
      const projectId = projectIdBySlug.get(project.slug);
      if (!projectId) continue;
      (project.technologies ?? []).forEach((slug, index) => {
        const technologyId = technologyIdBySlug.get(slug);
        if (technologyId) links.push({ project_id: projectId, technology_id: technologyId, sort_order: index });
      });
    }
    if (links.length === 0) return 0;
    await cms.request('project_technologies?on_conflict=project_id,technology_id', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: links,
    });
    return links.length;
  });

  await step('Research', async () => {
    const rows = staticResearch.map((entry) => researchRow(entry, projectIdBySlug));
    const written = await upsert(cms, 'research_projects', 'slug', rows);
    return written.length;
  });

  await step('Open-source contributions', async () => {
    const written = await upsert(
      cms,
      'open_source_contributions',
      'pr_url',
      staticContributions.map(contributionRow)
    );
    return written.length;
  });

  await step('Credentials', async () => {
    const written = await upsert(cms, 'credentials', 'slug', staticCredentials.map(credentialRow));
    return written.length;
  });

  await cms.audit('migrate', 'canonical-content', 'all', {
    steps: report.steps.map((entry) => `${entry.label}:${entry.count}`).join(' '),
  });

  return report;
}

/**
 * Publish everything that was imported.
 *
 * Separate from the migration on purpose. It sets both `is_published` and
 * `published_at`, because the anonymous read policy needs both — setting one
 * produces a record the admin calls live and the public site never shows.
 */
export async function publishImported(cms, onProgress = () => {}) {
  const now = new Date().toISOString();
  const tables = [
    'technologies',
    'portfolio_projects',
    'research_projects',
    'open_source_contributions',
    'credentials',
  ];
  const report = { steps: [], errors: [] };

  for (const table of tables) {
    onProgress(table);
    try {
      const rows =
        (await cms.request(`${table}?is_published=eq.false`, {
          method: 'PATCH',
          prefer: 'return=representation',
          body: { is_published: true, published_at: now },
        })) ?? [];
      report.steps.push({ label: table, count: rows.length, ok: true });
    } catch (error) {
      report.steps.push({ label: table, count: 0, ok: false, error: error.message });
      report.errors.push(`${table}: ${error.message}`);
    }
  }

  await cms.audit('publish-all', 'canonical-content', 'all', {
    steps: report.steps.map((entry) => `${entry.label}:${entry.count}`).join(' '),
  });

  return report;
}

/** Counts of what the static content holds, for the dry-run summary. */
export function sourceCounts() {
  return {
    technologies: staticSkills.length,
    portfolio_projects: staticProjects.length,
    research_projects: staticResearch.length,
    open_source_contributions: staticContributions.length,
    credentials: staticCredentials.length,
  };
}
