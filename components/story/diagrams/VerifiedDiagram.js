/**
 * VERIFIED — VeriPatch.
 *
 * A linear pipeline, drawn as a pipeline: the point of this stage is that a fix
 * passes through gates before anyone is asked to trust it. The isolated copy and
 * the container are drawn as an enclosure around the middle of the run, because
 * "this happened somewhere safe, not in your working tree" is the idea a reader
 * needs to take away.
 *
 * The evidence card at the end is a shape, not a fabricated report: inventing
 * plausible-looking scanner output would be inventing results.
 */
import { DiagramFrame, DiagramLink, DiagramNode, DiagramPulse, DiagramCaption } from './DiagramPrimitives';

const ROW = 'M 28 46 L 292 46';
const INTO_BOX = 'M 40 62 L 40 92';
const BOX_ROW = 'M 52 108 L 268 108';
const OUT = 'M 262 124 L 262 154 L 210 154';

export default function VerifiedDiagram({ color, reduced = false }) {
  return (
    <DiagramFrame
      title="VeriPatch verification pipeline"
      desc="A project is scanned and advisories detected. A candidate remediation is applied to an isolated copy, verified inside a Docker container by rescanning and running the build and tests, and an evidence report describes what was observed."
    >
      <DiagramLink d={ROW} color={color} reduced={reduced} delay={0.1} />
      <DiagramNode x={60} y={46} label="Scan" color={color} reduced={reduced} delay={0.15} width={50} />
      <DiagramNode x={140} y={46} label="Detect" color={color} reduced={reduced} delay={0.25} width={54} />
      <DiagramNode x={232} y={46} label="Select fix" color={color} reduced={reduced} delay={0.35} width={62} />
      <DiagramPulse d={ROW} color={color} reduced={reduced} dur={3.2} />

      <DiagramLink d={INTO_BOX} color={color} reduced={reduced} delay={0.45} dashed />

      {/* The isolation boundary — the load-bearing idea of the whole tool. */}
      <rect
        x={18}
        y={84}
        width={284}
        height={48}
        rx={8}
        fill="rgba(245,158,11,0.04)"
        stroke={color}
        strokeOpacity={0.3}
        strokeDasharray="4 4"
      />
      <DiagramCaption x={26} y={80} anchor="start" dim={false}>
        ISOLATED COPY · CONTAINER
      </DiagramCaption>

      <DiagramLink d={BOX_ROW} color={color} reduced={reduced} delay={0.6} />
      <DiagramNode x={72} y={108} label="Apply" color={color} reduced={reduced} delay={0.65} width={50} />
      <DiagramNode x={150} y={108} label="Rescan" color={color} active reduced={reduced} delay={0.75} width={56} />
      <DiagramNode x={240} y={108} label="Build + test" color={color} reduced={reduced} delay={0.85} width={70} />
      <DiagramPulse d={BOX_ROW} color={color} reduced={reduced} dur={3.2} delay={1} />

      <DiagramLink d={OUT} color={color} reduced={reduced} delay={1} />

      {/* Evidence report — a document shape, not invented scanner output. */}
      <rect x={130} y={140} width={72} height={38} rx={4} fill="rgba(8,12,26,0.85)" stroke={color} strokeOpacity={0.6} />
      <rect x={138} y={148} width={40} height={3} rx={1.5} fill={color} fillOpacity={0.75} />
      <rect x={138} y={156} width={54} height={2.5} rx={1.25} fill={color} fillOpacity={0.35} />
      <rect x={138} y={163} width={48} height={2.5} rx={1.25} fill={color} fillOpacity={0.35} />
      <rect x={138} y={170} width={30} height={2.5} rx={1.25} fill={color} fillOpacity={0.35} />
      <DiagramCaption x={166} y={190}>EVIDENCE REPORT</DiagramCaption>
    </DiagramFrame>
  );
}
