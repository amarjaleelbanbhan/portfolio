/**
 * Public wording and colour for the four evidence states.
 *
 * One place, because the ledger, the per-entry breakdown and the detail panel
 * all name the same four things and must not drift into three slightly
 * different vocabularies. Keyed by the canonical `EvidenceState` union in
 * content/types.ts.
 *
 * The labels have to read correctly for all three sources a state can come
 * from — a measured finding, a protocol step verified on a real device, and a
 * verification rung — which is why they describe the evidence rather than the
 * artifact.
 */
export const EVIDENCE_STATE = {
  executed: {
    label: 'Ran and produced evidence',
    short: 'Evidenced',
    color: '#22c55e',
    detail:
      'Either a measured result from an experiment that ran, or behaviour exercised on real hardware. Something happened and it was recorded.',
  },
  built: {
    label: 'Built, not yet evaluated',
    short: 'Built',
    color: '#38bdf8',
    detail:
      'The code exists and works, but nothing has measured how well it works. Implementation is not a result.',
  },
  simulated: {
    label: 'Simulated only',
    short: 'Simulated',
    color: '#f59e0b',
    detail:
      'Exercised in a simulator and nowhere else. A passing simulation is evidence about the simulation, not about hardware.',
  },
  'not-built': {
    label: 'Not built, or not run',
    short: 'Not built',
    color: '#64748b',
    detail:
      'Planned, proposed or pre-registered, and not done. Listed so that absence is visible rather than inferred from silence.',
  },
};

/** Display order: strongest evidence first. */
export const EVIDENCE_ORDER = ['executed', 'built', 'simulated', 'not-built'];
