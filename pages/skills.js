/**
 * /skills — the technical ecosystem, backed by the work it came from.
 *
 * There is exactly one skill list on this page. Before Phase 16 there were
 * three — a languages column with its evidence, eight category panels of chips,
 * and the physics pills — all reading from canonical content but presenting it
 * three different ways, so a reader could not tell which was the real answer.
 * The Galaxy is now the canonical surface and the other two are gone as lists:
 * the cube and the physics playground stay as what they always were, which is
 * texture rather than reference.
 *
 * Deep links: `#skill-<slug>` preselects a technology, so the homepage tech
 * stack and any future surface can point straight at a skill's evidence.
 *
 * Nothing here has a proficiency number. A skill's claim is the work it points
 * at, content validation now rejects a skill with no work behind it, and every
 * item in the evidence panel is a link to the thing itself.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillCube from '@/components/SkillCube';
import SkillGalaxy from '@/components/skills/SkillGalaxy';
import SkillEvidencePanel from '@/components/skills/SkillEvidencePanel';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { fadeUp } from '@/lib/motion';
import { getSkillEvidenceDetail, getSkillGraph } from '@/lib/content';

const GravitySkills = dynamic(() => import('@/components/GravitySkills'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel p-6 h-[500px] flex items-center justify-center">
      <p className="text-slate-400 font-code text-sm">Loading Physics Engine...</p>
    </div>
  ),
});

const graph = getSkillGraph();
const evidenceBySlug = Object.fromEntries(
  graph.nodes.map((node) => [node.slug, getSkillEvidenceDetail(node.slug)])
);

const totals = {
  skills: graph.nodes.length,
  categories: graph.categories.length,
  links: graph.edges.length,
  evidence: graph.nodes.reduce((sum, node) => sum + node.evidenceCount, 0),
};

const LEARNING_COLORS = ['#8b5cf6', '#ef4444', '#f59e0b', '#14b8a6'];

// Areas of current focus. Deliberately not modelled as skills: there is no
// evidence to attach yet, and a skill in this model must point at real work.
const currentlyLearning = [
  'Program analysis and verification',
  'RAG evaluation methodology',
  'Distributed and offline-first systems',
  'Operating systems and voice interaction (FYP)',
].map((label, i) => ({ label, color: LEARNING_COLORS[i % LEARNING_COLORS.length] }));

export default function Skills() {
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState('all');

  // Deep link support. Read once on mount and on hash change, so a link from
  // the homepage tech stack lands on the right skill with its evidence open.
  useEffect(() => {
    const applyHash = () => {
      const match = /^#skill-(.+)$/.exec(window.location.hash);
      if (!match) return;
      const slug = decodeURIComponent(match[1]);
      if (evidenceBySlug[slug]) setSelected(slug);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const selectSkill = useCallback((slug) => {
    setSelected(slug);
    // Selecting a skill from another cluster should not leave the board
    // filtered to a category that hides it.
    if (slug) setCategory('all');
  }, []);

  const detail = useMemo(() => (selected ? evidenceBySlug[selected] : null), [selected]);

  return (
    <>
      <Seo
        title="Skills — Amar Jaleel"
        description="The technical ecosystem behind the work: every technology linked to the projects, research and upstream pull requests it was actually used in. No proficiency percentages."
        path="/skills"
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container">
          {/* ── Header ── */}
          <motion.div {...fadeUp()} className="mb-8">
            <p className="section-label">{'// capabilities'}</p>
            <h1 className="section-heading max-w-3xl text-balance">
              Every technology here is attached to something you can open
            </h1>
            <p className="mt-3 text-slate-400 leading-relaxed max-w-2xl">
              No proficiency bars. A percentage next to a language is self-assigned and measures
              nothing, so this shows the work instead: select a technology and the panel lists the
              projects, research and pull requests it was genuinely used in, each one a link.
            </p>
            <p className="mt-3 font-code text-[11px] text-slate-600">
              {`// ${totals.skills} technologies · ${totals.categories} clusters · ${totals.evidence} evidence links · ${totals.links} shared-work connections`}
            </p>
          </motion.div>

          {/* ── The Galaxy ── */}
          <motion.section
            {...fadeUp({ delay: 0.05 })}
            aria-labelledby="galaxy-heading"
            id="galaxy"
            className="mb-14 scroll-mt-24"
          >
            <h2 id="galaxy-heading" className="sr-only">
              Skill galaxy
            </h2>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] items-start">
              <div className="min-w-0">
                <SkillGalaxy
                  graph={graph}
                  selected={selected}
                  onSelect={selectSkill}
                  activeCategory={category}
                  onSelectCategory={(next) => {
                    setCategory(next);
                    setSelected(null);
                  }}
                  reduced={reduced}
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="font-code text-[11px] text-slate-600 m-0">
                    {'// lines join two technologies used on the same project, study or pull request'}
                  </p>
                  {(selected || category !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(null);
                        setCategory('all');
                      }}
                      className="font-code text-xs text-slate-400 hover:text-neon-cyan transition-colors min-h-[44px]"
                    >
                      Clear selection
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:sticky lg:top-20 min-w-0">
                <SkillEvidencePanel
                  detail={detail}
                  onSelectSkill={selectSkill}
                  reduced={reduced}
                />
              </div>
            </div>
          </motion.section>

          {/* ── Cube and current focus ──
              Kept from the original page. The cube is a visual signature, not a
              second skill list, and "currently learning" is deliberately not
              modelled as skills because there is nothing to attach yet. */}
          <div className="grid gap-6 lg:grid-cols-2 mb-10 [&>*]:min-w-0">
            <motion.div {...fadeUp()}>
              <SkillCube />
            </motion.div>

            <motion.div {...fadeUp({ delay: 0.05 })} className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2.5">
                <svg aria-hidden="true" className="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Currently Learning
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Not in the galaxy above, and deliberately so — there is no work to attach to these
                yet, and a technology in this model earns its place by pointing at something.
              </p>
              <ul className="list-none m-0 p-0 space-y-3">
                {currentlyLearning.map(({ label, color }) => (
                  <li key={label} className="flex items-center gap-3 text-sm text-slate-300">
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                    />
                    {label}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500 mt-5">
                The work these technologies came from is on the{' '}
                <Link
                  href="/work"
                  className="text-neon-cyan hover:text-white underline decoration-dotted underline-offset-4"
                >
                  work page
                </Link>
                .
              </p>
            </motion.div>
          </div>

          {/* ── Physics playground ──
              Preserved exactly. It is not a skill reference and never was; it is
              the part of the page that is simply enjoyable to poke at. */}
          <motion.div {...fadeUp()}>
            <GravitySkills />
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
}
