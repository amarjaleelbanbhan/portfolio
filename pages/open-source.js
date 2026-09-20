/**
 * /open-source — upstream contributions.
 *
 * One claim, made with evidence: changes of mine are in codebases other people
 * maintain. Everything on the page exists to support or qualify that, and
 * nothing on it is a summary statistic invented to look impressive — there is
 * no contribution score, no streak, no activity heat map and no derived
 * "impact". Every number here is a count of records that were individually
 * verified against the GitHub API.
 *
 * Content comes entirely from `getContributionsForDisplay()` and its sibling
 * selectors. There is deliberately no list in this file: a second copy of the
 * contribution set living next to the UI is exactly how a portfolio ends up
 * claiming a pull request is merged three months after it was closed.
 *
 * Filtering never hides a contribution behind a state the page loads in: the
 * default is unfiltered, every anchor target therefore resolves on load, and
 * clearing is always one control away.
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FilterChipGroup from '@/components/ui/FilterChipGroup';
import ContributionCard from '@/components/open-source/ContributionCard';
import UpstreamGraph from '@/components/open-source/UpstreamGraph';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { fadeUp } from '@/lib/motion';
import {
  getContributionAreas,
  getContributionStats,
  getContributionsForDisplay,
  getDaysToMerge,
  getUpstreamRepositories,
} from '@/lib/content';

const contributions = getContributionsForDisplay();
const repositories = getUpstreamRepositories();
const stats = getContributionStats();

const MERGED = '#22c55e';
const PENDING = '#8291aa';

const statusOptions = [
  { key: 'all', label: 'All', count: stats.total, color: MERGED },
  { key: 'merged', label: 'Merged', count: stats.merged, color: MERGED },
  { key: 'open', label: 'Open', count: stats.open, color: PENDING },
].filter((option) => option.count > 0);

// Areas come from the records, so a filter can never be a button that returns
// nothing, and a new technical area appears without this file changing.
const areaOptions = [
  { key: 'all', label: 'All areas', count: stats.total, color: '#38bdf8' },
  ...getContributionAreas().map((area) => ({
    key: area.key,
    label: area.key,
    count: area.count,
    color: '#38bdf8',
  })),
];

/** The headline counts. Each one is a count of verified records. */
const summary = [
  { key: 'merged', value: stats.merged, label: 'merged upstream', color: MERGED },
  { key: 'open', value: stats.open, label: 'open, not merged', color: PENDING },
  { key: 'repos', value: stats.repositories, label: 'upstream repositories', color: '#38bdf8' },
  { key: 'files', value: stats.filesChanged, label: 'files changed', color: '#986ef7' },
];

export default function OpenSource() {
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState('all');
  const [area, setArea] = useState('all');
  const [repository, setRepository] = useState(null);

  const filtered = useMemo(
    () =>
      contributions.filter((contribution) => {
        if (status !== 'all' && contribution.status !== status) return false;
        if (area !== 'all' && !contribution.areas.includes(area)) return false;
        if (repository && contribution.repository !== repository) return false;
        return true;
      }),
    [status, area, repository]
  );

  const isFiltering = status !== 'all' || area !== 'all' || Boolean(repository);
  const clear = () => {
    setStatus('all');
    setArea('all');
    setRepository(null);
  };

  return (
    <>
      <Seo
        title="Open Source — Upstream Contributions by Amar Jaleel"
        description="Upstream pull requests into Pydantic AI, Promptfoo, the Academy Software Foundation and more — each with the problem it fixed, the change, its tests and its status."
        path="/open-source"
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1 section-container" data-domain="open-source">
          {/* ── Introduction ── */}
          <motion.div {...fadeUp()} className="mb-8">
            <p className="section-label">{'// open source'}</p>
            <h1 className="section-heading max-w-3xl text-balance">
              I contribute fixes upstream, not only to my own repositories.
            </h1>
            <p className="mt-3 text-slate-400 leading-relaxed max-w-2xl">
              Shipping your own repository is one skill. Landing a change in someone else&apos;s —
              under their conventions, their review and their standards — is a different one. Each
              entry below is a real pull request, shown with the problem it addressed, what I
              actually changed, the tests the request documents, and the status it has right now.
            </p>
          </motion.div>

          {/* ── Derived counts ── */}
          <motion.div {...fadeUp({ delay: 0.05 })} className="mb-10">
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 m-0">
              {summary.map((item) => (
                <div key={item.key} className="surface-card p-4">
                  <dd
                    className="text-2xl font-bold font-code tabular-nums m-0"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </dd>
                  <dt className="text-xs text-slate-400 leading-tight mt-0.5">{item.label}</dt>
                </div>
              ))}
            </dl>
            <p className="font-code text-[11px] text-slate-600 mt-2.5">
              {`// +${stats.additions} / −${stats.deletions} lines across ${stats.filesChanged} files`}
              {stats.verifiedAsOf && (
                <>
                  {' · state, dates and diff sizes verified against the GitHub API on '}
                  <time dateTime={stats.verifiedAsOf}>{stats.verifiedAsOf}</time>
                </>
              )}
            </p>
          </motion.div>

          {/* ── Where the work landed ── */}
          <motion.section
            {...fadeUp({ delay: 0.08 })}
            aria-labelledby="graph-heading"
            className="mb-10"
          >
            <h2
              id="graph-heading"
              className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight mb-1"
            >
              Where the work landed
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mb-4">
              {stats.repositories} repositories across {stats.organizations} organizations.
            </p>
            <UpstreamGraph
              repositories={repositories}
              selected={repository}
              onSelect={setRepository}
              totalContributions={stats.total}
            />
          </motion.section>

          {/* ── Filters ── */}
          <motion.div
            {...fadeUp({ delay: 0.1 })}
            className="mb-8 space-y-3"
            aria-labelledby="filters-heading"
            role="group"
          >
            <h2 id="filters-heading" className="sr-only">
              Filter contributions
            </h2>
            <FilterChipGroup
              label="Filter contributions by status"
              idPrefix="oss-status"
              options={statusOptions}
              active={status}
              onChange={setStatus}
            />
            <FilterChipGroup
              label="Filter contributions by technical area"
              idPrefix="oss-area"
              options={areaOptions}
              active={area}
              onChange={setArea}
            />
            <div className="flex flex-wrap items-center gap-3">
              <p aria-live="polite" className="font-code text-xs text-slate-500 m-0">
                {filtered.length === contributions.length
                  ? `${contributions.length} contributions`
                  : `${filtered.length} of ${contributions.length} contributions`}
                {repository && ` · ${repository}`}
              </p>
              {isFiltering && (
                <button
                  type="button"
                  onClick={clear}
                  className="font-code text-xs text-slate-400 hover:text-neon-cyan transition-colors min-h-[44px]"
                >
                  Clear filters
                </button>
              )}
            </div>
          </motion.div>

          {/* ── Contributions ── */}
          <section aria-labelledby="contributions-heading">
            <h2 id="contributions-heading" className="sr-only">
              Upstream contributions
            </h2>

            {filtered.length === 0 ? (
              <div className="surface-card p-8 text-center">
                <p className="text-slate-300 font-medium mb-1">Nothing matches that combination.</p>
                <p className="text-sm text-slate-500 mb-4">
                  Clear the filters to see all {contributions.length} contributions.
                </p>
                <button
                  type="button"
                  onClick={clear}
                  className="font-code text-xs font-semibold px-4 py-2.5 min-h-[44px] rounded-lg border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filtered.map((contribution, index) => (
                  <ContributionCard
                    key={contribution.id}
                    contribution={contribution}
                    daysToMerge={getDaysToMerge(contribution)}
                    reduced={reduced}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── How this page is maintained ── */}
          <section
            aria-labelledby="method-heading"
            className="mt-12 pt-8 border-t border-white/5"
          >
            <h2
              id="method-heading"
              className="text-base font-semibold text-slate-200 tracking-tight mb-2"
            >
              How this page is kept honest
            </h2>
            <ul className="list-none m-0 p-0 space-y-2 max-w-2xl">
              {[
                'Status, dates and diff sizes are read from the GitHub API and cached in the content layer, so the page never depends on GitHub being reachable and never shows a state nobody checked.',
                'An open pull request is shown as open everywhere — badge, lifecycle and evidence — and content validation rejects a merged-typed proof on anything that is not merged.',
                'The problem and change for each entry are written from that pull request’s own description. Where a request documents no tests, the card says so rather than leaving a gap that reads like evidence.',
                'Nothing here counts reviews, reactions, stars or downstream impact. Those are not in the records, so they are not on the page.',
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-sm text-slate-400 leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 mt-4">
              The same engineering shows up in my own projects too —{' '}
              <Link
                href="/work"
                className="text-neon-cyan hover:text-white underline decoration-dotted underline-offset-4"
              >
                see the engineering work
              </Link>
              .
            </p>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
