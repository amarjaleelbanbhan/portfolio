import type { OpenSourceContribution } from './types';

/**
 * Upstream contributions. Every entry was verified against the GitHub API on
 * 2026-09-18; this file is the cached result so the public site never depends on
 * GitHub being reachable at render time.
 *
 * `loop-engineering` is `cobusgreyling/loop-engineering`. It is not
 * `block/goose` — goose#395 and goose#437 are unrelated PRs by another author.
 */
export const openSourceContributions: OpenSourceContribution[] = [
  {
    id: 'oss-pydantic-ai-5969',
    repository: 'pydantic/pydantic-ai',
    organization: 'pydantic',
    prNumber: 5969,
    url: 'https://github.com/pydantic/pydantic-ai/pull/5969',
    title: 'Fix AGUIAdapter.dump_messages reordering ToolReturnPart after UserPromptPart',
    summary:
      'Message parts were being re-ordered during adapter serialization, putting a tool return after the user prompt that triggered it.',
    status: 'merged',
    openedAt: '2026-06-17',
    mergedAt: '2026-07-01',
    languages: ['Python'],
    areas: ['AI', 'Agents'],
    proof: [
      {
        id: 'oss-pydantic-ai-5969-merged',
        type: 'merged-pr',
        label: 'Merged upstream',
        sourceUrl: 'https://github.com/pydantic/pydantic-ai/pull/5969',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'oss-promptfoo-9781',
    repository: 'promptfoo/promptfoo',
    organization: 'promptfoo',
    prNumber: 9781,
    url: 'https://github.com/promptfoo/promptfoo/pull/9781',
    title: 'Add per-test repeat option',
    summary:
      'Allows an individual test case to be repeated, so flaky or non-deterministic model behaviour can be measured per test rather than per run.',
    status: 'merged',
    openedAt: '2026-06-16',
    mergedAt: '2026-06-21',
    languages: ['TypeScript'],
    areas: ['AI', 'Evaluation', 'Developer Tools'],
    proof: [
      {
        id: 'oss-promptfoo-9781-merged',
        type: 'merged-pr',
        label: 'Merged upstream',
        sourceUrl: 'https://github.com/promptfoo/promptfoo/pull/9781',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'oss-loop-engineering-395',
    repository: 'cobusgreyling/loop-engineering',
    organization: 'cobusgreyling',
    prNumber: 395,
    url: 'https://github.com/cobusgreyling/loop-engineering/pull/395',
    title: 'Harden loop-action command execution against unquoted shell expansion',
    summary:
      'Command execution passed unquoted values to the shell, so paths or arguments containing shell metacharacters could change the command being run.',
    status: 'merged',
    mergedAt: '2026-07-27',
    languages: ['JavaScript'],
    areas: ['Security', 'Developer Tools'],
    proof: [
      {
        id: 'oss-loop-engineering-395-merged',
        type: 'merged-pr',
        label: 'Merged upstream',
        sourceUrl: 'https://github.com/cobusgreyling/loop-engineering/pull/395',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'oss-loop-engineering-437',
    repository: 'cobusgreyling/loop-engineering',
    organization: 'cobusgreyling',
    prNumber: 437,
    url: 'https://github.com/cobusgreyling/loop-engineering/pull/437',
    title: 'loop_estimate_cost honors early_exit_required',
    summary:
      'Cost estimation ignored the early-exit flag, so estimates did not match what the loop would actually execute.',
    status: 'merged',
    mergedAt: '2026-07-31',
    languages: ['JavaScript'],
    areas: ['AI', 'Developer Tools'],
    proof: [
      {
        id: 'oss-loop-engineering-437-merged',
        type: 'merged-pr',
        label: 'Merged upstream',
        sourceUrl: 'https://github.com/cobusgreyling/loop-engineering/pull/437',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'oss-mcts-233',
    repository: 'MCP-Audit/MCTS',
    organization: 'MCP-Audit',
    prNumber: 233,
    url: 'https://github.com/MCP-Audit/MCTS/pull/233',
    title: 'Add doctor optional toolchain checks',
    summary:
      'Extends the doctor command to report on optional toolchain dependencies instead of failing opaquely when they are absent.',
    status: 'merged',
    mergedAt: '2026-06-11',
    languages: ['Python'],
    areas: ['Developer Tools'],
    proof: [
      {
        id: 'oss-mcts-233-merged',
        type: 'merged-pr',
        label: 'Merged upstream',
        sourceUrl: 'https://github.com/MCP-Audit/MCTS/pull/233',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'oss-asf-dna-195',
    repository: 'AcademySoftwareFoundation/dna',
    organization: 'AcademySoftwareFoundation',
    prNumber: 195,
    url: 'https://github.com/AcademySoftwareFoundation/dna/pull/195',
    title: 'Fix SPI v2 Uvicorn app target',
    summary:
      'Documentation pointed at the wrong ASGI application target, so following it verbatim failed to start the service.',
    status: 'merged',
    openedAt: '2026-09-15',
    mergedAt: '2026-09-17',
    languages: ['Python'],
    areas: ['Documentation', 'Infrastructure'],
    proof: [
      {
        id: 'oss-asf-dna-195-merged',
        type: 'merged-pr',
        label: 'Merged upstream',
        sourceUrl: 'https://github.com/AcademySoftwareFoundation/dna/pull/195',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'oss-eye-tracker-61',
    repository: 'shaal/eye-tracker',
    organization: 'shaal',
    prNumber: 61,
    url: 'https://github.com/shaal/eye-tracker/pull/61',
    title: 'Tell a collapsed axis apart from a uniform offset in describeBiasPattern',
    summary:
      'Bias description conflated two distinct failure shapes — an axis with no spread and an axis uniformly shifted — reporting both the same way.',
    status: 'open',
    languages: ['TypeScript'],
    areas: ['Data Analysis'],
    proof: [
      {
        id: 'oss-eye-tracker-61-open',
        type: 'merged-pr',
        label: 'Open upstream pull request',
        sourceUrl: 'https://github.com/shaal/eye-tracker/pull/61',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
];
