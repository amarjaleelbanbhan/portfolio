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
    method:
      'Fully within-record 5 x 6 factorial: every source record is instantiated under every deficiency type and run under every repair action, including cells no router would choose. Deficiency type is oracle by design, so the factorial measures whether type carries information independently of whether it can be detected. Methods were frozen and the analysis script committed before the first result row existed.',
    dataset:
      'EGB, built on the HoH corpus (18,807 indexed passages) — the only available source with real superseded values, which OUTDATED requires. Four of six construction operators are purely subtractive; nothing is fabricated. HotpotQA is held as a separate replication factorial and is never pooled.',
    results:
      'Type and action interact strongly (partial eta-squared 0.32, permutation p = 1e-4). Oracle routing beats the best type-agnostic policy by 6.6 F1 points, 95% CI [2.6, 10.5]. But with a real detector the benefit reverses: predicted routing scores 0.064 F1 below type-agnostic. The headroom is real and, on this evidence, unreachable.',
    limitations: [
      'One corpus, one language, and a 250M-parameter local reader, so absolute numbers are not comparable with published RAG systems; the factorial is a within-instance contrast.',
      'Every conflict result is scoped to constructed, resolvable conflict. Natural, unresolvable conflict is in the benchmark for detection only.',
      'Constructed conflict is far easier to detect than natural conflict — recall 0.957 against 0.574 — so detection results do not generalise from the constructed set.',
      'The benchmark fails its own surface-leakage gate on detection for some types, and the failure is reported rather than repaired.',
      'The only cell surviving multiple-comparison correction was later found to be measuring a construction artifact rather than conflict resolution; the pre-registered replication that would settle it has not been run.',
      'The HotpotQA replication factorial has not been completed.',
    ],
    corrections: [
      'Correction 2026-09-17: the CONFLICTING x ARBITRATE cell is not conflict resolution. ARBITRATE scores identically whether or not a conflict is present, and the injected counter-passage carries two perfect surface fingerprints. The number stands; the causal reading does not.',
    ],
    futureWork: [
      'E6 — the pre-registered replication that tests whether the construction artifact explains the CONFLICTING x ARBITRATE effect. Not yet run.',
      'Completing the HotpotQA replication factorial.',
    ],
    source: { visibility: 'private', label: 'Private repository' },
    projectSlug: 'knowledgeguard',
    proof: [
      {
        id: 'res-knowledgeguard-executed',
        type: 'research-result',
        label: 'Factorial executed',
        value: '1,410 balanced cells',
        description:
          '47 records x 5 deficiency types x 6 repair actions, every cell n = 47. Run 2026-09-15 on a local generator with no API spend.',
        verified: true,
        asOf: '2026-09-15',
      },
      {
        id: 'res-knowledgeguard-preregistered',
        type: 'research-result',
        label: 'Analysis pre-registered',
        description:
          'Methods frozen and written before the run; the analysis script, including its out-of-sample selection rule, was committed before the first result row existed.',
        verified: true,
        asOf: '2026-09-15',
      },
      {
        id: 'res-knowledgeguard-correction',
        type: 'research-result',
        label: 'Self-published correction',
        description:
          'A forensic re-analysis of the frozen artifacts found the headline cell was measuring a construction artifact. Published against the original rather than replacing it.',
        verified: true,
        asOf: '2026-09-17',
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
    id: 'res-scar-os',
    slug: 'scar-os',
    title: 'SCAR-OS — voice and intent-driven interaction in a developer operating environment',
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
    projectSlug: 'scar-os',
    proof: [],
  },
];
