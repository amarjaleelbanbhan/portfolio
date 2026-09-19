import type { Domain } from './types';

/**
 * Canonical copy for the five engineering domains the homepage presents.
 *
 * This file holds only what cannot be derived: the public label, the one-line
 * description, and the destination. Everything factual — which projects belong
 * to a domain, which technologies it uses, how much evidence it has — is derived
 * from projects/skills/contributions by `getDomainSummary()`. Putting counts or
 * project names here would recreate exactly the drift Phase 2 removed.
 *
 * `research` is a canonical Domain but is deliberately not presented as a core
 * node: the homepage shows five domains, and research work surfaces through
 * KnowledgeGuard under AI and SCAR-OS under Systems. Phase 15 gives it a page.
 *
 * Destinations must be routes that exist today. Phases 6/14/15 add the real
 * ones; until then these deep-link into the project listing.
 */
export interface DomainMeta {
  domain: Domain;
  /** Short label used on the core node. */
  label: string;
  /** One line, read on hover/focus. Describes the work, claims nothing extra. */
  description: string;
  /** Existing destination. Replaced by real domain pages in later phases. */
  href: string;
  /** Where the node sits on the core ring, in degrees clockwise from top. */
  angle: number;
  /**
   * Skill slugs shown on the node, most representative first.
   *
   * Curated for readability, but validated: each slug must exist in the skill
   * registry AND be used by a non-archive project in this domain, so the list
   * can be ordered for a reader without ever claiming something untrue.
   * Omitted for open-source, which derives its nodes from merged repositories.
   */
  technologies?: string[];
}

export const coreDomains: DomainMeta[] = [
  {
    domain: 'product',
    label: 'Product',
    description:
      'End-to-end applications people actually use — a field-reporting platform running in production, plus web and mobile products built to ship rather than to demo.',
    href: '/projects#rodift',
    angle: 0,
    technologies: ['flutter', 'nextjs', 'postgresql', 'supabase'],
  },
  {
    domain: 'ai',
    label: 'AI',
    description:
      'Applied AI and retrieval research: a controlled study on evidence deficiency in RAG, agent tooling, and evaluation harnesses that measure whether a system is actually right.',
    href: '/projects#knowledgeguard',
    angle: 72,
    technologies: ['rag', 'llm-agents', 'evaluation', 'python'],
  },
  {
    domain: 'security',
    label: 'Security',
    description:
      'Developer and security tooling — a published npm CLI that verifies vulnerability fixes inside a sandbox before trusting them, and static analysis for agent codebases.',
    href: '/projects#veripatch',
    angle: 144,
    technologies: ['static-analysis', 'docker', 'cli', 'nodejs'],
  },
  {
    domain: 'systems',
    label: 'Systems',
    description:
      'Lower-level engineering: offline mesh networking over BLE with end-to-end encryption, media pipelines, and an operating-environment research project.',
    href: '/projects#emergency-mesh',
    angle: 216,
    technologies: ['ble', 'cryptography', 'ffmpeg', 'kotlin'],
  },
  {
    domain: 'open-source',
    label: 'Open Source',
    description:
      'Upstream contributions merged into projects maintained by other people, including Pydantic AI, Promptfoo and the Academy Software Foundation.',
    href: '/projects#open-source',
    angle: 288,
  },
];
