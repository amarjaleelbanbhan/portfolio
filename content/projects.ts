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
    limitations: [
      'Network isolation is bridge-level, not domain-level: during the install phase the container has general egress, so the real defence against a malicious postinstall is that lifecycle scripts are disabled, not the network boundary.',
      'A confidence verdict reflects the project\'s own build and test commands exiting successfully, not whether those checks are honest. The re-scan independently confirms the vulnerability is gone; it does not re-verify the project\'s test assertions.',
      'Docker containers share the host kernel, so a container-escape vulnerability in the runtime itself is outside what this can mitigate.',
      'Verification and update replay fixes with npm; yarn and pnpm projects are refused rather than risking lockfile corruption.',
    ],
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
    // Derived from the public repository, its README, docs/SECURITY.md and the
    // npm registry, reviewed 2026-09-19. Every claim below appears in that
    // source material, including the residual risks, which the project documents
    // itself and this page reproduces rather than softening.
    caseStudy: {
      context:
        'Dependency scanners produce a queue of advisories and an automated fix command. What neither produces is evidence: after the bump, nothing has checked that the vulnerable package is actually gone from the resolved tree, or that the project still builds. The fix is applied on trust.',
      constraints: [
        'The code being verified is attacker-controlled input. A package.json, a lockfile or an installed package can be crafted to attack the parser or to run code during install.',
        'Verification has to execute the project\'s own install, build and test commands, which means running untrusted code on a developer machine or a CI runner.',
        'Advisory data arrives over the network from a third party and cannot be trusted blindly.',
        'The original working tree must never be modified by a verification run.',
        'It has to be usable in CI, which means deterministic exit codes and machine-readable output rather than log text.',
      ],
      built:
        'A TypeScript CLI, published on npm under Apache-2.0, that scans a lockfile against OSV.dev, ranks findings by severity against fix feasibility, applies a candidate remediation to a staged copy of the project inside a hardened Docker sandbox, independently re-scans the resolved dependency tree, runs the build and tests, and emits a Markdown and JSON evidence report describing what was actually observed.',
      architecture: {
        summary:
          'Two paths from one CLI: a read-only scan that produces a ranked queue, and a verification run that executes inside a container and ends in an evidence report. The verdict comes from exit codes and an independent re-scan, never from parsing log text.',
        nodes: [
          { id: 'cli', label: 'VeriPatch CLI', kind: 'client', detail: 'Node 20+, commander' },
          { id: 'lockfile', label: 'Lockfile parser', kind: 'process', detail: 'npm, yarn, pnpm' },
          { id: 'osv', label: 'OSV.dev', kind: 'external', detail: 'Advisory intelligence' },
          { id: 'rules', label: 'Rule engine', kind: 'service', detail: 'Ranking and fix resolver' },
          { id: 'stage', label: 'Staged copy', kind: 'process', detail: 'Excludes .git and .env' },
          { id: 'sandbox', label: 'Docker sandbox', kind: 'service', detail: 'Non-root, caps dropped' },
          { id: 'rescan', label: 'Independent re-scan', kind: 'process', detail: 'Resolved tree' },
          { id: 'report', label: 'Evidence report', kind: 'data', detail: 'Markdown and JSON' },
        ],
        flows: [
          { from: 'cli', to: 'lockfile', label: 'parse' },
          { from: 'lockfile', to: 'osv', label: 'query' },
          { from: 'osv', to: 'rules', label: 'advisories' },
          { from: 'rules', to: 'stage', label: 'candidate fix' },
          { from: 'stage', to: 'sandbox', label: 'mount copy' },
          { from: 'sandbox', to: 'rescan', label: 'resolved tree' },
          { from: 'rescan', to: 'report', label: 'verdict' },
        ],
        caveat:
          'Architecture as described in the project\'s own documentation. The repository is public, so this can be checked directly against the source rather than taken on trust.',
      },
      decisions: [
        {
          id: 'veripatch-rescan-not-logs',
          title: 'Decide from an independent re-scan, never from log text',
          decision:
            'A verification verdict is computed from process exit codes, an independent re-scan of the resolved dependency tree, the build result and the test result. No decision is made by matching strings in output.',
          rationale:
            'Log-text heuristics are what make a tool confidently wrong. Re-scanning the tree checks the thing that actually matters — whether the vulnerable package is still resolved — instead of whether the fixer said it succeeded.',
          tradeoff:
            'A re-scan and a full install cost far more time than reading a fixer\'s output, so verification is measured in minutes rather than seconds.',
        },
        {
          id: 'veripatch-ignore-scripts',
          title: 'Install with lifecycle scripts disabled',
          decision:
            'The sandboxed install runs with lifecycle scripts disabled, so a malicious postinstall in a scanned or bumped dependency never executes at all.',
          rationale:
            'Install-time script execution is the actual attack path for a hostile package. Disabling it removes the vector rather than trying to contain it after it runs.',
          tradeoff:
            'Packages that genuinely need a postinstall step — native builds, for example — will not be exercised the way they would be in a real install.',
        },
        {
          id: 'veripatch-same-package',
          title: 'A fix can only ever be a version bump of the same package',
          decision:
            'The fix resolver enforces structurally that a remediation is a version change to the same package, never a substitution with a different one, and the invariant is covered by property-based tests.',
          rationale:
            'Advisory data comes from the network. If poisoned data could name a replacement package, the tool would become a delivery mechanism for dependency confusion.',
          tradeoff:
            'A vulnerability whose only real remedy is switching to a different package cannot be remediated automatically; it has to be reported and handled by a person.',
        },
        {
          id: 'veripatch-refuse-yarn-pnpm',
          title: 'Refuse to verify yarn and pnpm projects rather than guess',
          decision:
            'Scanning supports npm, yarn classic, yarn berry and pnpm lockfiles, but verify and update replay fixes with npm only. Yarn and pnpm projects are explicitly refused instead of being attempted.',
          rationale:
            'Replaying an npm fix into a yarn or pnpm lockfile risks corrupting it. Refusing is honest about the tool\'s reach; attempting it would trade a clear limitation for a silent one.',
          tradeoff:
            'A large share of real projects can be scanned but not verified, which is tracked as open work rather than presented as solved.',
        },
        {
          id: 'veripatch-staged-copy',
          title: 'Verify a staged copy, never the working tree',
          decision:
            'The container bind-mounts a staged copy of the project that excludes node_modules, .git and any .env file, so the original tree and any secrets in it are never exposed to the sandbox.',
          rationale:
            'Verification deliberately runs untrusted code. Giving it the developer\'s real working tree — including credentials and git history — would make the tool the risk it exists to reduce.',
          tradeoff:
            'Staging a copy costs disk and time on every run, and a project that depends on git metadata at build time will not behave identically inside the sandbox.',
        },
      ],
      concerns: [
        {
          id: 'veripatch-container',
          title: 'Hardened container',
          detail:
            'The sandbox runs as a non-root user with all capabilities dropped, no-new-privileges set, pid, memory and CPU limits applied, and the container removed on teardown.',
        },
        {
          id: 'veripatch-network-phases',
          title: 'Two-phase network',
          detail:
            'The container gets a dedicated per-run bridge network during install, then is fully disconnected before the build and test phases run.',
        },
        {
          id: 'veripatch-parsers',
          title: 'Hostile lockfiles are parsed defensively',
          detail:
            'Inputs are size-capped before parsing, handled only by real parsers rather than evaluation, stripped recursively of prototype-pollution keys, and validated against the real npm package-name grammar. Yarn classic uses a deliberately rigid grammar where anything unexpected is a hard error rather than a guess.',
        },
        {
          id: 'veripatch-advisory-validation',
          title: 'Advisory data is validated at the boundary',
          detail:
            'Advisories arrive over HTTPS with certificate validation and are schema-validated at the OSV adapter; malformed entries are dropped and counted rather than trusted.',
        },
        {
          id: 'veripatch-injection',
          title: 'Report and terminal injection',
          detail:
            'Every externally sourced string — advisory text, package names, sandboxed process output — is ANSI-stripped and metacharacter-escaped before it reaches a terminal or a Markdown report.',
        },
        {
          id: 'veripatch-own-supply-chain',
          title: 'Its own supply chain',
          detail:
            'Minimal dependencies, a committed lockfile, GitHub Actions pinned by commit SHA, and publishing with provenance. The tool writes only inside its own project-local and home cache directories, handles no secrets and sends no telemetry.',
        },
      ],
      verification: [
        {
          id: 'veripatch-test-layers',
          label: 'Six categories of test',
          detail:
            'The repository separates unit, integration, contract, end-to-end, benchmark and fixture suites, run with Vitest under a single check script alongside type-checking, linting and format verification.',
          verified: true,
        },
        {
          id: 'veripatch-property-tests',
          label: 'Property-based tests on the fix resolver',
          detail:
            'fast-check is used to cover the invariant that a resolved fix is always a version bump of the same package, which is the property that keeps poisoned advisory data from becoming a package substitution.',
          verified: true,
        },
        {
          id: 'veripatch-boundaries',
          label: 'Architectural boundaries enforced by lint',
          detail:
            'eslint-plugin-boundaries enforces the separation between cli, core, services, adapters and shared, so the layering is checked mechanically rather than by review.',
          verified: true,
        },
        {
          id: 'veripatch-published',
          label: 'Published and released',
          detail:
            'Five versions published to npm under Apache-2.0, current release v0.3.1, with nine GitHub releases.',
          verified: true,
        },
      ],
      results: [
        'The CLI contract and the report.json schema are treated as stable, while the project itself is deliberately still pre-1.0.',
        'Scanning covers npm v2 and v3 lockfiles, yarn classic, yarn berry and pnpm v6 and v9; verification and update are npm-only by design.',
        'Ranking orders findings by severity against fix feasibility, so the output is a remediation queue rather than an undifferentiated alert list.',
      ],
      timeline: [
        { id: 'veripatch-v01', label: 'v0.1.0 published', detail: 'First npm release.', date: '2026-07-03' },
        { id: 'veripatch-v02', label: 'v0.2.0', detail: 'Second published version.', date: '2026-07-04' },
        { id: 'veripatch-v031', label: 'v0.3.1 current', detail: 'Current published release.', date: '2026-07-04' },
      ],
      disclosure:
        'The repository is public and Apache-2.0 licensed, so everything described here can be checked against the source. The residual risks below are the project\'s own documented limitations, reproduced rather than softened: a successful verification is not a claim that a package or an application is secure.',
    },
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
    problem:
      'Every published method for handling deficient retrieval evidence is developed and evaluated on a corpus containing exactly one deficiency mode by construction. But the correct repairs diverge, and some are opposites: escalating retrieval helps when evidence is missing and actively harms when it is contradictory. No detector has ever been required to tell those cases apart, because no benchmark presented them together with labels — so neither their detectability nor their usefulness had been measured.',
    role:
      'Sole researcher. Benchmark design and construction, experimental design and pre-registration, analysis, and the forensic re-analysis that produced the published correction.',
    // Derived from the private research repository, reviewed 2026-09-20: README,
    // docs/research/RESULTS.md, docs/ARTIFACT_LICENSING.md and the decision log.
    // Disclosure basis: the project's own frozen release policy (Tier P) clears
    // per-cell result rows — scores, counts, costs — for public release with
    // passage text and rendered prompts removed. Only scores and counts appear
    // here; no passage text, prompt, question or gold answer is reproduced.
    caseStudy: {
      context:
        'The project did not start here. The original proposal was a RAG system that checks evidence sufficiency, detects gaps, re-retrieves and abstains. A literature search found that already published, clause by clause — sufficiency analysis and gap-driven re-retrieval as S2G-RAG at ACL 2026, sufficiency-guided abstention at ICLR 2025, retrieval evaluation with corrective action as CRAG, and diagnosis-conditioned repair as Doctor-RAG and D2R-RAG. Building it would have been re-implementation presented as research, so the direction changed to the question the literature had left open.',
      constraints: [
        'The claim under test needs ground-truth deficiency labels, so it cannot be computed on any existing benchmark — the benchmark had to be built first.',
        'OUTDATED cannot be synthesised honestly, which forced the choice of the one corpus carrying real superseded values.',
        'No API budget: the reader is a 250M-parameter local model on CPU, so absolute scores are not comparable with published systems and every comparison had to be within-instance.',
        'Mixing corpora across rows would confound deficiency type with source corpus, so the second corpus is held as a separate replication and never pooled.',
        'The null hypothesis had to be pre-registered as a real possibility: if type-agnostic repair matched oracle routing, that is the finding.',
      ],
      built:
        'EGB, a benchmark where evidence-deficiency type is a manipulated, labelled variable with co-occurrence cells, and a fully within-record 5 x 6 factorial over it. Four of six construction operators are purely subtractive — evidence is withheld or removed rather than fabricated. Every source record is instantiated under every deficiency type and run under every repair action, including the cells no router would ever pick, which is what makes it a factorial rather than a system comparison and makes every contrast paired.',
      architecture: {
        summary:
          'The system exists as the apparatus for the measurement, not as a product. A record is instantiated into a typed deficiency, retrieved against, repaired under one action, generated from, and scored — with admission gates and label verification standing between construction and the factorial.',
        nodes: [
          { id: 'corpus', label: 'HoH corpus', kind: 'data', detail: '18,807 indexed passages' },
          { id: 'construct', label: 'Deficiency operators', kind: 'process', detail: 'Four are subtractive' },
          { id: 'gates', label: 'Admission gates', kind: 'process', detail: 'Contamination, leakage' },
          { id: 'verify', label: 'Label verification', kind: 'service', detail: 'Independent NLI' },
          { id: 'retrieve', label: 'Retrieval', kind: 'service', detail: 'BM25 index' },
          { id: 'action', label: 'Repair action', kind: 'process', detail: 'Six, three families' },
          { id: 'reader', label: 'Local reader', kind: 'service', detail: '250M parameters, CPU' },
          { id: 'score', label: 'Scoring', kind: 'data', detail: 'Four pre-registered DVs' },
        ],
        flows: [
          { from: 'corpus', to: 'construct', label: 'records' },
          { from: 'construct', to: 'gates', label: 'instances' },
          { from: 'gates', to: 'verify', label: 'admitted' },
          { from: 'verify', to: 'retrieve', label: 'accepted' },
          { from: 'retrieve', to: 'action', label: 'context' },
          { from: 'action', to: 'reader', label: 'repaired context' },
          { from: 'reader', to: 'score', label: 'answers' },
        ],
        caveat:
          'The experimental apparatus as described in the project documentation. The repository is private; this shows the measurement pipeline, not source code.',
      },
      experiment: {
        title: 'The 5 x 6 factorial',
        measure: 'token F1 against the gold answer',
        rowsLabel: 'Evidence-deficiency type',
        colsLabel: 'Repair action',
        rows: [
          { id: 'SUFFICIENT', label: 'SUFFICIENT', detail: 'Control: the evidence is adequate. Establishes the floor the other cells are read against.' },
          { id: 'MISSING', label: 'MISSING', detail: 'Gold evidence is withheld from the delivered set but left in the index, so escalation can still recover it.' },
          { id: 'ABSENT', label: 'ABSENT', detail: 'Gold is removed from the index entirely, enforced at retrieval time so no escalation depth can recover it.' },
          { id: 'CONFLICTING', label: 'CONFLICTING', detail: 'One constructed counter-passage asserts a different record\'s real answer in a mutually exclusive form. Constructed and resolvable by design.' },
          { id: 'OUTDATED', label: 'OUTDATED', detail: 'The record\'s own real superseded revision is injected. Never synthesised — this is why the corpus was chosen.' },
        ],
        cols: [
          { id: 'NONE', label: 'NONE', detail: 'No repair. Answer from the delivered context as-is.' },
          { id: 'ESCALATE', label: 'ESCALATE', detail: 'Retrieve more: six additional passages. Budget-matched with DECOMPOSE by configuration.' },
          { id: 'DECOMPOSE', label: 'DECOMPOSE', detail: 'Retrieve more, differently: split into sub-questions and retrieve per sub-question.' },
          { id: 'ARBITRATE', label: 'ARBITRATE', detail: 'Group candidate answers and decide between them by corroboration support against the index.' },
          { id: 'TIME_FILTER', label: 'TIME_FILTER', detail: 'Filter on temporal validity. A no-op unless a dated near-duplicate is present.' },
          { id: 'ABSTAIN', label: 'ABSTAIN', detail: 'Decline to answer. Scores zero on answer correctness by construction, which is why a second DV was pre-registered.' },
        ],
        cells: [
          { key: 'ABSENT|ABSTAIN', value: 0.0 },
          { key: 'ABSENT|ARBITRATE', value: 0.026, best: true },
          { key: 'ABSENT|DECOMPOSE', value: 0.026 },
          { key: 'ABSENT|ESCALATE', value: 0.007 },
          { key: 'ABSENT|NONE', value: 0.026 },
          { key: 'ABSENT|TIME_FILTER', value: 0.026 },
          { key: 'CONFLICTING|ABSTAIN', value: 0.0 },
          { key: 'CONFLICTING|ARBITRATE', value: 0.807, best: true, note: 'Corrected 2026-09-17 — see below. The number stands; the causal reading does not.' },
          { key: 'CONFLICTING|DECOMPOSE', value: 0.587 },
          { key: 'CONFLICTING|ESCALATE', value: 0.215 },
          { key: 'CONFLICTING|NONE', value: 0.569 },
          { key: 'CONFLICTING|TIME_FILTER', value: 0.547 },
          { key: 'MISSING|ABSTAIN', value: 0.0 },
          { key: 'MISSING|ARBITRATE', value: 0.032 },
          { key: 'MISSING|DECOMPOSE', value: 0.789, best: true },
          { key: 'MISSING|ESCALATE', value: 0.322 },
          { key: 'MISSING|NONE', value: 0.026 },
          { key: 'MISSING|TIME_FILTER', value: 0.026 },
          { key: 'OUTDATED|ABSTAIN', value: 0.0 },
          { key: 'OUTDATED|ARBITRATE', value: 0.807 },
          { key: 'OUTDATED|DECOMPOSE', value: 0.684 },
          { key: 'OUTDATED|ESCALATE', value: 0.25 },
          { key: 'OUTDATED|NONE', value: 0.656 },
          { key: 'OUTDATED|TIME_FILTER', value: 0.823, best: true },
          { key: 'SUFFICIENT|ABSTAIN', value: 0.0 },
          { key: 'SUFFICIENT|ARBITRATE', value: 0.807 },
          { key: 'SUFFICIENT|DECOMPOSE', value: 0.827 },
          { key: 'SUFFICIENT|ESCALATE', value: 0.374 },
          { key: 'SUFFICIENT|NONE', value: 0.831, best: true },
          { key: 'SUFFICIENT|TIME_FILTER', value: 0.809 },
        ],
        provenance:
          'Run 2026-09-15. 47 records x 5 types x 6 actions = 1,410 cells, every cell n = 47. 2,946 generator calls, no API spend. Floor check passed: SUFFICIENT x NONE = 0.831, so the reader can use good evidence and the cells are interpretable.',
        caveat:
          'Measured values, released under the project\'s own Tier P policy, which clears per-cell scores with passage text and prompts removed. Absolute numbers reflect a 250M-parameter local reader and are not comparable with published RAG systems; the factorial is a within-instance contrast.',
      },
      findings: [
        {
          id: 'kg-interaction',
          label: 'Type and action interact',
          value: 'partial eta-squared 0.32, permutation p = 1e-4',
          interpretation:
            'The action profile genuinely differs by deficiency type, corroborated by a mixed-model likelihood-ratio test. This says the cells differ; it does not by itself say that knowing the type is worth anything.',
        },
        {
          id: 'kg-headroom',
          label: 'Oracle typing beats the best single action',
          value: '+6.6 F1 points, 95% CI [2.6, 10.5]',
          interpretation:
            'The pre-registered null is rejected, but by a margin whose lower bound sits exactly at the frozen practical threshold of three points rather than comfortably above it. The honest statement is that typing buys roughly six points and the data are consistent with as little as three.',
        },
        {
          id: 'kg-conflation',
          label: 'The number that must not be quoted',
          value: '+41.5 F1 points against fixed escalation',
          interpretation:
            'Against a fixed-escalation policy typing looks enormous, but almost all of that is the action main effect: escalation is simply a poor universal policy for a small reader because it dilutes the context. Reporting this as the routing benefit would be the single easiest way to overstate the result.',
        },
        {
          id: 'kg-predicted',
          label: 'With a real detector the benefit reverses',
          value: 'predicted routing 0.064 F1 below type-agnostic [-0.120, -0.012]',
          interpretation:
            'This is the result that matters for anyone wanting to build on it. The headroom is real and, on this evidence, unreachable: routing on a diagnosed type is worse than just picking one good action and applying it everywhere.',
        },
        {
          id: 'kg-natural-conflict',
          label: 'Constructed conflict is far easier to detect than natural conflict',
          value: 'recall 0.957 against 0.574',
          interpretation:
            'A pre-registered threat to validity, now measured rather than feared. Nearly a third of natural conflicts are called sufficient — the dangerous error, because the system then answers from evidence it has not noticed contradicts itself.',
        },
        {
          id: 'kg-abstain',
          label: 'Knowing when to decline is the largest single effect',
          value: '+0.96 selective utility for ABSENT to ABSTAIN',
          interpretation:
            'Invisible under answer correctness, where an abstention and a confident fabrication both score zero. It appears only because a second, abstention-sensitive dependent variable was pre-registered before the run.',
        },
      ],
      correction: {
        date: '2026-09-17',
        title: 'What CONFLICTING x ARBITRATE actually measures',
        detail:
          'The study\'s only cell surviving multiple-comparison correction was read as arbitration resolving conflict by corroboration. A forensic re-analysis of the frozen artifacts — no model loaded, nothing modified — found otherwise. ARBITRATE scores identically to four decimal places in the conflicting, outdated and sufficient cells, and produces the same answer string as the sufficient cell on 45 of 47 records. The injected counter-passages are the only passages absent from the index that arbitration corroborates against: 47 of 47, against 0 of 1,315 gold and distractor passages. The counter-passage also quotes the whole question, giving it a query-token overlap of 1.000 against gold\'s 0.676, making it the strict maximum-overlap passage in 47 of 47 delivered sets. Two trivial rules — pick the maximum-overlap passage, or the one absent from the index — identify the counter-side in 47 of 47 instances with no generation at all.',
        status:
          'The number stands; the causal reading does not. The correction establishes that the artifact exists. Whether it explains the effect is what the pre-registered replication measures, and that replication has not been run.',
      },
      decisions: [
        {
          id: 'kg-change-direction',
          title: 'Abandon the original proposal after the literature search',
          decision:
            'The proposed system was found to be published work, clause by clause, and the project was redirected to the question that remained open: whether deficiency type carries actionable information when the repairs genuinely differ.',
          rationale:
            'Building it anyway would have been re-implementation presented as research. The gap that was actually open is that no benchmark presents the deficiency types together with labels, so nothing had ever been required to discriminate them.',
          tradeoff:
            'The new question needs ground-truth labels that no existing benchmark carries, so the benchmark had to be built before the experiment could run at all.',
        },
        {
          id: 'kg-oracle-types',
          title: 'Make the type factor oracle rather than predicted',
          decision:
            'The factorial uses ground-truth deficiency types, so it measures whether type carries information independently of whether any detector can recover it. Detection is a separate experiment.',
          rationale:
            'Confounding the two would make a null result uninterpretable: a failure could mean type is useless, or merely that the detector is poor.',
          tradeoff:
            'The factorial alone cannot say anything about a deployable system. That required the third arm, which is where the benefit turned out to reverse.',
        },
        {
          id: 'kg-freeze-analysis',
          title: 'Freeze the analysis before the first result existed',
          decision:
            'Methods were written and the analysis script — including its out-of-sample action-selection rule — was committed before the first result row was produced.',
          rationale:
            'In-sample selection of the best action guarantees a positive headroom even under a true null. Fixing the rule in advance is the only way the number means anything.',
          tradeoff:
            'A pre-registered analysis cannot be improved after seeing the data, so a better test that becomes obvious later has to be reported as exploratory.',
        },
        {
          id: 'kg-report-null-loudly',
          title: 'Publish the correction against the original rather than editing it',
          decision:
            'The forensic finding was added as a new section with the original record left untouched, and the superseded claims were marked in place.',
          rationale:
            'The value of a frozen record is that it cannot be quietly revised. Editing the earlier sections would have destroyed the thing that makes pre-registration meaningful.',
          tradeoff:
            'The document now contains a claim and its refutation, which is harder to read than a corrected version would be.',
        },
      ],
      verification: [
        {
          id: 'kg-preregistration',
          label: 'Pre-registered and frozen before the run',
          detail:
            'Methods frozen and written before execution; the analysis script with its out-of-sample selection rule committed before the first result row existed.',
          verified: true,
        },
        {
          id: 'kg-gates',
          label: 'Admission and label-verification gates',
          detail:
            'Contamination probing, independent NLI label verification with rejected records dropped entirely to keep the factorial balanced, a retrieval-ceiling admission criterion, and a leakage audit finding no ground-truth field or label string in any rendered prompt.',
          verified: true,
        },
        {
          id: 'kg-leakage-reported',
          label: 'A gate that fails, reported rather than repaired',
          detail:
            'The surface-leakage gate does not pass for every deficiency type. The failure is reported in the results and bounds the detection claims rather than being quietly fixed.',
          verified: true,
        },
        {
          id: 'kg-forensics',
          label: 'Forensic re-analysis of the frozen artifacts',
          detail:
            'A reproduction script re-derives every number in the correction from the frozen artifacts at a named commit, with no model loaded and no artifact modified.',
          verified: true,
        },
      ],
      results: [
        'The interaction between deficiency type and repair action is real and large, and the pre-registered null is rejected on the primary measure.',
        'The benefit is concentrated rather than general: for MISSING and SUFFICIENT the best action is also the globally best action, so knowing the type bought nothing.',
        'Routing on a predicted type performs worse than applying a single good action everywhere, so the measured headroom is not currently reachable.',
        'The headline cell was subsequently found to be measuring a construction artifact, and the replication that would settle it has not been run.',
      ],
      disclosure:
        'The repository is private. Published here are measured scores, counts and statistics only — the categories the project\'s own release policy clears for public release with passage text and rendered prompts removed. No benchmark passage, rendered prompt, question or gold answer is reproduced. The HotpotQA replication factorial is not complete and no numbers are shown for it.',
    },
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
