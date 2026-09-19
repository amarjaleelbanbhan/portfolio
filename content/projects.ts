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
      'Pre-alpha. Six of eleven phases are partially built and the v1.0 phase has not started.',
      'The verification pipeline reaches the taint rung. Dynamic proof-of-concept and differential-test verification are not built: the sandbox adapter exists but nothing in the agent pipeline calls it, and no component produces proof-of-concept evidence yet.',
      'Verification and patch-quality metrics are left unpopulated because they need evidence at rungs the pipeline does not yet produce.',
      'A distinct false-positive-reduction capability, contamination-controlled evaluation splits and broader benchmark datasets remain unbuilt.',
      'The summary at the top of the repository README describes the verification loop as closed to the dynamic rung; the per-phase roadmap records that wiring as not yet built. This page follows the roadmap.',
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
    problem:
      'A static analyser can tell you a dangerous pattern appears in your code. It cannot tell you whether that line is reachable, whether attacker-controlled data gets to it, or whether the finding is exploitable at all — so teams drown in findings they cannot triage. An LLM can reason about the code but cannot prove anything about it.',
    role:
      'Sole author and architect. Domain model, Code Property Graph engine, scanner adapters, agent pipeline, reporters and the evaluation harness.',
    // Derived from the public repository, reviewed 2026-09-20: README.md,
    // ROADMAP.md and ARCHITECTURE.md. Where the README's summary and the
    // per-phase roadmap disagree about what is built, the roadmap is followed —
    // it carries evidence for every line, and it is the more conservative of the
    // two. That disagreement is itself recorded in the limitations.
    caseStudy: {
      context:
        'Built as a security tool that has to earn its own conclusions. The design premise is that a finding is only as strong as the evidence attached to it, and that a language model — however fluent — is not evidence.',
      constraints: [
        'A model can be persuasive and wrong, so model judgement cannot be allowed to establish that a finding is real.',
        'Running a proof-of-concept means executing potentially hostile code, which has to be isolated from the host.',
        'Output has to be consumable by tools that already exist, which means standard formats rather than a bespoke report shape.',
        'Every capability has to be honest about its own maturity, because a security tool that overstates its confidence is worse than one that says nothing.',
      ],
      built:
        'A Python monorepo of independently versioned packages behind a hexagonal architecture. A Code Property Graph engine builds AST, control-flow, data-flow and call graphs over tree-sitter and answers reachability, taint and slice queries. Four scanner adapters feed a correlation layer. A seven-agent pipeline grounds its reasoning in the graph, and results are exported as SARIF, CycloneDX-VEX and a native JSON format.',
      architecture: {
        summary:
          'Ports and adapters throughout: the domain core is pure with no I/O, every external capability is a protocol-typed port, and adapters are discovered as plugins so a new scanner or model provider needs no core change.',
        nodes: [
          { id: 'cli', label: 'ward CLI', kind: 'client', detail: 'scan, baseline, bench' },
          { id: 'orch', label: 'Orchestrator', kind: 'service', detail: 'Seven-agent pipeline' },
          { id: 'cpg', label: 'Code Property Graph', kind: 'process', detail: 'AST, CFG, DFG, calls' },
          { id: 'scanners', label: 'Scanner adapters', kind: 'process', detail: 'Four, plus correlation' },
          { id: 'llm', label: 'LLM adapters', kind: 'external', detail: 'Bounded, cannot verify' },
          { id: 'domain', label: 'Domain core', kind: 'service', detail: 'Pure, no I/O' },
          { id: 'store', label: 'Event-sourced log', kind: 'data', detail: 'SQLite storage port' },
          { id: 'report', label: 'Reporters', kind: 'data', detail: 'SARIF, VEX, JSON' },
        ],
        flows: [
          { from: 'cli', to: 'orch', label: 'invoke' },
          { from: 'orch', to: 'scanners', label: 'detect' },
          { from: 'orch', to: 'cpg', label: 'query' },
          { from: 'orch', to: 'llm', label: 'reason' },
          { from: 'scanners', to: 'domain', label: 'findings' },
          { from: 'cpg', to: 'domain', label: 'evidence' },
          { from: 'llm', to: 'domain', label: 'hypotheses' },
          { from: 'domain', to: 'store', label: 'events' },
          { from: 'domain', to: 'report', label: 'verdicts' },
        ],
        caveat:
          'Architecture as documented in the public repository. Implemented components only — the packages listed here all exist and ship; see the ladder below for which verification capabilities are built.',
      },
      ladder: {
        title: 'The Verification Ladder',
        intro:
          'Rather than a binary "did an exploit run", each finding is assigned the strongest evidence that can actually be produced for it, and confidence is calibrated to that rung. Two rungs are built today and two are not — the distinction is the point, so it is stated on every rung rather than summarised.',
        stages: [
          {
            id: 'rung-0',
            level: '0',
            label: 'NONE',
            evidence: 'A pattern match — a detector fired.',
            meaning:
              'The weakest rung. It says a scanner matched something, and nothing more. Findings that never climb above this are exactly the noise the project exists to reduce.',
            status: 'implemented',
          },
          {
            id: 'rung-1',
            level: '1',
            label: 'STATIC_REACHABILITY',
            evidence: 'A reachability proof from the code graph.',
            meaning:
              'The sink is reachable in the call graph. This is the first rung that requires real analysis rather than a match, and it comes from the Code Property Graph rather than from a model.',
            status: 'implemented',
          },
          {
            id: 'rung-2',
            level: '2',
            label: 'TAINT_CONFIRMED',
            evidence: 'A data-flow trace from source to sink.',
            meaning:
              'Attacker-controlled data actually reaches the dangerous operation. This is the highest rung the pipeline currently reaches, and a finding corroborated to here is marked verified while its exploitability verdict stays under investigation — because reachable and tainted is not the same as demonstrated.',
            status: 'implemented',
          },
          {
            id: 'rung-3',
            level: '3',
            label: 'DYNAMIC_POC',
            evidence: 'A proof-of-concept that actually ran in a sandbox.',
            meaning:
              'A generated exploit executes in an isolated container and fires. This would be the first rung that demonstrates rather than infers exploitability.',
            status: 'planned',
            gap:
              'The Docker sandbox adapter is built and tested, but nothing in the agent pipeline calls it yet, and no component produces proof-of-concept evidence for it to replay. Both are documented as unbuilt rather than in progress.',
          },
          {
            id: 'rung-4',
            level: '4',
            label: 'DIFFERENTIAL_TEST',
            evidence: 'A test that discriminates vulnerable from fixed code.',
            meaning:
              'The strongest rung: a check that behaves differently before and after the fix, which is what makes a patch verifiable rather than plausible.',
            status: 'planned',
            gap:
              'Blocked behind the same gap as rung 3, and needs a design for invoking an arbitrary target project\'s test suite generically across ecosystems.',
          },
        ],
        rules: [
          'A language model can never climb the ladder on its own. Model judgement is bounded by design and only concrete analysis produces rungs — this is enforced structurally rather than by convention.',
          'Refutation is first-class. Evidence that a finding is not exploitable is captured and drives it toward a not-affected verdict, instead of being discarded as a non-result.',
        ],
        caveat:
          'Rung status is taken from the repository\'s per-phase roadmap, which documents evidence for each line, rather than from the summary at the top of its README.',
      },
      decisions: [
        {
          id: 'cw-llm-cannot-verify',
          title: 'A model is never allowed to be the evidence',
          decision:
            'Language models participate in the pipeline as a source of hypotheses, but model judgement cannot raise a finding\'s verification rung. Only concrete analysis — graph reachability, taint tracing, sandboxed execution — can.',
          rationale:
            'A fluent, confident and wrong explanation is the characteristic failure of model-assisted security tooling. Making the ladder structurally unreachable by a model means that failure cannot silently become a verdict.',
          tradeoff:
            'The tool is far more conservative than an LLM reviewer and will leave findings at a low rung that a model would happily call exploitable.',
        },
        {
          id: 'cw-hexagonal',
          title: 'Hexagonal architecture with plugin-discovered adapters',
          decision:
            'The domain core is pure with no I/O, every external capability sits behind a protocol-typed port, and adapters register through entry-point discovery so adding one requires no core change.',
          rationale:
            'A security tool is mostly integrations — scanners, model providers, version control, sandboxes, report formats. Keeping them at the edge means the verification logic can be tested without any of them.',
          tradeoff:
            'Considerably more indirection than a direct implementation, and a contributor has to understand the port catalogue before adding a capability.',
        },
        {
          id: 'cw-cpg',
          title: 'Build a Code Property Graph rather than pattern-matching harder',
          decision:
            'A graph engine over tree-sitter unifies AST, control flow, data flow and the call graph, and answers reachability, taint and slice queries that the rest of the system treats as evidence.',
          rationale:
            'Reachability and taint are the two questions that separate a real finding from a match, and neither can be answered by a better regular expression.',
          tradeoff:
            'A graph has to be built per language, so language coverage is bounded by the tree-sitter grammars and query sets actually written.',
        },
        {
          id: 'cw-standard-formats',
          title: 'Emit SARIF and CycloneDX-VEX rather than a bespoke report',
          decision:
            'Findings export as SARIF 2.1.0, exploitability as CycloneDX-VEX, with a native JSON format alongside.',
          rationale:
            'A verdict that cannot be ingested by the tooling a team already runs does not change anything. Standard formats make the output actionable without adoption.',
          tradeoff:
            'The mapping onto CycloneDX\'s own state enumeration is documented as one-directional rather than a lossless round-trip, so some internal nuance is lost on export.',
        },
      ],
      concerns: [
        {
          id: 'cw-sandbox-isolation',
          title: 'Executing untrusted code',
          detail:
            'Dynamic verification means running code from the project under test. The sandbox adapter isolates that in Docker — built and tested, though not yet wired into the pipeline.',
        },
        {
          id: 'cw-model-boundary',
          title: 'The model boundary is a trust boundary',
          detail:
            'Model output enters the system as a hypothesis, never as a fact. The ladder is the mechanism that enforces it.',
        },
        {
          id: 'cw-audit-trail',
          title: 'Event-sourced finding log',
          detail:
            'Findings are stored as an append-only event log, so how a verdict was reached remains reconstructable rather than being overwritten by its latest state.',
        },
      ],
      verification: [
        {
          id: 'cw-ci',
          label: 'Quality gate reproducible locally',
          detail:
            'The same gate CI runs is a single make target, alongside pre-commit hooks and a dev container.',
          verified: true,
        },
        {
          id: 'cw-eval',
          label: 'Evaluation harness with a statistical protocol',
          detail:
            'Detection metrics, a versioned golden dataset, run manifests, and a protocol specifying bootstrap confidence intervals and McNemar\'s test.',
          verified: true,
        },
        {
          id: 'cw-eval-gap',
          label: 'Verification and patch-quality metrics are not populated',
          detail:
            'Those metrics need evidence at rungs the pipeline does not yet produce, so the fields exist in the manifest and are deliberately left empty rather than estimated.',
          verified: false,
        },
        {
          id: 'cw-vex-e2e',
          label: 'VEX export verified end to end',
          detail:
            'The CycloneDX-VEX reporter is fully covered and was verified by a real scan producing a valid document.',
          verified: true,
        },
      ],
      results: [
        'Phases 0 through 4 are complete: domain core, workspace and port contracts, the Code Property Graph engine, four scanners with SARIF output, and the seven-agent framework with multi-provider model support.',
        'Six further phases are partially built, each with specific documented items still open, and the v1.0 phase has not started.',
        'The verification pipeline reaches the taint rung today. The two rungs that would demonstrate rather than infer exploitability are not built.',
      ],
      timeline: [
        { id: 'cw-p2', label: 'Code Property Graph engine', detail: 'AST, control flow, data flow and call graph over tree-sitter.' },
        { id: 'cw-p3', label: 'Scanners and SARIF', detail: 'Four scanner adapters with cross-tool correlation.' },
        { id: 'cw-p4', label: 'Agent framework', detail: 'Seven agents, multi-provider models, graph-grounded reachability evidence.' },
      ],
      disclosure:
        'The repository is public, so every claim here can be checked against it. Where the README summary and the per-phase roadmap disagree about what is built, this page follows the roadmap, which documents evidence for each line and is the more conservative of the two.',
    },
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
    limitations: [
      'Rendering is CPU-heavy and single-job; the documentation is explicit that it needs a queue in front of it before more than a handful of users use it.',
      'The editor preview never executes scene JavaScript, so animation and dynamic behaviour are only visible after a full render.',
      'The character engine is vendored as a pinned build because its published package fails to install, so updates are manual and can drift from upstream.',
      'No render artifact is published with the project, and the documentation states no test counts, rendering benchmarks or determinism guarantee.',
    ],
    technologies: ['javascript', 'react', 'ffmpeg', 'headless-chrome', 'nodejs'],
    tags: ['JavaScript', 'Express', 'Headless Chrome', 'FFmpeg', 'React'],
    links: {},
    source: { visibility: 'private', label: 'Private repository' },
    note: 'Repository private.',
    problem:
      'Producing short motion graphics from code normally means either a heavyweight editor or a cloud rendering service. Neither lets you write a scene as ordinary HTML, CSS and JavaScript and get a video file back on your own machine.',
    role:
      'Sole engineer. Backend render pipeline, manifest model and validation, editor frontend, and the composition layer between them.',
    // Derived from the private repository, reviewed 2026-09-20: README and the
    // docs directory. Claims are limited to what that documentation states. In
    // particular: no render artifact is committed to the repository, and no
    // determinism guarantee is documented, so neither is claimed here.
    caseStudy: {
      context:
        'A local tool for turning a JSON manifest of HTML, CSS and JavaScript scenes into a single MP4, scene by scene. No cloud APIs, no keys and no uploads — the whole pipeline runs on the machine that owns the files.',
      constraints: [
        'Scene code is arbitrary HTML, CSS and JavaScript supplied by the user, so the editor preview and the renderer need different trust models.',
        'Every scene shares one output document, so CSS from one scene must not leak into another.',
        'Rendering drives a real browser and a real encoder, which makes it CPU-heavy and single-job rather than something to expose to concurrent users.',
        'The stage is fixed at 1920x1080 and 30 frames per second, so timeline maths has to line up scene boundaries with frame boundaries.',
        'One upstream dependency could not be installed from its published package at all, which forced a vendoring decision.',
      ],
      built:
        'An Express backend that compiles a scene manifest into per-scene compositions, drives headless Chrome to capture frames and hands them to FFmpeg, plus a React and Monaco editor with one editor per scene, a live preview and a render button. Timeline arithmetic comes from a dedicated package rather than being reimplemented.',
      architecture: {
        summary:
          'A manifest becomes a video in stages: each scene is compiled to its own composition document, the timeline places those documents in time, headless Chrome renders frames, and FFmpeg encodes them into one MP4.',
        nodes: [
          { id: 'editor', label: 'Editor', kind: 'client', detail: 'React, Vite, Monaco' },
          { id: 'manifest', label: 'Scene manifest', kind: 'data', detail: 'JSON, validated' },
          { id: 'api', label: 'Express API', kind: 'service', detail: 'Local only' },
          { id: 'compose', label: 'Compositions', kind: 'process', detail: 'One document per scene' },
          { id: 'timeline', label: 'Timeline', kind: 'process', detail: 'Start and duration' },
          { id: 'chrome', label: 'Headless Chrome', kind: 'service', detail: 'Frame capture' },
          { id: 'ffmpeg', label: 'FFmpeg', kind: 'external', detail: 'Encode' },
          { id: 'mp4', label: 'MP4', kind: 'data', detail: '1920x1080 at 30fps' },
        ],
        flows: [
          { from: 'editor', to: 'manifest', label: 'author' },
          { from: 'manifest', to: 'api', label: 'submit' },
          { from: 'api', to: 'compose', label: 'compile' },
          { from: 'compose', to: 'timeline', label: 'place' },
          { from: 'timeline', to: 'chrome', label: 'render' },
          { from: 'chrome', to: 'ffmpeg', label: 'frames' },
          { from: 'ffmpeg', to: 'mp4', label: 'encode' },
        ],
        caveat:
          'Illustrative architecture drawn from the project documentation. It is not a screenshot of the editor and not a frame from a render — no render artifact is published with this project, so none is shown.',
      },
      decisions: [
        {
          id: 'sf-document-per-scene',
          title: 'Compile each scene into its own document',
          decision:
            'Every scene becomes a separate composition document, embedded into the output with its own start time and duration, rather than all scenes sharing one page.',
          rationale:
            'Separate documents give each scene its own CSS scope, so a scene can style the page body normally and cannot leak styles into the scene after it. Sharing a document would have made every selector a potential collision.',
          tradeoff:
            'More documents to coordinate, and anything intended to persist across scenes has to be arranged deliberately rather than simply existing on the page.',
        },
        {
          id: 'sf-preview-never-runs-js',
          title: 'The preview sanitises and never executes scene JavaScript',
          decision:
            'The in-browser preview renders sanitised markup only. Scene JavaScript runs during the render and nowhere else.',
          rationale:
            'The preview lives in the author\'s own browser session. Executing arbitrary scene JavaScript there would put the editor at the mercy of the content it is editing.',
          tradeoff:
            'The preview cannot show anything the scene\'s JavaScript does, so animation and dynamic behaviour are only visible after a render.',
        },
        {
          id: 'sf-strip-scripts',
          title: 'Strip script tags and reject navigating scene code',
          decision:
            'Script tags inside a scene\'s markup are stripped, JavaScript belongs in a dedicated field, and scene code that tries to navigate the page is rejected outright with a client error.',
          rationale:
            'A scene that navigates the rendering browser breaks the render for every scene after it, and inline scripts blur the boundary between markup and behaviour that the rest of the pipeline depends on.',
          tradeoff:
            'A legitimate pattern — an inline bootstrap script — has to be rewritten to fit the manifest shape.',
        },
        {
          id: 'sf-vendor-engine',
          title: 'Vendor the character engine rather than depend on it',
          decision:
            'The mascot engine is committed into the repository as a pinned build, with refresh instructions recorded next to the code that uses it.',
          rationale:
            'Its published package cannot be installed — the manifest fails version parsing — so a normal dependency was not available.',
          tradeoff:
            'Updates are manual and the vendored copy can drift from upstream, which is why the refresh procedure is documented rather than assumed.',
        },
      ],
      concerns: [
        {
          id: 'sf-trust-split',
          title: 'Two trust models for the same code',
          detail:
            'The preview sanitises markup and never runs scene JavaScript; the renderer executes it in a browser it controls. The split is deliberate — the risky operation happens where the blast radius is a render job rather than the author\'s session.',
        },
        {
          id: 'sf-input-validation',
          title: 'Manifest limits are enforced, not assumed',
          detail:
            'Scene identifiers must match a restricted character set, and the manifest is capped at twenty scenes of sixty seconds each. Validation rules are covered by the test suite.',
        },
        {
          id: 'sf-escaping',
          title: 'Breakout escaping is tested',
          detail:
            'Scene content is embedded into generated documents, so the tests specifically cover escaping that would otherwise let style or script content break out of its container.',
        },
        {
          id: 'sf-single-job',
          title: 'Rendering is single-job by nature',
          detail:
            'A render drives a browser and an encoder and is CPU-heavy, so the documentation is explicit that it needs a queue in front of it before more than a handful of users touch it.',
        },
      ],
      verification: [
        {
          id: 'sf-tests',
          label: 'Backend test suite',
          detail:
            'Covers the timeline arithmetic, the shape of composition output, breakout escaping for style and script content, and every manifest-validation rule. No test count is quoted here because the repository documentation does not state one.',
          verified: true,
        },
        {
          id: 'sf-doctor',
          label: 'Environment check endpoint',
          detail:
            'A diagnostic endpoint reports whether Chrome, FFmpeg, disk and GPU are actually available, so a render failure can be told apart from a missing dependency.',
          verified: true,
        },
        {
          id: 'sf-render-artifact',
          label: 'No published render output',
          detail:
            'The repository\'s output directory contains no committed video, so there is no render artifact to show and none is claimed. The pipeline is described rather than demonstrated.',
          verified: false,
        },
        {
          id: 'sf-determinism',
          label: 'Determinism is not a documented guarantee',
          detail:
            'Frames are captured from a real browser against a fixed stage and frame rate, but the project documentation makes no claim that two renders of the same manifest are byte-identical, so none is made here.',
          verified: false,
        },
      ],
      results: [
        'A manifest of HTML, CSS and JavaScript scenes compiles into per-scene composition documents and encodes to a single MP4 at a fixed 1920x1080, 30 frames per second stage.',
        'Scenes are CSS-isolated from each other by construction rather than by naming convention.',
        'Two upstream rendering quirks were diagnosed and worked around: a package that cannot be installed from its published manifest, and a build variant that throws inside its render loop under headless Chrome and paints nothing.',
      ],
      disclosure:
        'The repository is private. This page describes the rendering architecture and the engineering decisions behind it. No editor screenshot, rendered frame or output video is shown, because none is published with the project — and no test counts or rendering benchmarks are quoted, because the repository documentation does not state any.',
    },
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
    problem:
      'When there is no internet, no cell service and no server, delivery stops being a request and becomes a scheduling problem: the peer you need may simply not be in range at the moment you press send.',
    role:
      'Sole engineer. Wire format, cryptographic suite, encrypted local store, routing and custody logic, the native Bluetooth transport, and the Flutter application on top.',
    // Derived from the private repository, reviewed 2026-09-20: STATUS.md and
    // the milestone record. The key distinction below — single-hop frame
    // exchange verified between two real phones, multi-hop relay not
    // implemented at all — is taken verbatim from that status document.
    caseStudy: {
      context:
        'An offline messaging app for situations where infrastructure is gone. Phones talk directly to each other over Bluetooth Low Energy, carry messages for one another, and hold what they cannot yet deliver. There is no server anywhere in the design, which is a product rule rather than a deployment choice.',
      constraints: [
        'Bluetooth Low Energy has a small MTU, so anything larger than a few dozen bytes has to be fragmented and reassembled below the protocol layer.',
        'A peer may be out of range at the moment of sending, so the transport cannot assume a destination exists when a message is created.',
        'Mobile operating systems suspend background work aggressively, so keeping a radio available means a foreground service rather than a background task.',
        'There is no server to hold identity, so keys and identities are generated and stored locally on each device.',
        'Anything persisted on a device that might be lost has to be encrypted at rest.',
      ],
      built:
        'A wire format, a cryptographic suite and an encrypted local store, all implemented and tested without hardware. On top of them, mesh routing and custody logic, and a native Kotlin Bluetooth transport covering advertising and scanning, a GATT server and client with MTU negotiation, connection ranking and retry, fragmentation and reassembly, and a foreground service that keeps the radio alive while the app is backgrounded. The Flutter application composes, signs and verifies real frames over that transport.',
      architecture: {
        summary:
          'A Flutter application over a native Bluetooth transport, with the protocol, cryptography and persistence layers deliberately independent of the radio so they can be tested without a device.',
        nodes: [
          { id: 'ui', label: 'Flutter app', kind: 'client', detail: 'Chat, people, SOS' },
          { id: 'frames', label: 'Frame layer', kind: 'process', detail: 'Compose, sign, verify' },
          { id: 'crypto', label: 'Crypto suite', kind: 'service', detail: 'Local identity keys' },
          { id: 'mesh', label: 'Mesh service', kind: 'service', detail: 'Routing and custody' },
          { id: 'outbox', label: 'Outbox scheduler', kind: 'process', detail: 'Retry and expiry' },
          { id: 'store', label: 'Encrypted store', kind: 'data', detail: 'At rest on device' },
          { id: 'channel', label: 'Platform channel', kind: 'process', detail: 'Dart to Kotlin' },
          { id: 'ble', label: 'Kotlin BLE', kind: 'external', detail: 'GATT, fragmentation' },
        ],
        flows: [
          { from: 'ui', to: 'frames', label: 'compose' },
          { from: 'frames', to: 'crypto', label: 'sign' },
          { from: 'frames', to: 'mesh', label: 'dispatch' },
          { from: 'mesh', to: 'outbox', label: 'queue' },
          { from: 'outbox', to: 'store', label: 'persist' },
          { from: 'mesh', to: 'channel', label: 'send' },
          { from: 'channel', to: 'ble', label: 'transmit' },
        ],
        caveat:
          'Sanitized architecture from the project documentation. No identity, key material or test artifact is reproduced.',
      },
      network: {
        title: 'What actually happens on the radio',
        intro:
          'A walkthrough of the documented behaviour across three devices. Every step states whether it runs on real hardware, exists only in the simulator, or is not built — because the difference between those three is the whole point of this section.',
        nodes: [
          { id: 'a', label: 'SENDER', inRange: true },
          { id: 'b', label: 'PEER IN RANGE', inRange: true },
          { id: 'c', label: 'OUT OF RANGE', inRange: false },
        ],
        links: [
          { id: 'ab', from: 'a', to: 'b', established: true },
          { id: 'bc', from: 'b', to: 'c', established: false },
        ],
        steps: [
          {
            id: 'discover',
            label: 'Discovery',
            detail:
              'Devices advertise and scan over Bluetooth Low Energy, rank the connections they find and retry the ones that drop. Verified between two phones in range.',
            nodes: ['a', 'b'],
            links: ['ab'],
            status: 'live',
          },
          {
            id: 'identity',
            label: 'Local identity',
            detail:
              'Each device generates and holds its own keys. There is no server to register with, so identity is created on first run and never leaves the device.',
            nodes: ['a'],
            links: [],
            status: 'live',
          },
          {
            id: 'compose',
            label: 'Compose, seal and sign',
            detail:
              'Announcements, SOS broadcasts and direct messages are composed, sealed and signed before they reach the radio, and verified on arrival.',
            nodes: ['a'],
            links: [],
            status: 'live',
          },
          {
            id: 'fragment',
            label: 'Fragment and reassemble',
            detail:
              'The Bluetooth MTU is far smaller than a message, so frames are fragmented and reassembled natively beneath the protocol layer.',
            nodes: ['a', 'b'],
            links: ['ab'],
            status: 'live',
          },
          {
            id: 'transfer',
            label: 'Single-hop transfer',
            detail:
              'Two phones directly in range exchange real signed frames: contacts populate from genuine announcements and a one-to-one conversation sends and receives over live Bluetooth.',
            nodes: ['a', 'b'],
            links: ['ab'],
            status: 'live',
          },
          {
            id: 'ack',
            label: 'Acknowledgement',
            detail:
              'A received message is stored and acknowledged on first arrival, and the sender marks it delivered. This exists for direct messages only — an SOS broadcast still cannot claim it reached anyone.',
            nodes: ['a', 'b'],
            links: ['ab'],
            status: 'live',
          },
          {
            id: 'custody',
            label: 'Store and forward',
            detail:
              'A message queued while its destination is unreachable is persisted, retried as soon as a peer connects and otherwise on a bounded poll, and expired once it passes its lifetime.',
            nodes: ['a'],
            links: [],
            status: 'live',
          },
          {
            id: 'relay',
            label: 'Multi-hop relay',
            detail:
              'Carrying a message for a third device that the sender cannot reach directly. This is the defining promise of a mesh and it is not implemented — the transport is single-hop only, which is why the far device above never receives anything.',
            nodes: ['c'],
            links: ['bc'],
            status: 'not-implemented',
          },
        ],
        caveat:
          'Illustrative protocol simulation, not a recording of deployed hardware. The unreachable device is drawn that way permanently and on purpose: no sequence of steps here completes a multi-hop delivery, because the implementation cannot.',
      },
      decisions: [
        {
          id: 'em-radio-independent',
          title: 'Keep the protocol independent of the radio',
          decision:
            'The wire format, cryptographic suite, encrypted store and mesh logic were built and tested with no device involved, behind a platform channel that the native transport implements.',
          rationale:
            'Bluetooth work needs two physical phones, which makes it slow and hard to test. Everything above the transport could be developed and verified without that cost.',
          tradeoff:
            'A layer verified only against its own contract can still be wrong about the radio underneath it, which is exactly the gap the outstanding device-verification task exists to close.',
        },
        {
          id: 'em-foreground-service',
          title: 'Use a foreground service to keep the radio alive',
          decision:
            'Scanning, advertising and connection handling run inside a foreground service rather than a background task.',
          rationale:
            'Mobile operating systems suspend background work aggressively, and a mesh node that stops listening when the screen locks is not a mesh node.',
          tradeoff:
            'A persistent notification and a real battery cost, which for a general-purpose app would be unacceptable and for an emergency tool is the point.',
        },
        {
          id: 'em-no-server',
          title: 'No server anywhere, including for errors',
          decision:
            'There is no backend for identity, delivery or even crash reporting; error handling is local by default.',
          rationale:
            'A tool whose premise is that infrastructure has failed cannot have a mandatory server, and that rule was applied consistently rather than only to the message path.',
          tradeoff:
            'No remote diagnostics, so a failure in the field cannot be investigated after the fact unless the device is in hand.',
        },
        {
          id: 'em-label-simulation',
          title: 'Label the in-app mesh demo as a simulation',
          decision:
            'The application includes a demo screen that replays a simulator run as an animated topology, explicitly labelled as simulation, and it drives the same routing code the real path uses.',
          rationale:
            'A demo that looks like live mesh traffic when it is not would misrepresent the project to exactly the people most likely to be impressed by it.',
          tradeoff:
            'The most visually convincing screen in the app is the one that carries a disclaimer.',
        },
      ],
      concerns: [
        {
          id: 'em-at-rest',
          title: 'Encrypted at rest',
          detail:
            'Messages, contacts and identity material are held in an encrypted local store, on the assumption that a device in an emergency is a device that might be lost.',
        },
        {
          id: 'em-verify-inbound',
          title: 'Inbound frames are verified before they are trusted',
          detail:
            'Frames are signed on composition and verified on arrival, so anything that reaches the contact or message stores has been checked rather than merely received.',
        },
        {
          id: 'em-no-false-delivery',
          title: 'Delivery is never claimed without an acknowledgement',
          detail:
            'Direct messages are marked delivered only on a real acknowledgement. An SOS broadcast has no acknowledgement mechanism, so the interface deliberately does not tell the user it reached anyone.',
        },
      ],
      verification: [
        {
          id: 'em-native-tests',
          label: '62 native unit tests on the Bluetooth layer',
          detail:
            'The Kotlin transport is covered by 62 unit tests and verified by compilation and packaging.',
          verified: true,
        },
        {
          id: 'em-no-device-verification',
          label: 'The native stack has not been verified on a device',
          detail:
            'The final transport task requires two physical phones and has not been completed. Everything below the application layer is therefore verified against its own tests and contracts, not against hardware.',
          verified: false,
        },
        {
          id: 'em-live-single-hop',
          label: 'Single-hop exchange confirmed between two phones',
          detail:
            'Two devices directly in range exchange real signed frames: contacts populate from genuine announcements, and a one-to-one conversation sends, receives and acknowledges over live Bluetooth.',
          verified: true,
        },
        {
          id: 'em-simulation-only',
          label: 'Mesh behaviour beyond one hop exists only in simulation',
          detail:
            'The simulator drives the same routing code as the real path, but a passing simulation is not evidence of hardware behaviour and is not presented as such.',
          verified: false,
        },
      ],
      results: [
        'The protocol, cryptography, persistence and routing layers are implemented and tested without hardware, and the native Bluetooth transport is implemented in Kotlin with unit tests.',
        'Two phones directly in range exchange real signed frames today, including a working one-to-one conversation with acknowledgement and store-and-forward retry.',
        'Multi-hop relay — the defining behaviour of a mesh — is not implemented, and the final device-verification task for the native transport remains open.',
      ],
      disclosure:
        'The repository is private. No identity, key material, test artifact or captured traffic is reproduced here. The distinction between what runs on hardware, what exists only in simulation and what is not built is taken directly from the project\'s own status record rather than inferred.',
    },
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
