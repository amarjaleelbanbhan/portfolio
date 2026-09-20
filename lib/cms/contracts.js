/**
 * Contracts for the database's flexible JSONB columns.
 *
 * The schema deliberately leaves these columns open, which means the shape is
 * the application's responsibility. Without a contract, "flexible" becomes
 * "whatever the last person saved", and a public page that reads it either
 * crashes or renders nonsense. So every JSONB column the CMS writes is
 * validated here, on the way in, and normalised on the way out.
 *
 * ── The one rule ─────────────────────────────────────────────────────────────
 * **These shapes mirror `content/types.ts`.** The canonical model is not being
 * replaced; it is being moved into a database. A project's `body` is the
 * existing `CaseStudy`, a research record's `results` is the existing findings
 * and correction, a technology's `evidence` is the existing project/
 * contribution/research references. Inventing a second, incompatible format
 * would mean two sources of truth for the same thing, which is what the
 * content architecture has been built to avoid since Phase 2.
 *
 * ── Validation, not coercion theatre ─────────────────────────────────────────
 * `validate*` returns `{ value, errors }`. Errors are human sentences, keyed by
 * path, because they are shown in an editor to the person who typed the
 * mistake. Unknown keys are **dropped**, not passed through: a CMS field is an
 * input surface, and anything that reaches a page must have been named here
 * first. That is also what stops `content` being used to smuggle markup.
 *
 * Nothing here renders HTML. Strings are strings; components decide how to
 * display them.
 */

// ─────────────────────────────── primitives ───────────────────────────────

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asString = (value, max = 20000) =>
  typeof value === 'string' ? value.slice(0, max) : '';

const asBool = (value) => value === true;

const asStringArray = (value, max = 200) =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === 'string' && item.trim()).slice(0, max).map((item) => item.slice(0, 2000))
    : [];

/** A URL, or nothing. Parsed rather than pattern-matched, http(s) only. */
export function asHttpUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.toString().slice(0, 2000) : null;
  } catch {
    return null;
  }
}

/** Slugs are identity. The database enforces this too; failing early is kinder. */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ─────────────────────────────── enumerations ───────────────────────────────
//
// Mirrored from the live CHECK constraints. Kept here so an editor can offer
// the right options and reject the wrong ones before the round trip, and so a
// constraint violation is never the first time anyone finds out.

export const PROJECT_STATUSES = [
  'production',
  'released',
  'active-development',
  'research',
  'prototype',
  'pre-alpha',
  'completed',
  'archived',
];

export const PROJECT_TIERS = ['flagship', 'secondary', 'current-fyp', 'archive'];

export const SOURCE_VISIBILITIES = ['public', 'private', 'unavailable'];

export const MEDIA_TYPES = ['image', 'video', 'diagram', 'document'];

export const CONTRIBUTION_STATUSES = ['merged', 'open', 'closed'];

export const LEAD_STATUSES = [
  'new',
  'reviewing',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
  'archived',
  'closed',
];

export const LEAD_PRIORITIES = ['low', 'normal', 'high', 'urgent'];

export const STORAGE_BUCKETS = ['portfolio-public', 'portfolio-private'];

// ───────────────────────────────── SEO ─────────────────────────────────

/**
 * `seo` on projects, research and site content.
 *
 * Lengths are capped where search engines truncate anyway, so the editor can
 * warn rather than silently ship something that gets cut off.
 */
export function validateSeo(input) {
  const errors = {};
  const raw = isPlainObject(input) ? input : {};

  const title = asString(raw.title, 120).trim();
  const description = asString(raw.description, 320).trim();
  const image = asHttpUrl(raw.image);

  if (title && title.length > 70) {
    errors['seo.title'] = 'Titles over about 70 characters get truncated in results.';
  }
  if (description && description.length > 175) {
    errors['seo.description'] = 'Descriptions over about 175 characters get truncated.';
  }
  if (raw.image && !image) {
    errors['seo.image'] = 'The social image needs to be a full http(s) URL.';
  }

  const value = {};
  if (title) value.title = title;
  if (description) value.description = description;
  if (image) value.image = image;
  if (asBool(raw.noindex)) value.noindex = true;

  return { value, errors };
}

// ─────────────────────────── project case study ───────────────────────────

function validateArchitecture(input, errors) {
  if (!isPlainObject(input)) return undefined;

  const nodes = (Array.isArray(input.nodes) ? input.nodes : [])
    .filter(isPlainObject)
    .map((node) => ({
      id: asString(node.id, 80),
      label: asString(node.label, 160),
      kind: ['client', 'service', 'data', 'external', 'process'].includes(node.kind)
        ? node.kind
        : 'service',
      detail: asString(node.detail, 400),
    }))
    .filter((node) => node.id && node.label);

  const ids = new Set(nodes.map((node) => node.id));
  const flows = (Array.isArray(input.flows) ? input.flows : [])
    .filter(isPlainObject)
    .map((flow) => ({
      from: asString(flow.from, 80),
      to: asString(flow.to, 80),
      label: asString(flow.label, 120),
    }))
    // A flow to a component that does not exist would draw an integration that
    // was never built. Same rule the static validator has always enforced.
    .filter((flow) => ids.has(flow.from) && ids.has(flow.to));

  const caveat = asString(input.caveat, 800).trim();
  if (nodes.length > 0 && !caveat) {
    errors['body.architecture.caveat'] =
      'An architecture diagram needs a caveat. It is a drawing, not a recording of a running system.';
  }

  if (nodes.length === 0) return undefined;
  return { summary: asString(input.summary, 1200), nodes, flows, caveat };
}

function validateExperiment(input, errors) {
  if (!isPlainObject(input)) return undefined;

  const axis = (entry) => ({
    id: asString(entry?.id, 80),
    label: asString(entry?.label, 120),
    detail: asString(entry?.detail, 800),
  });

  const rows = (Array.isArray(input.rows) ? input.rows : []).map(axis).filter((r) => r.id);
  const cols = (Array.isArray(input.cols) ? input.cols : []).map(axis).filter((c) => c.id);
  if (rows.length === 0 || cols.length === 0) return undefined;

  const rowIds = new Set(rows.map((r) => r.id));
  const colIds = new Set(cols.map((c) => c.id));

  const cells = (Array.isArray(input.cells) ? input.cells : [])
    .filter(isPlainObject)
    .map((cell) => ({
      key: asString(cell.key, 180),
      value: Number(cell.value),
      best: asBool(cell.best),
      note: asString(cell.note, 600),
    }))
    .filter((cell) => {
      const [rowId, colId] = cell.key.split('|');
      return rowIds.has(rowId) && colIds.has(colId) && Number.isFinite(cell.value);
    });

  // A partially filled grid invites reading absence as zero. Either the results
  // are publishable or they are not.
  const expected = rows.length * cols.length;
  if (cells.length > 0 && cells.length !== expected) {
    errors['body.experiment.cells'] =
      `The grid is partially filled (${cells.length} of ${expected}). Publish every measured cell or none.`;
  }
  if (!asString(input.caveat, 800).trim()) {
    errors['body.experiment.caveat'] = 'An experiment grid needs a caveat saying what the numbers are and are not.';
  }

  return {
    title: asString(input.title, 200),
    measure: asString(input.measure, 200),
    rowsLabel: asString(input.rowsLabel, 120),
    colsLabel: asString(input.colsLabel, 120),
    rows,
    cols,
    ...(cells.length ? { cells } : {}),
    provenance: asString(input.provenance, 1200),
    caveat: asString(input.caveat, 800),
  };
}

function validateLadder(input, errors) {
  if (!isPlainObject(input) || !Array.isArray(input.stages)) return undefined;

  const stages = input.stages
    .filter(isPlainObject)
    .map((stage) => ({
      id: asString(stage.id, 80),
      level: asString(stage.level, 40),
      label: asString(stage.label, 160),
      evidence: asString(stage.evidence, 800),
      meaning: asString(stage.meaning, 1200),
      status: ['implemented', 'partial', 'planned'].includes(stage.status) ? stage.status : 'planned',
      gap: asString(stage.gap, 1200),
    }))
    .filter((stage) => stage.id && stage.label);

  if (stages.length === 0) return undefined;

  // A rung that is not built and does not say why is a roadmap presented as a
  // feature list.
  for (const stage of stages) {
    if (stage.status === 'planned' && !stage.gap) {
      errors[`body.ladder.${stage.id}.gap`] = 'A planned rung must say why it is not built yet.';
    }
  }

  return {
    title: asString(input.title, 200),
    intro: asString(input.intro, 2000),
    stages,
    rules: asStringArray(input.rules, 20),
    caveat: asString(input.caveat, 800),
  };
}

function validateNetwork(input) {
  if (!isPlainObject(input) || !Array.isArray(input.steps)) return undefined;

  const nodes = (Array.isArray(input.nodes) ? input.nodes : [])
    .filter(isPlainObject)
    .map((node) => ({
      id: asString(node.id, 80),
      label: asString(node.label, 120),
      inRange: asBool(node.inRange),
    }))
    .filter((node) => node.id);

  const nodeIds = new Set(nodes.map((node) => node.id));
  const links = (Array.isArray(input.links) ? input.links : [])
    .filter(isPlainObject)
    .map((link) => ({
      id: asString(link.id, 80),
      from: asString(link.from, 80),
      to: asString(link.to, 80),
      established: asBool(link.established),
    }))
    .filter((link) => nodeIds.has(link.from) && nodeIds.has(link.to));

  const linkIds = new Set(links.map((link) => link.id));
  const steps = input.steps
    .filter(isPlainObject)
    .map((step) => ({
      id: asString(step.id, 80),
      label: asString(step.label, 160),
      detail: asString(step.detail, 1600),
      nodes: asStringArray(step.nodes, 20).filter((id) => nodeIds.has(id)),
      links: asStringArray(step.links, 20).filter((id) => linkIds.has(id)),
      // Defaults to the weakest claim. A step whose status is missing must not
      // silently become "runs on real hardware".
      status: ['live', 'simulated', 'not-implemented'].includes(step.status)
        ? step.status
        : 'not-implemented',
    }))
    .filter((step) => step.id && step.label);

  if (steps.length === 0) return undefined;

  return {
    title: asString(input.title, 200),
    intro: asString(input.intro, 2000),
    nodes,
    links,
    steps,
    caveat: asString(input.caveat, 800),
  };
}

/**
 * `portfolio_projects.body` — the case study.
 *
 * Mirrors the `CaseStudy` interface in `content/types.ts` exactly, so a record
 * round-trips between the static files and the database without translation.
 */
export function validateProjectBody(input) {
  const errors = {};
  const raw = isPlainObject(input) ? input : {};
  const value = {};

  const prose = {
    context: 4000,
    built: 6000,
    disclosure: 4000,
    problem: 4000,
    role: 2000,
    solution: 4000,
    architectureNote: 2000,
    technicalDepth: 6000,
    verificationNote: 4000,
  };
  for (const [key, max] of Object.entries(prose)) {
    const text = asString(raw[key], max).trim();
    if (text) value[key] = text;
  }

  const constraints = asStringArray(raw.constraints, 30);
  if (constraints.length) value.constraints = constraints;

  const results = asStringArray(raw.results, 30);
  if (results.length) value.results = results;

  const limitations = asStringArray(raw.limitations, 30);
  if (limitations.length) value.limitations = limitations;

  const decisions = (Array.isArray(raw.decisions) ? raw.decisions : [])
    .filter(isPlainObject)
    .map((decision) => ({
      id: asString(decision.id, 80),
      title: asString(decision.title, 200),
      decision: asString(decision.decision, 3000),
      rationale: asString(decision.rationale, 3000),
      tradeoff: asString(decision.tradeoff, 3000),
    }))
    .filter((decision) => decision.id && decision.title);
  for (const decision of decisions) {
    if (!decision.decision || !decision.rationale) {
      errors[`body.decisions.${decision.id}`] = 'A decision needs both what was decided and why.';
    }
  }
  if (decisions.length) value.decisions = decisions;

  const concerns = (Array.isArray(raw.concerns) ? raw.concerns : [])
    .filter(isPlainObject)
    .map((concern) => ({
      id: asString(concern.id, 80),
      title: asString(concern.title, 200),
      detail: asString(concern.detail, 3000),
    }))
    .filter((concern) => concern.id && concern.title);
  if (concerns.length) value.concerns = concerns;

  const verification = (Array.isArray(raw.verification) ? raw.verification : [])
    .filter(isPlainObject)
    .map((item) => ({
      id: asString(item.id, 80),
      label: asString(item.label, 200),
      detail: asString(item.detail, 3000),
      // Defaults to false. "Evidenced" is a claim and must be made explicitly.
      verified: asBool(item.verified),
    }))
    .filter((item) => item.id && item.label);
  if (verification.length) value.verification = verification;

  const timeline = (Array.isArray(raw.timeline) ? raw.timeline : [])
    .filter(isPlainObject)
    .map((entry) => ({
      id: asString(entry.id, 80),
      label: asString(entry.label, 200),
      detail: asString(entry.detail, 2000),
      date: asString(entry.date, 30),
    }))
    .filter((entry) => entry.id && entry.label);
  if (timeline.length) value.timeline = timeline;

  const findings = (Array.isArray(raw.findings) ? raw.findings : [])
    .filter(isPlainObject)
    .map((finding) => ({
      id: asString(finding.id, 80),
      label: asString(finding.label, 240),
      value: asString(finding.value, 240),
      interpretation: asString(finding.interpretation, 4000),
      corrected: asBool(finding.corrected),
    }))
    .filter((finding) => finding.id && finding.label);
  for (const finding of findings) {
    // A number without what it licenses is how research writing goes wrong.
    if (finding.value && !finding.interpretation) {
      errors[`body.findings.${finding.id}`] =
        'A measured value needs an interpretation saying what it does and does not license.';
    }
  }
  if (findings.length) value.findings = findings;

  if (isPlainObject(raw.correction) && asString(raw.correction.detail, 8000).trim()) {
    const correction = {
      date: asString(raw.correction.date, 30),
      title: asString(raw.correction.title, 240),
      detail: asString(raw.correction.detail, 8000),
      status: asString(raw.correction.status, 2000),
    };
    if (!correction.status.trim()) {
      errors['body.correction.status'] =
        'A correction needs a status saying what it does and does not settle.';
    }
    value.correction = correction;
  }

  const architecture = validateArchitecture(raw.architecture, errors);
  if (architecture) value.architecture = architecture;

  const experiment = validateExperiment(raw.experiment, errors);
  if (experiment) value.experiment = experiment;

  const ladder = validateLadder(raw.ladder, errors);
  if (ladder) value.ladder = ladder;

  const network = validateNetwork(raw.network);
  if (network) value.network = network;

  return { value, errors };
}

// ──────────────────────────── technology evidence ────────────────────────────

/**
 * `technologies.evidence` — what the skill was actually used in.
 *
 * Phase 16's rule, carried into the database: a technology's claim to exist is
 * the work it points at. An empty array is an error, not an empty state.
 */
export function validateTechnologyEvidence(input) {
  const errors = {};
  const value = (Array.isArray(input) ? input : [])
    .filter(isPlainObject)
    .map((entry) => ({
      kind: ['project', 'contribution', 'research'].includes(entry.kind) ? entry.kind : 'project',
      ref: asString(entry.ref, 200),
      label: asString(entry.label, 200),
      note: asString(entry.note, 600),
    }))
    .filter((entry) => entry.ref);

  if (value.length === 0) {
    errors.evidence =
      'A technology needs at least one project, contribution or research reference. Without one it is a label.';
  }

  return { value, errors };
}

// ───────────────────────────────── research ─────────────────────────────────

export function validateResearchMethodology(input) {
  const raw = isPlainObject(input) ? input : {};
  return {
    value: {
      question: asString(raw.question, 3000),
      hypothesis: asString(raw.hypothesis, 3000),
      method: asString(raw.method, 6000),
      dataset: asString(raw.dataset, 6000),
      design: asString(raw.design, 6000),
      publicStage: asString(raw.publicStage, 240),
      category: asString(raw.category, 80),
    },
    errors: {},
  };
}

export function validateResearchResults(input) {
  const errors = {};
  const raw = isPlainObject(input) ? input : {};

  const findings = (Array.isArray(raw.findings) ? raw.findings : [])
    .filter(isPlainObject)
    .map((finding) => ({
      id: asString(finding.id, 80),
      label: asString(finding.label, 240),
      value: asString(finding.value, 240),
      interpretation: asString(finding.interpretation, 4000),
      corrected: asBool(finding.corrected),
    }))
    .filter((finding) => finding.id && finding.label);

  for (const finding of findings) {
    if (finding.value && !finding.interpretation) {
      errors[`results.findings.${finding.id}`] =
        'A measured value needs an interpretation saying what it does and does not license.';
    }
  }

  return {
    value: {
      summary: asString(raw.summary, 6000),
      findings,
      experiment: validateExperiment(raw.experiment, errors),
    },
    errors,
  };
}

/** `corrections`, `limitations` and `future_work` are all lists of sentences. */
export function validateResearchList(input, field) {
  const errors = {};
  const value = (Array.isArray(input) ? input : [])
    .map((entry) => (typeof entry === 'string' ? { text: entry } : entry))
    .filter(isPlainObject)
    .map((entry) => ({
      text: asString(entry.text, 4000).trim(),
      date: asString(entry.date, 30),
      // Only meaningful on future work: says whether it has been done.
      done: asBool(entry.done),
    }))
    .filter((entry) => entry.text);

  if (field === 'corrections') {
    for (const [index, entry] of value.entries()) {
      if (!entry.date) errors[`corrections.${index}.date`] = 'A correction needs the date it was published.';
    }
  }

  return { value, errors };
}

// ────────────────────────── contribution verification ──────────────────────────

/**
 * `open_source_contributions.verification` — the tests the pull request itself
 * documents, plus the diff figures read from the API.
 *
 * `checks` is deliberately allowed to be empty: a request that documents no
 * tests should say so, not imply evidence it does not have.
 */
export function validateContributionVerification(input) {
  const errors = {};
  const raw = isPlainObject(input) ? input : {};

  const paths = (Array.isArray(raw.diff?.paths) ? raw.diff.paths : [])
    .filter(isPlainObject)
    .map((file) => ({
      path: asString(file.path, 400),
      additions: Math.max(0, Number(file.additions) || 0),
      deletions: Math.max(0, Number(file.deletions) || 0),
    }))
    .filter((file) => file.path);

  const diff = isPlainObject(raw.diff)
    ? {
        files: Math.max(0, Number(raw.diff.files) || 0),
        additions: Math.max(0, Number(raw.diff.additions) || 0),
        deletions: Math.max(0, Number(raw.diff.deletions) || 0),
        paths,
      }
    : undefined;

  if (diff && paths.length > diff.files) {
    errors['verification.diff.files'] =
      `The diff lists ${paths.length} files but claims ${diff.files} changed.`;
  }

  return {
    value: {
      problem: asString(raw.problem, 4000),
      change: asString(raw.change, 4000),
      checks: asStringArray(raw.checks, 20),
      issueRef: asString(raw.issueRef, 40),
      languages: asStringArray(raw.languages, 20),
      verifiedAsOf: asString(raw.verifiedAsOf, 30),
      ...(diff ? { diff } : {}),
    },
    errors,
  };
}

// ─────────────────────────── experience evidence ───────────────────────────

export function validateExperienceEvidence(input) {
  return {
    value: (Array.isArray(input) ? input : [])
      .filter(isPlainObject)
      .map((entry) => ({
        label: asString(entry.label, 240),
        detail: asString(entry.detail, 2000),
        url: asHttpUrl(entry.url),
      }))
      .filter((entry) => entry.label),
    errors: {},
  };
}

// ────────────────────────────── site content ──────────────────────────────

/**
 * `site_content.content` — a page section.
 *
 * Blocks are a **closed set**. Anything not named here is dropped, which is
 * what keeps the CMS from becoming a way to inject markup into a page: there
 * is no `html` block and there never should be. A block's fields are plain
 * strings and the components decide how to render them.
 */
export const CONTENT_BLOCK_TYPES = ['heading', 'paragraph', 'list', 'stat', 'link', 'note'];

export function validateSiteContent(input) {
  const errors = {};
  const raw = isPlainObject(input) ? input : {};

  const blocks = (Array.isArray(raw.blocks) ? raw.blocks : [])
    .filter(isPlainObject)
    .map((block, index) => {
      const type = CONTENT_BLOCK_TYPES.includes(block.type) ? block.type : null;
      if (!type) {
        errors[`content.blocks.${index}`] =
          `"${String(block.type).slice(0, 40)}" is not a known block type. Allowed: ${CONTENT_BLOCK_TYPES.join(', ')}.`;
        return null;
      }
      switch (type) {
        case 'heading':
          return { type, text: asString(block.text, 240), level: [2, 3, 4].includes(Number(block.level)) ? Number(block.level) : 2 };
        case 'paragraph':
          return { type, text: asString(block.text, 6000) };
        case 'list':
          return { type, items: asStringArray(block.items, 40), ordered: asBool(block.ordered) };
        case 'stat':
          return { type, value: asString(block.value, 60), label: asString(block.label, 160) };
        case 'link':
          return { type, label: asString(block.label, 160), href: asHttpUrl(block.href) ?? asString(block.href, 400) };
        case 'note':
          return { type, text: asString(block.text, 4000), tone: ['info', 'caution'].includes(block.tone) ? block.tone : 'info' };
        default:
          return null;
      }
    })
    .filter(Boolean);

  return {
    value: {
      title: asString(raw.title, 240),
      lede: asString(raw.lede, 2000),
      blocks,
    },
    errors,
  };
}

// ───────────────────────────── media metadata ─────────────────────────────

export function validateMediaMetadata(input) {
  const raw = isPlainObject(input) ? input : {};
  const width = Number(raw.width);
  const height = Number(raw.height);
  return {
    value: {
      ...(Number.isFinite(width) && width > 0 ? { width: Math.round(width) } : {}),
      ...(Number.isFinite(height) && height > 0 ? { height: Math.round(height) } : {}),
      ...(Number.isFinite(Number(raw.bytes)) ? { bytes: Math.round(Number(raw.bytes)) } : {}),
      mimeType: asString(raw.mimeType, 120),
      credit: asString(raw.credit, 240),
      // Set on anything that must never reach the public bucket.
      restricted: asBool(raw.restricted),
    },
    errors: {},
  };
}

// ───────────────────────────── site settings ─────────────────────────────

/**
 * The **only** settings keys a public page may read.
 *
 * `site_settings` has no anonymous read policy, and it must not get one: it is
 * a mixed bag of configuration, some of which is operational. A public page
 * that needs settings gets this projection through a server route, never the
 * table. Adding a key here is a deliberate decision to publish it.
 */
export const PUBLIC_SETTING_KEYS = [
  'site.navigation',
  'site.footer',
  'site.seo_defaults',
  'home.section_order',
  'theme.tokens',
  'motion.preferences',
  'engineering_core.config',
];

export function isPublicSettingKey(key) {
  return PUBLIC_SETTING_KEYS.includes(key);
}

export function validateSettingValue(key, input) {
  const errors = {};
  if (!isPlainObject(input) && !Array.isArray(input)) {
    errors.setting_value = 'A setting value must be a JSON object or array.';
    return { value: {}, errors };
  }
  // Settings are structurally open by design, but size is bounded so one bad
  // paste cannot make every page that reads it enormous.
  const serialised = JSON.stringify(input);
  if (serialised.length > 100_000) {
    errors.setting_value = 'That setting is over 100 KB. Store large assets as media, not settings.';
    return { value: {}, errors };
  }
  return { value: input, errors };
}

// ──────────────────────── audit and activity detail ────────────────────────

/**
 * `admin_audit_log.detail` and `lead_activity.detail`.
 *
 * Deliberately narrow. An audit record exists to say what changed, not to be a
 * second copy of the data — and a detail blob is exactly where a token or a
 * password ends up by accident. Keys matching credential-ish names are dropped
 * outright rather than trusted to be harmless.
 */
const SECRET_KEY_RE = /pass|secret|token|key|auth|cookie|session|credential/i;

export function validateAuditDetail(input) {
  const raw = isPlainObject(input) ? input : {};
  const value = {};

  for (const [key, entry] of Object.entries(raw)) {
    if (SECRET_KEY_RE.test(key)) continue;
    if (Object.keys(value).length >= 25) break;

    if (typeof entry === 'string') value[key] = entry.slice(0, 500);
    else if (typeof entry === 'number' || typeof entry === 'boolean') value[key] = entry;
    else if (Array.isArray(entry)) value[key] = asStringArray(entry, 25);
    else if (isPlainObject(entry)) {
      // One level only. Deep structures belong in the record itself.
      const nested = {};
      for (const [nestedKey, nestedValue] of Object.entries(entry)) {
        if (SECRET_KEY_RE.test(nestedKey)) continue;
        if (['string', 'number', 'boolean'].includes(typeof nestedValue)) {
          nested[nestedKey] = typeof nestedValue === 'string' ? nestedValue.slice(0, 300) : nestedValue;
        }
      }
      value[key] = nested;
    }
  }

  return { value, errors: {} };
}

/** True when every validator returned no errors. */
export function collectErrors(...results) {
  return Object.assign({}, ...results.map((result) => result?.errors ?? {}));
}
