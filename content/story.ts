import type { Domain } from './types';

/**
 * The homepage engineering narrative: BUILT → VERIFIED → RESEARCHED → SYSTEMS
 * → CONTRIBUTED.
 *
 * This file holds *choreography*, not facts. Stage titles, the explanatory
 * sentence and the labelled steps of each diagram are authored — they describe
 * how a system works, which is a writing job, not something derivable from a
 * project record.
 *
 * Every factual claim is looked up instead. `projectSlug` pulls the real title,
 * status, technologies, proof and limitations through `getStoryStages()`, so a
 * stage can never disagree with the project page about what was built or how far
 * it got. There is deliberately no second project database in here: no counts,
 * no statuses, no technology names, no URLs.
 *
 * `steps` is the one place where authored architecture appears. Those labels are
 * illustrative descriptions of a pipeline, which is why every diagram is marked
 * as illustrative in the UI rather than presented as a recording of a running
 * system.
 */
export interface StoryStep {
  /** Stable key for animation and DOM ids. */
  id: string;
  label: string;
  /** One short line explaining what happens at this step. */
  detail: string;
}

export interface StoryStage {
  /** Stable section id. Used for anchors and skip navigation. */
  id: string;
  /** The one-word verb of the stage. */
  kicker: string;
  title: string;
  domain: Domain;
  /** Canonical project this stage is about. */
  projectSlug?: string;
  /** Set instead of projectSlug when the stage is about upstream work. */
  contributions?: boolean;
  /** The claim the stage is making, in one sentence. */
  lede: string;
  /** Two or three sentences of explanation. */
  body: string;
  steps: StoryStep[];
  /**
   * The honest caveat shown with the diagram. Required on every stage: each of
   * these visualisations is a drawing of an architecture, and none of them is a
   * recording of production software.
   */
  caveat: string;
  /** Existing destination. Validated against routes that exist today. */
  href: string;
}

export const storyStages: StoryStage[] = [
  {
    id: 'story-built',
    kicker: 'Built',
    title: 'A reporting platform that runs a field operation',
    domain: 'product',
    projectSlug: 'rodift',
    lede:
      'Connecting a mobile app, a backend, a role hierarchy and a management dashboard into one workflow that people depend on daily.',
    body:
      'Field staff report an outlet problem from their phone. The report is geo-matched to the nearest outlet, routed through the organisation’s role hierarchy, and driven to resolution with push notifications and an auditable trail. Management sees what is outstanding from a web dashboard.',
    steps: [
      { id: 'report', label: 'Field report', detail: 'Staff file an issue from the mobile app.' },
      { id: 'validate', label: 'Validation', detail: 'The report is checked and geo-matched to the nearest outlet.' },
      { id: 'backend', label: 'Backend', detail: 'Stored with spatial data and an auditable history.' },
      { id: 'assign', label: 'Assignment', detail: 'Routed through the organisation role hierarchy.' },
      { id: 'notify', label: 'Notification', detail: 'The responsible role is pushed the issue.' },
      { id: 'oversee', label: 'Management', detail: 'The dashboard shows what is still outstanding.' },
      { id: 'resolve', label: 'Resolution', detail: 'Closed with the trail intact.' },
    ],
    caveat:
      'Illustrative architecture, not a recording of the client system. This is a client-owned platform: no operational data, screenshots or business outcomes are shown.',
    href: '/projects#rodift',
  },
  {
    id: 'story-verified',
    kicker: 'Verified',
    title: 'A dependency bump is not a proven fix',
    domain: 'security',
    projectSlug: 'veripatch',
    lede:
      'Automated remediation is usually applied on trust. Nothing proves the vulnerability is actually gone, or that the fix did not break the project.',
    body:
      'VeriPatch treats a candidate fix as a hypothesis. It applies the change to an isolated copy, re-runs the scanner inside a container, runs the build and tests, and only then emits an evidence report describing what it actually observed.',
    steps: [
      { id: 'scan', label: 'Scan', detail: 'Read the dependency tree of the project.' },
      { id: 'detect', label: 'Detect', detail: 'Identify advisories affecting resolved versions.' },
      { id: 'select', label: 'Select remediation', detail: 'Choose a candidate upgrade to test.' },
      { id: 'isolate', label: 'Isolated copy', detail: 'Apply the change to a copy, never the working tree.' },
      { id: 'container', label: 'Docker verification', detail: 'Run the check in a controlled container.' },
      { id: 'rescan', label: 'Rescan', detail: 'Confirm the advisory no longer resolves.' },
      { id: 'build', label: 'Build & test', detail: 'Check the fix did not break the project.' },
      { id: 'evidence', label: 'Evidence', detail: 'Emit a report of what was observed.' },
    ],
    caveat:
      'Illustrative pipeline. Verifying a specific advisory is eliminated is not the same as eliminating all vulnerabilities or supply-chain risk, and this does not claim to.',
    href: '/projects#veripatch',
  },
  {
    id: 'story-researched',
    kicker: 'Researched',
    title: 'Asking whether a RAG system knows what it is missing',
    domain: 'ai',
    projectSlug: 'knowledgeguard',
    lede:
      'A working retrieval demo proves very little. The question is whether a system can diagnose how its evidence is deficient, and whether that diagnosis is useful.',
    body:
      'A purpose-built benchmark pairs questions with evidence that is deficient in a specific, typed way. A controlled factorial then crosses those deficiency types against candidate repair actions, so the question becomes measurable rather than anecdotal.',
    steps: [
      { id: 'question', label: 'Question', detail: 'A query is posed against the corpus.' },
      { id: 'retrieve', label: 'Retrieved evidence', detail: 'The system returns what it can find.' },
      { id: 'deficiency', label: 'Evidence deficiency', detail: 'The evidence is typed: missing, insufficient, conflicting, outdated, or absent from the corpus.' },
      { id: 'repair', label: 'Repair action', detail: 'A candidate response is selected for that deficiency.' },
      { id: 'evaluate', label: 'Evaluation', detail: 'Each pairing is run under the same controlled conditions.' },
      { id: 'result', label: 'Result', detail: 'The factorial has been executed and the analysis completed.' },
    ],
    caveat:
      'Illustrative design, not a results chart. The study asks whether typed diagnosis carries actionable information; it does not establish a universal or final repair policy. The repository is private, so the benchmark and analysis are not currently publishable.',
    href: '/projects#knowledgeguard',
  },
  {
    id: 'story-systems',
    kicker: 'Systems',
    title: 'Messages that move with no internet in the path',
    domain: 'systems',
    projectSlug: 'emergency-mesh',
    lede:
      'When there is no cell service and no server, delivery stops being a request and becomes a scheduling problem under physical constraints.',
    body:
      'Phones discover each other over Bluetooth Low Energy and carry messages for one another. Because a peer may be out of range at the moment of sending, messages are encrypted, persisted, and forwarded opportunistically when a link becomes available.',
    steps: [
      { id: 'discover', label: 'Discovery', detail: 'Nearby peers are found over BLE.' },
      { id: 'prepare', label: 'Prepare', detail: 'The message is framed for transport.' },
      { id: 'encrypt', label: 'Encrypt', detail: 'Encrypted before it leaves the device.' },
      { id: 'transfer', label: 'Transfer', detail: 'Handed to a peer within range.' },
      { id: 'store', label: 'Store & forward', detail: 'Held on the device until a link exists.' },
      { id: 'ack', label: 'Acknowledge', detail: 'Delivery is confirmed where the path supports it.' },
    ],
    caveat:
      'Illustrative protocol simulation, not a recording of deployed hardware. The protocol, routing, cryptography, persistence and native BLE transport are built and tested, but real multi-hop relay across physical devices is not yet fully validated, and this is not suitable for real emergencies.',
    href: '/projects#emergency-mesh',
  },
  {
    id: 'story-contributed',
    kicker: 'Contributed',
    title: 'Working inside codebases other people maintain',
    domain: 'open-source',
    contributions: true,
    lede:
      'Shipping your own repository is one skill. Landing a change in someone else’s, under their review and their standards, is a different one.',
    body:
      'Each entry below is a real pull request against an upstream project, shown with the status it currently has. Reading an unfamiliar codebase well enough to change it safely is the part that transfers to a team.',
    steps: [
      { id: 'read', label: 'Read the codebase', detail: 'Understand conventions written by someone else.' },
      { id: 'scope', label: 'Scope the change', detail: 'Keep the diff small enough to review.' },
      { id: 'propose', label: 'Open the PR', detail: 'Submit it to the maintainers.' },
      { id: 'review', label: 'Review', detail: 'Respond to the project’s standards, not your own.' },
      { id: 'merge', label: 'Merge', detail: 'The change lands upstream.' },
    ],
    caveat:
      'Statuses are read from the canonical contribution records. Open pull requests are shown as open; nothing here is a contribution score or a simulated activity graph.',
    href: '/projects#open-source',
  },
];
