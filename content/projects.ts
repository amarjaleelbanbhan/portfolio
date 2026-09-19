import type { Project } from './types';

/**
 * Canonical project registry.
 *
 * Rules this file must keep (enforced by `npm run validate:content`):
 *  - `slug` is identity. Display titles may change freely; slugs must not.
 *  - `status` is evidence-backed. See docs/portfolio-2026/content-audit.md.
 *  - `tier` is portfolio importance and is independent of `status`.
 *  - private/unavailable sources carry no repositoryUrl and no repository link.
 *  - every `proof` entry shown publicly is `verified: true` and was checked
 *    against a primary source on `asOf`.
 */
export const projects: Project[] = [
  // ───────────────────────────── Flagship ─────────────────────────────
  {
    id: 'prj-rodift',
    slug: 'rodift',
    title: 'RODIFT',
    shortTitle: 'RODIFT',
    summary:
      'Enterprise field issue-reporting platform for a field-sales organization. Staff report outlet problems from a mobile app; each issue is geo-matched to the nearest outlet, routed through the org role hierarchy, and driven to resolution with push notifications and an auditable trail. A web dashboard gives management oversight.',
    tier: 'flagship',
    status: 'production',
    domains: ['product', 'systems'],
    featured: true,
    featuredRank: 1,
    sortOrder: 1,
    updatedAt: '2026-08-08',
    role: 'Sole engineer — mobile app, web dashboard, backend and database design.',
    problem:
      'Field staff had no reliable way to report outlet problems, and management had no view of what was outstanding.',
    limitations: [
      'Client-owned system; the repository and operational data cannot be made public.',
    ],
    technologies: ['flutter', 'dart', 'nextjs', 'supabase', 'postgresql', 'postgis', 'sql'],
    tags: ['Flutter', 'Next.js', 'Supabase', 'PostgreSQL', 'PostGIS', 'FCM'],
    links: {
      privacyPolicy: 'https://amarjaleelbanbhan.github.io/rodift-privacy-policy/',
    },
    source: { visibility: 'private', label: 'Private repository' },
    note: 'Client project — repository private.',
    // Case-study material below is derived from the project's own source-derived
    // engineering README, reviewed 2026-09-19. Every claim here appears in that
    // document. The client is not named, and no internal identifier, project
    // reference, credential or operational datum is reproduced.
    caseStudy: {
      context:
        'A distribution and field-sales organisation runs thousands of retail outlets across a multi-level territory hierarchy. When something was wrong at an outlet there was no structured way to capture it with photo and GPS proof from the field, work out which outlet and which responsible people it belonged to, and drive it to resolution with an audit trail.',
      constraints: [
        'Field staff report from phones in the field, so location has to come from the device and be trusted only after the server re-checks it.',
        'The organisation hierarchy is the routing logic: an issue has to reach the right people through the chain of command with no manual triage.',
        'Two audiences with different needs — an operational mobile app for field roles, and a management dashboard on the web. The field-only role is deliberately blocked from the web entirely.',
        'The client reduced the web scope mid-project; user, outlet and area administration modules were removed from the dashboard.',
        'No email or SMS channel was available for account recovery, which forced an in-app approval design rather than a reset link.',
      ],
      built:
        'A Flutter mobile app for the seven operational roles, a Next.js management dashboard, and a Supabase backend that holds the business logic. Reporting an issue captures a photo and GPS position, matches it to the nearest outlet, resolves the responsible people from the organisation hierarchy, and drives the issue to resolution with push and in-app notifications over an immutable audit trail.',
      architecture: {
        summary:
          'Two clients over one Supabase backend. Business logic lives in Deno edge functions and SQL rather than in either client, so the mobile app and the dashboard cannot disagree about who owns an issue.',
        nodes: [
          { id: 'mobile', label: 'Flutter app', kind: 'client', detail: 'Field reporting, 7 roles' },
          { id: 'web', label: 'Next.js dashboard', kind: 'client', detail: 'Management oversight' },
          { id: 'cron', label: 'pg_cron', kind: 'process', detail: 'Reminder scheduler' },
          { id: 'edge', label: 'Edge functions', kind: 'service', detail: 'Deno, business logic' },
          { id: 'auth', label: 'Auth + RLS', kind: 'service', detail: 'Roles and row scoping' },
          { id: 'db', label: 'PostgreSQL + PostGIS', kind: 'data', detail: 'Geo and hierarchy' },
          { id: 'storage', label: 'Object storage', kind: 'data', detail: 'Issue photos' },
          { id: 'fcm', label: 'Push delivery', kind: 'external', detail: 'FCM HTTP v1' },
        ],
        flows: [
          { from: 'mobile', to: 'edge', label: 'report' },
          { from: 'web', to: 'edge', label: 'manage' },
          { from: 'cron', to: 'edge', label: 'reminders' },
          { from: 'mobile', to: 'storage', label: 'photo' },
          { from: 'edge', to: 'auth', label: 'authorize' },
          { from: 'edge', to: 'db', label: 'assign' },
          { from: 'edge', to: 'fcm', label: 'notify' },
        ],
        caveat:
          'Sanitized architecture of a private client system, drawn from the project documentation. It shows implemented components and their relationships; it is not a screenshot, and no client data, identifiers or configuration are shown.',
      },
      decisions: [
        {
          id: 'rodift-hierarchy-in-model',
          title: 'Encode the organisation hierarchy in the data model',
          decision:
            'The geography (area, territory, distribution, outlet) and the chain of command are modelled as first-class data rather than handled by assignment rules in application code.',
          rationale:
            'Reporting an issue can then resolve the responsible people automatically, so no one triages a queue by hand and the routing cannot drift between the two clients.',
          tradeoff:
            'The model is rigid: an organisational restructure is a data migration, not a configuration change.',
        },
        {
          id: 'rodift-server-revalidation',
          title: 'Re-validate the client-chosen outlet on the server',
          decision:
            'When the app confirms which outlet an issue belongs to, the create-issue function independently re-checks that the outlet exists, is active and is within range before trusting it, and the accuracy value reported by the device cannot widen the acceptance radius beyond a server-side cap.',
          rationale:
            'GPS position and accuracy come from a device in someone else\'s hands. Treating either as authoritative would let a report be attached to the wrong outlet.',
          tradeoff:
            'A genuine report from a position with poor accuracy can be rejected and has to be retried.',
        },
        {
          id: 'rodift-defense-in-depth',
          title: 'Three layers of authorization rather than one',
          decision:
            'Access is enforced at row-level security, in SQL functions, and again in the edge functions, with role hierarchy and territory scoping applied at each layer.',
          rationale:
            'Two clients and a scheduler all reach the same data. A single enforcement point would mean any one of them bypassing it becomes a full authorization bypass.',
          tradeoff:
            'A permission change usually has to be made in more than one place, and the layers have to be kept consistent.',
        },
        {
          id: 'rodift-recovery-without-email',
          title: 'Human-approved account recovery instead of a reset link',
          decision:
            'Password resets are approved by a person in the hierarchy and completed in-app on the requesting device using a one-time hashed token, with a single pending request, a cooldown and attempt caps.',
          rationale:
            'There was no email or SMS channel available, so the usual reset-link flow was not an option.',
          tradeoff:
            'Recovery depends on an approver being available, and reinstalling the app or changing device means starting a new request.',
        },
        {
          id: 'rodift-anti-enumeration',
          title: 'Make the recovery endpoint unable to confirm an account exists',
          decision:
            'An unknown login, an ineligible account, an active cooldown and an already-pending request all return a response identical in shape and status to a genuine new request.',
          rationale:
            'A recovery endpoint that answers differently for real and fake accounts is an account-enumeration oracle, and this one is reachable without logging in.',
          tradeoff:
            'A user who mistypes their login gets an apparently successful response and has to wait for an approval that will never arrive.',
        },
      ],
      concerns: [
        {
          id: 'rodift-secrets',
          title: 'Privileged keys stay server-side',
          detail:
            'The service-role key is confined to server-side API routes, edge functions and the scheduler vault. It is never shipped in the browser bundle or the mobile app.',
        },
        {
          id: 'rodift-enumeration',
          title: 'Bulk enumeration of the outlet master',
          detail:
            'Nearby-outlet lookups are scoped to the caller\'s own territory or area for field roles, so the endpoint cannot be walked to extract the full outlet list.',
        },
        {
          id: 'rodift-audit',
          title: 'Immutable audit trail',
          detail:
            'Audit logs and the issue timeline are append-only, so the resolution history of an issue cannot be rewritten after the fact.',
        },
        {
          id: 'rodift-photos',
          title: 'Issue photos are URL-addressable',
          detail:
            'Photos live in a public bucket and are reachable by anyone holding the URL. This is a deliberate trade for delivery simplicity and is recorded as such rather than presented as access control.',
        },
      ],
      verification: [
        {
          id: 'rodift-logic-tests',
          label: 'Pure-logic assignment and escalation proofs',
          detail:
            'Two standalone suites check outlet-based assignment and the reset-approver hierarchy and escalation without touching a database — 7 and 15 checks respectively.',
          verified: true,
        },
        {
          id: 'rodift-integration',
          label: 'Integration suite with a production-safe default',
          detail:
            'A pytest suite runs against a Supabase project. Data-mutating tests are marked and skipped unless explicitly enabled, so the default run cannot write to production.',
          verified: true,
        },
        {
          id: 'rodift-static',
          label: 'Static checks across all three tiers',
          detail:
            'TypeScript compilation for the web app, deno check for edge functions, and flutter analyze for the mobile app.',
          verified: true,
        },
        {
          id: 'rodift-release',
          label: 'Tagged release',
          detail:
            'A v2.0.0 release tag exists in the private repository, and a public privacy policy is published as required for mobile store distribution.',
          verified: true,
        },
      ],
      results: [
        'Reporting an issue resolves the responsible people automatically from the hierarchy, replacing manual triage.',
        'A route-matching defect that caused all four routes of the reporting function to return 404 was found and fixed, and the fix was verified against a running environment.',
        'Report aggregation was paginating at a fixed 200 rows, which silently under-counted once an organisation passed that many matching issues; it now pages through the full result set.',
      ],
      timeline: [
        {
          id: 'rodift-v2',
          label: 'v2.0.0 tagged',
          detail: 'Release tag in the private repository.',
        },
        {
          id: 'rodift-rebrand',
          label: 'Product rebrand',
          detail:
            'The product was renamed in July 2026. Backend identifiers already baked into production accounts and devices were deliberately left unchanged, because renaming them would have broken existing logins or forced a reinstall on every device.',
          date: '2026-07',
        },
        {
          id: 'rodift-privacy',
          label: 'Privacy policy published',
          detail: 'A prerequisite for mobile store distribution.',
        },
      ],
      disclosure:
        'This is client-owned work. The repository, the client, the operational data and the deployment configuration are not public, and nothing on this page reproduces them. What is shown is the architecture, the engineering decisions and the verification approach, described from the project documentation. No usage figures, user counts or business outcomes are claimed, because none are available to publish.',
    },
    proof: [
      {
        id: 'rodift-release-v2',
        type: 'production-release',
        label: 'Tagged release v2.0.0',
        value: 'v2.0.0',
        description: 'Release tag in the private repository.',
        verified: true,
        asOf: '2026-09-18',
      },
      {
        id: 'rodift-privacy-policy',
        type: 'deployment',
        label: 'Published privacy policy',
        description:
          'Live policy published for mobile store distribution, a prerequisite for release.',
        sourceUrl: 'https://amarjaleelbanbhan.github.io/rodift-privacy-policy/',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'prj-veripatch',
    slug: 'veripatch',
    title: 'VeriPatch',
    summary:
      'Verified remediation for npm vulnerabilities. Scans a project, applies candidate fixes inside a sandbox, proves the vulnerability is eliminated and the fix is safe, then emits an audit-grade evidence report.',
    tier: 'flagship',
    status: 'released',
    domains: ['security', 'open-source'],
    featured: true,
    featuredRank: 2,
    sortOrder: 2,
    updatedAt: '2026-08-04',
    role: 'Author and maintainer.',
    problem:
      'Dependency auto-fixes are applied on trust: nothing proves the vulnerability is gone or that the fix did not break the project.',
    technologies: ['typescript', 'nodejs', 'docker', 'cli'],
    tags: ['TypeScript', 'Node.js', 'CLI', 'Docker', 'Security'],
    links: {
      repository: 'https://github.com/amarjaleelbanbhan/VeriPatch',
      package: 'https://www.npmjs.com/package/veripatch',
    },
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/VeriPatch',
    },
    note: 'Published on npm (v0.3.1).',
    proof: [
      {
        id: 'veripatch-npm',
        type: 'package-release',
        label: 'Published on npm',
        value: 'v0.3.1',
        description: 'Five versions published to the npm registry.',
        sourceUrl: 'https://www.npmjs.com/package/veripatch',
        verified: true,
        asOf: '2026-09-18',
      },
      {
        id: 'veripatch-releases',
        type: 'production-release',
        label: 'GitHub releases',
        value: '9 releases',
        sourceUrl: 'https://github.com/amarjaleelbanbhan/VeriPatch/releases',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'prj-knowledgeguard',
    slug: 'knowledgeguard',
    title: 'KnowledgeGuard / EGB',
    shortTitle: 'KnowledgeGuard',
    summary:
      'A controlled study asking whether a RAG system can tell how its retrieved evidence is deficient — missing, insufficient, conflicting, outdated, or absent from the corpus — and whether that diagnosis carries actionable information for selecting a repair action.',
    tier: 'flagship',
    status: 'research',
    domains: ['ai', 'research'],
    featured: true,
    featuredRank: 3,
    sortOrder: 3,
    updatedAt: '2026-09-17',
    technologies: ['python', 'rag', 'evaluation'],
    tags: ['Python', 'RAG', 'Evaluation', 'Experiment Design'],
    links: {},
    source: { visibility: 'private', label: 'Private repository' },
    note: 'Benchmark built, factorial executed, analysis complete. Repository private.',
    researchSlug: 'knowledgeguard',
    proof: [
      {
        id: 'knowledgeguard-study',
        type: 'research-result',
        label: 'Factorial experiment executed',
        description:
          'Benchmark built on real data, the factorial experiment run, and analysis completed.',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'prj-cortexward',
    slug: 'cortexward',
    title: 'CortexWard',
    summary:
      'An AI software-security engineer that understands, verifies, fixes, and secures code. Runs a multi-scanner and agent pipeline with a closed verification loop rather than reporting unverified findings.',
    tier: 'flagship',
    status: 'pre-alpha',
    domains: ['security', 'ai'],
    featured: true,
    featuredRank: 4,
    sortOrder: 4,
    updatedAt: '2026-09-18',
    limitations: [
      'Pre-alpha. The core scan and verification loop runs, but the project is not ready for general use.',
    ],
    technologies: ['python', 'docker', 'static-analysis', 'llm-agents'],
    tags: ['Python', 'Static Analysis', 'Sandboxing', 'LLM Agents'],
    links: {
      repository: 'https://github.com/amarjaleelbanbhan/CortexWard',
    },
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/CortexWard',
    },
    note: 'Pre-alpha, per the project’s own status badge.',
    researchSlug: 'cortexward-verification',
    proof: [
      {
        id: 'cortexward-public',
        type: 'demo',
        label: 'Public repository with a running scan pipeline',
        sourceUrl: 'https://github.com/amarjaleelbanbhan/CortexWard',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'prj-sceneforge',
    slug: 'sceneforge',
    title: 'SceneForge',
    summary:
      'Turns a JSON manifest of HTML/CSS/JS scenes into a single MP4, scene by scene. Headless Chrome renders frames, FFmpeg composes them, and a React/Monaco editor drives it. Runs entirely locally — no cloud APIs, no uploads.',
    tier: 'flagship',
    status: 'active-development',
    domains: ['systems', 'product'],
    featured: true,
    featuredRank: 5,
    sortOrder: 5,
    updatedAt: '2026-08-16',
    technologies: ['javascript', 'react', 'ffmpeg', 'headless-chrome', 'nodejs'],
    tags: ['JavaScript', 'Express', 'Headless Chrome', 'FFmpeg', 'React'],
    links: {},
    source: { visibility: 'private', label: 'Private repository' },
    note: 'Repository private.',
    proof: [],
  },

  // ───────────────────────────── Secondary ─────────────────────────────
  {
    id: 'prj-emergency-mesh',
    slug: 'emergency-mesh',
    title: 'Emergency Mesh',
    summary:
      'Offline emergency communication. Phones exchange messages directly over Bluetooth Low Energy, relaying for each other, with no internet, no cell service and no server anywhere in the path.',
    tier: 'secondary',
    status: 'active-development',
    domains: ['systems', 'security'],
    featured: false,
    sortOrder: 1,
    updatedAt: '2026-08-13',
    limitations: [
      'Protocol, routing, cryptography, persistence and the native BLE transport are built and tested, but the user interface is at an early stage.',
      'Not yet installable as a finished product, and not suitable for real emergencies.',
    ],
    technologies: ['flutter', 'dart', 'kotlin', 'ble', 'cryptography'],
    tags: ['Flutter', 'Dart', 'Kotlin', 'BLE', 'Cryptography'],
    links: {},
    source: { visibility: 'private', label: 'Private repository' },
    note: 'Protocol, routing, crypto and BLE transport built and tested; UI just starting. Not yet installable as a finished product, and not suitable for real emergencies. Repository private.',
    researchSlug: 'emergency-mesh-protocol',
    proof: [],
  },
  {
    id: 'prj-cs-learning-game',
    slug: 'cs-learning-game',
    title: 'CS Learning by Game',
    summary:
      'AI-powered computer science education engine — an interactive automata theory (DFA/NFA) visualizer with step-by-step simulation and gamified mission progression.',
    tier: 'secondary',
    status: 'active-development',
    domains: ['product', 'ai'],
    featured: false,
    sortOrder: 2,
    updatedAt: '2026-08-15',
    technologies: ['typescript', 'nextjs'],
    tags: ['TypeScript', 'Next.js', 'Automata Theory', 'Monorepo'],
    links: { repository: 'https://github.com/amarjaleelbanbhan/CS-learning-by-game' },
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/CS-learning-by-game',
    },
    proof: [],
  },
  {
    id: 'prj-buildsphere',
    slug: 'buildsphere',
    title: 'BuildSphere',
    summary:
      'Browser-based 3D floor planner. Draft walls, add furniture, and export a layout, with save/load and undo/redo. Built with Next.js and React Three Fiber.',
    tier: 'secondary',
    status: 'prototype',
    domains: ['product'],
    featured: false,
    sortOrder: 3,
    updatedAt: '2026-07-04',
    technologies: ['javascript', 'nextjs', 'webgl'],
    tags: ['Next.js', 'React Three Fiber', 'WebGL', 'JavaScript'],
    links: { repository: 'https://github.com/amarjaleelbanbhan/BuildSphere' },
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/BuildSphere',
    },
    proof: [],
  },
  {
    id: 'prj-todo-tracker-pro',
    slug: 'todo-tracker-pro',
    title: 'TODO Tracker Pro',
    summary:
      'VS Code extension that surfaces every TODO, FIXME and HACK comment in a codebase through a sidebar panel, with optional Gemini-backed priority triage.',
    tier: 'secondary',
    status: 'completed',
    domains: ['product'],
    featured: false,
    sortOrder: 4,
    updatedAt: '2026-07-04',
    limitations: ['Not published to the VS Code Marketplace.'],
    technologies: ['typescript'],
    tags: ['TypeScript', 'VS Code API', 'Developer Tools'],
    links: { repository: 'https://github.com/amarjaleelbanbhan/todo-tracker-pro' },
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/todo-tracker-pro',
    },
    note: 'Not published to the VS Code Marketplace.',
    proof: [],
  },

  // ─────────────────────────── Current FYP ───────────────────────────
  {
    id: 'prj-scar-os',
    slug: 'scar-os',
    title: 'SCAR-OS',
    summary:
      'Integrating voice and intent-driven interaction into a developer-oriented operating environment. Final-year project, currently at the research and architecture stage — no implementation yet.',
    tier: 'current-fyp',
    status: 'research',
    domains: ['research', 'systems'],
    featured: false,
    sortOrder: 1,
    updatedAt: '2026-08-31',
    limitations: ['No implementation yet. The repository contains a README only.'],
    technologies: [],
    tags: ['Research', 'Operating Systems', 'Voice Interaction', 'HCI'],
    links: {},
    source: { visibility: 'private', label: 'Private repository' },
    note: 'Current FYP — Research & Architecture Stage.',
    // The GitHub repository is still named VICE-OS; it is private, so no URL is
    // published and the old name is not visible anywhere public.
    researchSlug: 'scar-os',
    proof: [],
  },

  // ───────────────────────────── Archive ─────────────────────────────
  {
    id: 'prj-zakatlink',
    slug: 'zakatlink',
    title: 'ZakatLink',
    summary:
      'Full-stack Zakat management platform with role-based auth and beneficiary tracking, connecting donors and recipients.',
    tier: 'archive',
    status: 'archived',
    domains: ['product'],
    featured: false,
    sortOrder: 1,
    updatedAt: '2026-01-07',
    technologies: ['typescript', 'react', 'nodejs', 'postgresql', 'sql'],
    tags: ['Node.js', 'TypeScript', 'React', 'PostgreSQL'],
    links: { repository: 'https://github.com/amarjaleelbanbhan/ZakatLink' },
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/ZakatLink',
    },
    proof: [],
  },
  {
    id: 'prj-meditalk',
    slug: 'meditalk',
    title: 'MediTalk',
    summary:
      'Educational machine-learning prototype: a voice interface over a symptom-classification model. Built to explore speech interfaces and ML classification together. It was never clinically validated and was never intended for medical use.',
    tier: 'archive',
    status: 'archived',
    domains: ['ai'],
    featured: false,
    sortOrder: 2,
    updatedAt: '2026-07-04',
    limitations: [
      'Never clinically validated. Not a diagnostic tool and never intended for medical use.',
    ],
    technologies: ['python'],
    tags: ['Python', 'Machine Learning', 'Flask', 'Streamlit'],
    links: { repository: 'https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent' },
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent',
    },
    note: 'Historical prototype. Not a diagnostic tool.',
    proof: [],
  },
  {
    id: 'prj-smart-notebook',
    slug: 'smart-notebook',
    title: 'Smart Notebook',
    summary:
      'Note-taking experiment that generates Mermaid.js diagrams from plain text, turning written notes into structured visuals.',
    tier: 'archive',
    status: 'archived',
    domains: ['product', 'ai'],
    featured: false,
    sortOrder: 3,
    updatedAt: '2026-07-04',
    technologies: ['javascript', 'nextjs'],
    tags: ['Next.js', 'Mermaid.js', 'OpenAI'],
    links: { repository: 'https://github.com/amarjaleelbanbhan/Smart-Notebook' },
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/Smart-Notebook',
    },
    proof: [],
  },
  {
    id: 'prj-eduresource-hub',
    slug: 'eduresource-hub',
    title: 'EduResource Hub',
    summary:
      'Static catalogue of free educational resources with client-side search and filtering, and no runtime dependencies.',
    tier: 'archive',
    status: 'archived',
    domains: ['product'],
    featured: false,
    sortOrder: 4,
    updatedAt: '2026-07-04',
    technologies: ['javascript', 'html-css'],
    tags: ['JavaScript', 'HTML5', 'CSS3', 'GitHub Pages'],
    links: {
      repository: 'https://github.com/amarjaleelbanbhan/EduResource_Hub',
      demo: 'https://amarjaleelbanbhan.github.io/EduResource_Hub/',
    },
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/EduResource_Hub',
    },
    proof: [],
  },
];
