/**
 * Field definitions for every CMS table.
 *
 * One schema drives the list view, the editor, validation and the command
 * palette. Seven bespoke editors would have been seven places to forget the
 * publish rule, seven different ideas of what a slug is, and seven half-built
 * forms; this is one editor that is actually finished.
 *
 * ── Mirrors the live database ────────────────────────────────────────────────
 * Every column, type, default and CHECK below was taken from the live schema.
 * Where the database constrains a value, the same constraint is here — not to
 * replace it, but so the editor can refuse early and explain, instead of
 * surfacing `23514 violates check constraint` after a round trip.
 *
 * ── JSON fields ──────────────────────────────────────────────────────────────
 * The flexible JSONB columns are edited as JSON, validated through
 * `lib/cms/contracts.js` on save. That is a deliberate choice rather than a
 * shortcut: a case study has fifteen nested optional structures, and a bespoke
 * form for each would be enormous, worse to use, and immediately out of date.
 * The contract is what makes raw JSON safe — unknown keys are dropped, shapes
 * are checked, and the editor shows the errors against the field.
 */
import {
  CONTRIBUTION_STATUSES,
  MEDIA_TYPES,
  PROJECT_STATUSES,
  PROJECT_TIERS,
  SOURCE_VISIBILITIES,
  validateContributionVerification,
  validateExperienceEvidence,
  validateProjectBody,
  validateResearchList,
  validateResearchMethodology,
  validateResearchResults,
  validateSeo,
  validateSiteContent,
  validateTechnologyEvidence,
} from '@/lib/cms/contracts';

/** Shared field shapes, so the same column never gets two definitions. */
const slugField = (help) => ({
  name: 'slug',
  label: 'Slug',
  type: 'slug',
  required: true,
  help: help ?? 'Lowercase letters, numbers and single hyphens. This is the record’s identity — changing it breaks existing links.',
});

const sortField = {
  name: 'sort_order',
  label: 'Sort order',
  type: 'number',
  help: 'Lower sorts first.',
};

const seoField = {
  name: 'seo',
  label: 'SEO',
  type: 'json',
  contract: validateSeo,
  help: 'title, description, image, noindex. Anything else is dropped on save.',
  placeholder: '{\n  "title": "",\n  "description": ""\n}',
};

export const TABLE_SCHEMAS = {
  // ─────────────────────────────── Projects ───────────────────────────────
  portfolio_projects: {
    table: 'portfolio_projects',
    section: 'projects',
    label: 'Project',
    plural: 'Projects',
    publishable: true,
    titleField: 'title',
    order: 'sort_order.asc,title.asc',
    listFields: ['title', 'slug', 'status', 'tier'],
    searchFields: ['title', 'slug', 'summary'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField(),
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 3, help: 'One or two sentences. Used on cards.' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: PROJECT_STATUSES,
        help: 'Where the work actually is, not where it is heading.',
      },
      {
        name: 'tier',
        label: 'Tier',
        type: 'select',
        options: PROJECT_TIERS,
        help: 'How much it matters to the portfolio. Independent of status.',
      },
      { name: 'domains', label: 'Domains', type: 'tags', help: 'product, ai, security, systems, research, open-source' },
      { name: 'technologies', label: 'Technologies', type: 'tags', help: 'Technology slugs. The linking table is the canonical record; this array mirrors it for fast reads.' },
      {
        name: 'source_visibility',
        label: 'Source visibility',
        type: 'select',
        options: SOURCE_VISIBILITIES,
        help: 'Private means the repository URL must be empty — the database enforces it.',
      },
      { name: 'repository_url', label: 'Repository URL', type: 'url' },
      { name: 'demo_url', label: 'Demo URL', type: 'url' },
      { name: 'package_url', label: 'Package URL', type: 'url' },
      {
        name: 'featured_rank',
        label: 'Featured rank',
        type: 'number',
        help: 'Leave empty unless featured. Must be unique and greater than zero.',
      },
      sortField,
      {
        name: 'body',
        label: 'Case study',
        type: 'json',
        contract: validateProjectBody,
        rows: 18,
        help: 'The CaseStudy shape from content/types.ts: context, constraints, built, architecture, decisions, concerns, verification, results, timeline, findings, correction, experiment, ladder, network, disclosure.',
      },
      seoField,
    ],
    /** Cross-field rules the database also enforces, checked early and explained. */
    validate(record) {
      const errors = {};
      if (record.source_visibility !== 'public' && record.repository_url) {
        errors.repository_url =
          'A private or unavailable project must not carry a repository URL — it would render a link that 404s, and the database rejects it.';
      }
      if (record.source_visibility === 'public' && !record.repository_url) {
        errors.repository_url = 'A public project should link its repository.';
      }
      if (record.featured_rank !== null && record.featured_rank !== undefined && Number(record.featured_rank) <= 0) {
        errors.featured_rank = 'Featured rank has to be greater than zero.';
      }
      return errors;
    },
  },

  // ─────────────────────────────── Technologies ───────────────────────────────
  technologies: {
    table: 'technologies',
    section: 'skills',
    label: 'Technology',
    plural: 'Skills',
    publishable: true,
    titleField: 'name',
    order: 'category.asc,sort_order.asc,name.asc',
    listFields: ['name', 'slug', 'category'],
    searchFields: ['name', 'slug', 'category'],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      slugField(),
      { name: 'category', label: 'Category', type: 'text', required: true, help: 'Languages, Frontend, Backend, AI, Security, Mobile, Systems, Research, Infrastructure, Developer Tools' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      {
        name: 'evidence',
        label: 'Evidence',
        type: 'json',
        contract: validateTechnologyEvidence,
        rows: 10,
        help: 'Array of { kind: "project" | "contribution" | "research", ref, label, note }. A technology with no evidence is a label — save will refuse it.',
        placeholder: '[\n  { "kind": "project", "ref": "veripatch", "label": "VeriPatch" }\n]',
      },
      sortField,
    ],
  },

  // ─────────────────────────────── Research ───────────────────────────────
  research_projects: {
    table: 'research_projects',
    section: 'research',
    label: 'Research record',
    plural: 'Research',
    publishable: true,
    titleField: 'title',
    order: 'sort_order.asc,title.asc',
    listFields: ['title', 'slug', 'status'],
    searchFields: ['title', 'slug', 'summary'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField(),
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 3 },
      {
        name: 'status',
        label: 'Status',
        type: 'text',
        help: 'No database constraint on this column — keep it to the canonical set: active, complete, architecture-stage, paused.',
      },
      {
        name: 'project_id',
        label: 'Linked project',
        type: 'reference',
        referenceTable: 'portfolio_projects',
        referenceLabel: 'title',
        help: 'Optional. The product-side record this research belongs to.',
      },
      {
        name: 'methodology',
        label: 'Methodology',
        type: 'json',
        contract: validateResearchMethodology,
        rows: 10,
        help: 'question, hypothesis, method, dataset, design, publicStage, category.',
      },
      {
        name: 'results',
        label: 'Results',
        type: 'json',
        contract: validateResearchResults,
        rows: 14,
        help: 'summary, findings[] (each with its interpretation), and the experiment grid. A measured value without an interpretation is refused.',
      },
      {
        name: 'corrections',
        label: 'Corrections',
        type: 'json',
        contract: (value) => validateResearchList(value, 'corrections'),
        rows: 8,
        help: 'Array of { text, date }. A correction needs the date it was published.',
      },
      {
        name: 'limitations',
        label: 'Limitations',
        type: 'json',
        contract: (value) => validateResearchList(value, 'limitations'),
        rows: 8,
        help: 'Array of { text }. What the work does not establish.',
      },
      {
        name: 'future_work',
        label: 'Future work',
        type: 'json',
        contract: (value) => validateResearchList(value, 'future_work'),
        rows: 8,
        help: 'Array of { text, done }. Anything not done stays false — that is what keeps "not run" visible.',
      },
      {
        name: 'disclosure_notes',
        label: 'Disclosure',
        type: 'textarea',
        rows: 4,
        help: 'What is deliberately not published, and on what basis.',
      },
      sortField,
      seoField,
    ],
  },

  // ────────────────────────── Open source ──────────────────────────
  open_source_contributions: {
    table: 'open_source_contributions',
    section: 'open-source',
    label: 'Contribution',
    plural: 'Open Source',
    publishable: true,
    titleField: 'title',
    order: 'sort_order.asc,merged_at.desc',
    listFields: ['title', 'repository', 'pr_number', 'status'],
    searchFields: ['title', 'repository', 'summary'],
    fields: [
      { name: 'repository', label: 'Repository', type: 'text', required: true, help: 'owner/repo' },
      { name: 'pr_number', label: 'PR number', type: 'number', required: true },
      { name: 'pr_url', label: 'PR URL', type: 'url', required: true, help: 'Unique. Must match the repository and number.' },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 3 },
      { name: 'status', label: 'Status', type: 'select', options: CONTRIBUTION_STATUSES },
      { name: 'merged_at', label: 'Merged at', type: 'datetime', help: 'Only for merged requests. Anything else must leave this empty.' },
      { name: 'contribution_date', label: 'Opened', type: 'date' },
      { name: 'technical_areas', label: 'Technical areas', type: 'tags' },
      {
        name: 'verification',
        label: 'Verification',
        type: 'json',
        contract: validateContributionVerification,
        rows: 12,
        help: 'problem, change, checks[], issueRef, languages[], verifiedAsOf, diff { files, additions, deletions, paths[] }.',
      },
      sortField,
    ],
    validate(record) {
      const errors = {};
      if (record.status !== 'merged' && record.merged_at) {
        errors.merged_at = 'Only a merged request has a merge date. Showing one on an open request claims an outcome that has not happened.';
      }
      if (record.status === 'merged' && !record.merged_at) {
        errors.merged_at = 'A merged request needs its merge date.';
      }
      if (record.pr_url && record.repository && record.pr_number) {
        const expected = `${record.repository}/pull/${record.pr_number}`;
        if (!String(record.pr_url).includes(expected)) {
          errors.pr_url = `That URL does not point at ${expected}.`;
        }
      }
      return errors;
    },
  },

  // ─────────────────────────────── Credentials ───────────────────────────────
  credentials: {
    table: 'credentials',
    section: 'credentials',
    label: 'Credential',
    plural: 'Credentials',
    publishable: true,
    titleField: 'title',
    order: 'sort_order.asc,issued_at.desc',
    listFields: ['title', 'issuer', 'issued_at'],
    searchFields: ['title', 'issuer', 'slug'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField(),
      { name: 'issuer', label: 'Issuer', type: 'text', required: true, help: 'Who actually issued it. Not every credential is from the same place.' },
      { name: 'issued_at', label: 'Issued', type: 'date' },
      { name: 'credential_url', label: 'Verification URL', type: 'url' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'featured', label: 'Featured', type: 'boolean', help: 'Shown in the selected set on /about.' },
      sortField,
    ],
  },

  // ─────────────────────────────── Experience ───────────────────────────────
  experience: {
    table: 'experience',
    section: 'experience',
    label: 'Experience entry',
    plural: 'Experience',
    publishable: true,
    titleField: 'title',
    order: 'sort_order.asc,started_at.desc',
    listFields: ['title', 'organization', 'started_at'],
    searchFields: ['title', 'organization'],
    fields: [
      { name: 'organization', label: 'Organisation', type: 'text', required: true },
      { name: 'title', label: 'Role', type: 'text', required: true },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 4,
        help: 'Documented work only. A personal project is not employment, and putting one here would be inventing a job.',
      },
      { name: 'started_at', label: 'Started', type: 'date' },
      { name: 'ended_at', label: 'Ended', type: 'date', help: 'Leave empty if ongoing.' },
      { name: 'location', label: 'Location', type: 'text' },
      {
        name: 'evidence',
        label: 'Evidence',
        type: 'json',
        contract: validateExperienceEvidence,
        rows: 8,
        help: 'Array of { label, detail, url }.',
      },
      sortField,
    ],
    validate(record) {
      const errors = {};
      if (record.started_at && record.ended_at && record.ended_at < record.started_at) {
        errors.ended_at = 'The end date is before the start date.';
      }
      return errors;
    },
  },

  // ─────────────────────────────── Site content ───────────────────────────────
  site_content: {
    table: 'site_content',
    section: 'content',
    label: 'Content section',
    plural: 'Site Content',
    publishable: true,
    titleField: 'content_key',
    order: 'page_slug.asc,content_key.asc',
    listFields: ['content_key', 'page_slug'],
    searchFields: ['content_key', 'page_slug'],
    fields: [
      {
        name: 'content_key',
        label: 'Key',
        type: 'text',
        required: true,
        help: 'Stable identifier the page reads by, e.g. home.intro. Unique.',
      },
      { name: 'page_slug', label: 'Page', type: 'text', help: 'home, about, work…' },
      {
        name: 'content',
        label: 'Content',
        type: 'json',
        contract: validateSiteContent,
        rows: 16,
        help: 'title, lede, and blocks[] of heading | paragraph | list | stat | link | note. There is deliberately no html block — anything else is dropped on save.',
        placeholder: '{\n  "title": "",\n  "lede": "",\n  "blocks": [\n    { "type": "paragraph", "text": "" }\n  ]\n}',
      },
      seoField,
    ],
  },
};

/** Media is managed by its own screen but shares the field vocabulary. */
export const MEDIA_FIELDS = [
  { name: 'alt_text', label: 'Alt text', type: 'text', help: 'What the image conveys. Empty only if it is purely decorative.' },
  { name: 'caption', label: 'Caption', type: 'text' },
  { name: 'media_type', label: 'Type', type: 'select', options: MEDIA_TYPES },
];

export function schemaForSection(section) {
  return Object.values(TABLE_SCHEMAS).find((schema) => schema.section === section) ?? null;
}

export const CMS_SECTIONS = Object.values(TABLE_SCHEMAS).map((schema) => schema.section);

/** A blank record with the database's own defaults, so a new row round-trips. */
export function emptyRecord(schema) {
  const record = {};
  for (const field of schema.fields) {
    switch (field.type) {
      case 'tags':
        record[field.name] = [];
        break;
      case 'boolean':
        record[field.name] = false;
        break;
      case 'number':
        record[field.name] = field.name === 'sort_order' ? 0 : null;
        break;
      case 'json':
        record[field.name] = field.name === 'evidence' || field.name.endsWith('s') ? [] : {};
        break;
      default:
        record[field.name] = '';
    }
  }
  // Mirror the column defaults rather than leaving them blank, so the editor
  // shows what will actually be stored.
  if (schema.table === 'portfolio_projects') {
    record.status = 'prototype';
    record.tier = 'secondary';
    record.source_visibility = 'unavailable';
  }
  if (schema.table === 'open_source_contributions') record.status = 'open';
  if (schema.table === 'site_content') record.page_slug = 'home';
  return record;
}
