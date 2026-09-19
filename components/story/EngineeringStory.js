/**
 * The homepage engineering story.
 *
 * BUILT → VERIFIED → RESEARCHED → SYSTEMS → CONTRIBUTED, one stage per claim,
 * each anchored to a real project or to real upstream contributions.
 *
 * Layout is two different compositions rather than one squeezed:
 *
 *   wide    a sticky column holds the progress rail and the diagram for the
 *           stage being read, while the explanatory text scrolls past it
 *   narrow  a horizontal rail at the top, then each stage with its own diagram
 *           inline beneath it — no sticky panel, no scroll-jacking
 *
 * Scroll position only ever decides *emphasis*. Every stage is fully rendered
 * and fully readable from first paint, so a fast scroll, a refresh, a jump link
 * or a failed observer can never leave a section blank. That rule comes from
 * Phase 1, which shipped the opposite and had to fix it.
 *
 * On the Engineering Core: this story does not drive it and does not fork
 * `useCoreInteraction`. The hero canvas is off-screen by the time the story is
 * being read, and SceneCanvas deliberately stops its frame loop when off-screen
 * — keeping it running purely to mirror the active stage is exactly the cost
 * Phase 5 was told to avoid. The connection is kept instead through the shared
 * domain identity: each stage carries the same `data-domain` and the same
 * `--domain-*` accent the Core uses, so the colour that lit a node in the hero
 * is the colour heading its chapter here.
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getStoryStages } from '@/lib/content';
import { useIsWide, usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { fadeUp } from '@/lib/motion';
import useActiveStage from './useActiveStage';
import StageProgress from './StageProgress';
import StoryStage from './StoryStage';
import StageDiagram from './StageDiagram';

const stages = getStoryStages();

export default function EngineeringStory() {
  const isWide = useIsWide();
  const reduced = usePrefersReducedMotion();
  const ids = useMemo(() => stages.map((s) => s.id), []);
  const activeId = useActiveStage(ids);

  const activeStage = stages.find((s) => s.id === activeId) ?? stages[0];

  return (
    <section
      id="engineering-story"
      aria-labelledby="engineering-story-heading"
      className="section-container scroll-mt-24"
    >
      <motion.div {...fadeUp()} className="mb-8 lg:mb-12">
        <p className="section-label">{'// what I actually build'}</p>
        <h2 id="engineering-story-heading" className="section-heading max-w-3xl text-balance">
          Five things I can show you, end to end
        </h2>
        <p className="mt-3 text-slate-400 leading-relaxed max-w-2xl">
          Each stage is a real project or a real upstream contribution, with the status it has
          actually reached and the limitations it actually has. The diagrams explain how the
          systems work; they are drawings, not recordings.
        </p>
      </motion.div>

      {/* Narrow: the rail runs horizontally above the stages. */}
      {!isWide && (
        <div className="mb-6">
          <StageProgress stages={stages} activeId={activeId} orientation="horizontal" />
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12 xl:gap-16">
        {/* The narrative column. */}
        <div className="min-w-0">
          {stages.map((stage, index) => (
            <StoryStage
              key={stage.id}
              stage={stage}
              index={index}
              // Narrow screens get the diagram inline with its own stage; wide
              // screens share the one sticky panel instead.
              showDiagram={!isWide}
              reduced={reduced}
            />
          ))}
        </div>

        {/* Wide: sticky rail + the diagram for whatever is being read. */}
        {isWide && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <StageProgress stages={stages} activeId={activeId} />
              <div key={activeStage.id}>
                <StageDiagram stage={activeStage} reduced={reduced} />
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
