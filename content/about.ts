/**
 * Canonical content for /about.
 *
 * This file holds only what genuinely cannot be derived: how Amar describes his
 * own work, and which recorded engineering decisions are worth putting in front
 * of a reader first. Every factual thing on the page — education, credentials,
 * merged pull requests, the current FYP's stage, project statuses — is looked up
 * from the records it already lives in.
 *
 * The rule the page is built on: **a principle has to point at work that
 * demonstrates it.** "I care about failure modes" is something anyone can type.
 * Validation therefore requires every principle to reference real project slugs,
 * and every featured decision to resolve to a decision that actually exists in
 * that project's case study — so a claim about how Amar works cannot be added
 * here without the evidence for it existing somewhere else first.
 */

/** One paragraph of self-description. Kept as data so it is reviewable. */
export interface AboutIntro {
  id: string;
  body: string;
}

/**
 * A way of working, and the projects where it is visible.
 *
 * `projectSlugs` is required and validated. A principle that points at nothing
 * is an adjective.
 */
export interface EngineeringPrinciple {
  id: string;
  title: string;
  /** What it means in practice, in Amar's own terms. */
  body: string;
  /** Where a reader can see it. Validated against the project registry. */
  projectSlugs: string[];
}

/**
 * A recorded decision worth leading with.
 *
 * Both fields are validated: the project must exist, and it must actually carry
 * a case-study decision with this id. The decision's own text is never copied
 * here — it is read from the project record at render time, so this page and the
 * case study cannot disagree.
 */
export interface FeaturedDecision {
  projectSlug: string;
  decisionId: string;
}

/** A kind of work Amar is open to, stated plainly. */
export interface Opportunity {
  id: string;
  label: string;
  detail: string;
}

export const aboutIntro: AboutIntro[] = [
  {
    id: 'intro-who',
    body:
      'I am a software engineer and a computer science student at Sukkur IBA University. I got tired of projects that look finished in a screenshot and started building ones that have to keep working after the demo — which turns out to be a completely different job, and the one I find interesting.',
  },
  {
    id: 'intro-what',
    body:
      'Most of my work sits where implementation quality decides whether something is real: a field-reporting platform an organisation depends on daily, a security tool that refuses to call a fix verified until it has re-run the scanner inside a container, a controlled study that ended up publishing a correction against its own headline result, and a mesh protocol whose page says plainly which parts have run on a phone and which have only run in a simulator.',
  },
  {
    id: 'intro-how',
    body:
      'I would rather show the gap than hide it. Every project on this site carries the status it has actually reached, the evidence behind it, and what it does not do — and the build fails if any of those references stop resolving.',
  },
];

/**
 * How Amar works, each grounded in projects a reader can open.
 *
 * Deliberately about boundaries, evidence and failure rather than about
 * enthusiasm. Every one of these is visible in the linked case studies.
 */
export const engineeringPrinciples: EngineeringPrinciple[] = [
  {
    id: 'principle-boundaries',
    title: 'Decide where trust stops, then enforce it structurally',
    body:
      'The most useful thing in a system is usually a line: what is trusted, what is not, and what is allowed to cross. Drawn well, that line is enforced by the architecture rather than by everyone remembering — a language model that cannot raise a verification level no matter what it says, a preview path that never executes the scene it is rendering, a role hierarchy that lives in the data model instead of in the client.',
    projectSlugs: ['cortexward', 'sceneforge', 'rodift'],
  },
  {
    id: 'principle-evidence',
    title: 'Treat a fix as a hypothesis until something checks it',
    body:
      'A dependency bump is not a proven fix, a passing simulation is not hardware behaviour, and a scanner finding is not an exploit. The interesting engineering is in producing the evidence: re-running the scanner inside a container after applying the change, tracing data flow rather than matching a pattern, or freezing an analysis script before the first result row exists so the number means something.',
    projectSlugs: ['veripatch', 'cortexward', 'knowledgeguard'],
  },
  {
    id: 'principle-failure',
    title: 'Design for the failure mode, not the happy path',
    body:
      'Offline messaging is a scheduling problem, not a request. Automated remediation has to survive a package that breaks the build. Field staff lose signal mid-report. Getting these right means deciding in advance what the system does when the assumption behind it stops holding, and then saying so in the interface rather than quietly showing success.',
    projectSlugs: ['emergency-mesh', 'veripatch', 'rodift'],
  },
  {
    id: 'principle-reproducible',
    title: 'Make results reproducible, including the inconvenient ones',
    body:
      'Methods frozen before the run, an analysis script committed before the first result, a reproduction that re-derives every number from frozen artifacts at a named commit. That discipline is what let a forensic re-analysis overturn my own headline finding and publish the correction against the original rather than quietly editing it.',
    projectSlugs: ['knowledgeguard'],
  },
  {
    id: 'principle-shipping',
    title: 'Shipping is part of the engineering, not a step after it',
    body:
      'A tool that only runs on the author\'s machine has not been finished. Packaging a CLI for npm, keeping a scanner adapter honest about the tools it needs, running content validation and a production build on every push — the deployment path and the maintenance story shape the design, so they are decided with it rather than bolted on.',
    projectSlugs: ['veripatch', 'portfolio', 'rodift'],
  },
];

/**
 * Decisions to lead with. Read from the projects' own case studies at render
 * time; only the selection lives here.
 */
export const featuredDecisions: FeaturedDecision[] = [
  { projectSlug: 'cortexward', decisionId: 'cw-llm-cannot-verify' },
  { projectSlug: 'knowledgeguard', decisionId: 'kg-freeze-analysis' },
  { projectSlug: 'emergency-mesh', decisionId: 'em-label-simulation' },
  { projectSlug: 'veripatch', decisionId: 'veripatch-refuse-yarn-pnpm' },
];

/**
 * What Amar is open to.
 *
 * No claimed employment, clients, availability dates or rates — only the kinds
 * of work, which is the only thing that can be stated without inventing
 * something.
 */
export const opportunities: Opportunity[] = [
  {
    id: 'opp-engineering',
    label: 'Software engineering roles and internships',
    detail:
      'Product, backend, mobile or tooling work where correctness and maintenance matter as much as the first release.',
  },
  {
    id: 'opp-security-tools',
    label: 'Security and developer tooling',
    detail:
      'Static analysis, verification pipelines, CLIs and anything where the job is making an unclear signal trustworthy.',
  },
  {
    id: 'opp-research',
    label: 'Applied AI and research engineering',
    detail:
      'Retrieval systems, evaluation harnesses and experiment design — including the unglamorous half, which is making a result hold up.',
  },
  {
    id: 'opp-open-source',
    label: 'Open-source collaboration',
    detail:
      'Reading an unfamiliar codebase well enough to change it safely, under someone else\'s review and standards.',
  },
];
