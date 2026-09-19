/**
 * Picks the right diagram for a stage and frames it identically for all five.
 *
 * The diagrams are lazily loaded: each is only SVG and Framer Motion, but there
 * is no reason to ship five of them in the initial homepage payload when the
 * hero already carries a 3D stack. `ssr: false` keeps them out of the server
 * render; the frame below reserves their height so nothing shifts when they
 * arrive.
 *
 * The caveat under each drawing is not decoration. Every one of these is an
 * authored illustration of an architecture, and saying so is the difference
 * between explaining a system and implying a recording of one.
 */
import dynamic from 'next/dynamic';

// A fixed-ratio placeholder, so lazy loading cannot cause layout shift.
const placeholder = () => <div className="w-full aspect-[320/200]" />;

const BuiltDiagram = dynamic(() => import('./diagrams/BuiltDiagram'), { ssr: false, loading: placeholder });
const VerifiedDiagram = dynamic(() => import('./diagrams/VerifiedDiagram'), { ssr: false, loading: placeholder });
const ResearchedDiagram = dynamic(() => import('./diagrams/ResearchedDiagram'), { ssr: false, loading: placeholder });
const SystemsDiagram = dynamic(() => import('./diagrams/SystemsDiagram'), { ssr: false, loading: placeholder });
const ContributedDiagram = dynamic(() => import('./diagrams/ContributedDiagram'), { ssr: false, loading: placeholder });

const DIAGRAMS = {
  'story-built': BuiltDiagram,
  'story-verified': VerifiedDiagram,
  'story-researched': ResearchedDiagram,
  'story-systems': SystemsDiagram,
  'story-contributed': ContributedDiagram,
};

export default function StageDiagram({ stage, reduced = false }) {
  const Diagram = DIAGRAMS[stage.id];
  if (!Diagram) return null;

  return (
    <figure className="m-0" data-domain={stage.domain}>
      <div
        className="surface-card p-4 sm:p-5"
        style={{ borderColor: `${stage.color}26` }}
      >
        <Diagram
          color={stage.color}
          reduced={reduced}
          contributions={stage.contributionList}
        />
      </div>
      <figcaption className="mt-2.5 text-[11px] text-slate-500 leading-relaxed">
        {stage.caveat}
      </figcaption>
    </figure>
  );
}
