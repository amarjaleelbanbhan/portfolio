/**
 * BUILT — RODIFT.
 *
 * A connected application architecture: a report leaves a phone, is validated
 * and geo-matched, lands in the backend, is routed by role, notifies the
 * responsible person, surfaces on a dashboard, and closes.
 *
 * Drawn as a flow with a visible mobile origin and a visible management
 * endpoint, because the claim of this stage is that the two are connected by a
 * working pipeline — not that any particular screen looks a certain way. There
 * is deliberately no imitation of the client's real interface.
 */
import { DiagramFrame, DiagramLink, DiagramNode, DiagramPulse, DiagramCaption } from './DiagramPrimitives';

const PATH_MAIN = 'M 50 62 L 290 62';
const PATH_DOWN = 'M 262 76 L 262 104';
const PATH_BACK = 'M 236 118 L 188 118';
const PATH_RESOLVE = 'M 134 118 L 92 118 L 92 157 L 64 157';

export default function BuiltDiagram({ color, reduced = false }) {
  return (
    <DiagramFrame
      title="RODIFT reporting architecture"
      desc="A field report travels from a mobile app through validation and geo-matching to the backend, is assigned through the role hierarchy, pushed to the responsible role, shown on the management dashboard and closed with an audit trail."
    >
      {/* Phone outline — the origin of every report. */}
      <rect x={16} y={36} width={34} height={52} rx={5} fill="rgba(8,12,26,0.8)" stroke={color} strokeOpacity={0.5} />
      <rect x={21} y={43} width={24} height={33} rx={2} fill={`${color}1a`} />
      <circle cx={33} cy={82} r={2.2} fill={color} fillOpacity={0.7} />
      <DiagramCaption x={33} y={100}>MOBILE</DiagramCaption>

      <DiagramLink d={PATH_MAIN} color={color} reduced={reduced} delay={0.15} />
      <DiagramLink d={PATH_DOWN} color={color} reduced={reduced} delay={0.45} />
      <DiagramLink d={PATH_BACK} color={color} reduced={reduced} delay={0.6} />
      <DiagramLink d={PATH_RESOLVE} color={color} reduced={reduced} delay={0.8} dashed />

      <DiagramPulse d={PATH_MAIN} color={color} reduced={reduced} dur={3} />
      <DiagramPulse d={PATH_BACK} color={color} reduced={reduced} dur={3} delay={1.2} />

      <DiagramNode x={100} y={62} label="Validate" color={color} reduced={reduced} delay={0.25} width={54} />
      <DiagramNode x={178} y={62} label="Geo-match" color={color} reduced={reduced} delay={0.35} width={64} />
      <DiagramNode x={262} y={62} label="Backend" color={color} active reduced={reduced} delay={0.45} width={56} />
      <DiagramNode x={262} y={118} label="Assign" color={color} reduced={reduced} delay={0.6} width={52} />
      <DiagramNode x={160} y={118} label="Notify" color={color} reduced={reduced} delay={0.7} width={52} />

      {/* Management dashboard — the other end of the workflow. */}
      <rect x={16} y={140} width={46} height={34} rx={4} fill="rgba(8,12,26,0.8)" stroke={color} strokeOpacity={0.5} />
      <rect x={22} y={146} width={16} height={4} rx={1} fill={color} fillOpacity={0.5} />
      <rect x={22} y={154} width={34} height={3} rx={1} fill={color} fillOpacity={0.3} />
      <rect x={22} y={161} width={27} height={3} rx={1} fill={color} fillOpacity={0.3} />
      <DiagramCaption x={39} y={186}>DASHBOARD</DiagramCaption>

      <DiagramCaption x={296} y={96} anchor="end">ROLE HIERARCHY</DiagramCaption>
      <DiagramCaption x={160} y={138}>AUDIT TRAIL</DiagramCaption>

    </DiagramFrame>
  );
}
