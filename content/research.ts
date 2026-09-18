import type { ResearchProject } from './types';

/**
 * Research entries. Modelled separately from products because a study has a
 * question and a result, not a release and users.
 *
 * Prose is not duplicated from `projects.ts`; a project points here via
 * `researchSlug` and an entry points back via `projectSlug`.
 *
 * Only what the source material actually states is recorded. Fields with no
 * evidence are left undefined rather than filled with plausible text.
 */
export const researchProjects: ResearchProject[] = [
  {
    id: 'res-knowledgeguard',
    slug: 'knowledgeguard',
    title: 'KnowledgeGuard / EGB — typed evidence-deficiency diagnosis and repair for RAG',
    status: 'complete',
    publicStage: 'Controlled study — analysis complete',
    researchQuestion:
      'Can a RAG system identify how its retrieved evidence is deficient — missing, insufficient, conflicting, outdated, or absent from the corpus — and does that diagnosis carry actionable information for selecting a repair action?',
    method: 'Controlled factorial experiment over a purpose-built benchmark.',
    dataset: 'Benchmark constructed on real data.',
    results: 'Factorial executed and analysis completed.',
    limitations: [
      'Repository is private, so the benchmark and analysis cannot currently be published.',
    ],
    source: { visibility: 'private', label: 'Private repository' },
    projectSlug: 'knowledgeguard',
    proof: [
      {
        id: 'res-knowledgeguard-executed',
        type: 'research-result',
        label: 'Benchmark built and factorial executed',
        description: 'Benchmark built on real data; experiment run; analysis complete.',
        verified: true,
        asOf: '2026-09-18',
      },
    ],
  },
  {
    id: 'res-cortexward-verification',
    slug: 'cortexward-verification',
    title: 'CortexWard — closing the verification loop on automated security findings',
    status: 'active',
    publicStage: 'Pre-alpha — verification loop running',
    researchQuestion:
      'Can an agent pipeline confirm that a reported security finding is real, and that a proposed fix removes it, instead of emitting unverified findings?',
    method:
      'Multi-scanner pipeline with agent-driven triage and a sandboxed verification step.',
    limitations: [
      'Pre-alpha. Coverage and evaluation are incomplete, and results should not be treated as benchmarked.',
    ],
    source: {
      visibility: 'public',
      repositoryUrl: 'https://github.com/amarjaleelbanbhan/CortexWard',
    },
    links: { repository: 'https://github.com/amarjaleelbanbhan/CortexWard' },
    projectSlug: 'cortexward',
    proof: [],
  },
  {
    id: 'res-emergency-mesh-protocol',
    slug: 'emergency-mesh-protocol',
    title: 'Emergency Mesh — store-and-forward messaging over Bluetooth Low Energy',
    status: 'active',
    publicStage: 'Active development — transport and protocol built and tested',
    researchQuestion:
      'Can phones relay messages for each other over BLE reliably enough to be useful when there is no internet, no cell service and no server?',
    method:
      'Custom protocol with routing, encryption and persistence over a native BLE transport.',
    limitations: [
      'Protocol, routing, cryptography, persistence and the native BLE transport are built and tested; the user interface is at an early stage.',
      'Real multi-hop relay across physical devices is not yet fully validated.',
      'Not yet installable as a finished product, and not suitable for real emergencies.',
    ],
    source: { visibility: 'private', label: 'Private repository' },
    projectSlug: 'emergency-mesh',
    proof: [],
  },
  {
    id: 'res-vice-os',
    slug: 'vice-os',
    title: 'VICE OS — voice and intent-driven interaction in a developer operating environment',
    status: 'architecture-stage',
    // Kept as a single string so the public stage wording cannot drift between
    // surfaces, and cannot be upgraded by editing a card in isolation.
    publicStage: 'Current FYP — Research & Architecture Stage',
    researchQuestion:
      'How should voice and intent-driven interaction be integrated into a developer-oriented operating environment?',
    limitations: [
      'No implementation yet. The repository contains a README only.',
    ],
    source: { visibility: 'private', label: 'Private repository' },
    projectSlug: 'vice-os',
    proof: [],
  },
];
