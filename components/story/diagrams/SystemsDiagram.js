/**
 * SYSTEMS — Emergency Mesh.
 *
 * Phone-like nodes with BLE range rings, showing discovery, an encrypted
 * message handed to a peer in range, and a message held on a device when the
 * next hop is not reachable.
 *
 * Two deliberate honesty decisions in the drawing itself:
 *
 * 1. The far node is drawn OUT of range, with its link dashed and unacknowledged.
 *    Animating a clean multi-hop delivery would imply live multi-hop relay has
 *    been validated across physical devices, and the canonical research record
 *    says it has not.
 * 2. The acknowledgement is shown only on the hop that completes, because that
 *    is the hop the protocol can currently confirm.
 *
 * The stage caveat states the same thing in words; this is the version a reader
 * absorbs without reading.
 */
import { DiagramFrame, DiagramCaption, DiagramLink, DiagramPulse } from './DiagramPrimitives';
import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';

const HOP = 'M 78 96 L 150 96';

function Phone({ x, y, color, label, active = false, reduced = false, delay = 0, range = true }) {
  return (
    <motion.g
      initial={reduced ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: duration.normal, delay, ease: ease.outExpo }}
    >
      {range && (
        <circle
          cx={x}
          cy={y}
          r={34}
          fill={`${color}0a`}
          stroke={color}
          strokeOpacity={0.18}
          strokeDasharray="2 4"
        />
      )}
      <rect
        x={x - 11}
        y={y - 18}
        width={22}
        height={36}
        rx={4}
        fill="rgba(8,12,26,0.9)"
        stroke={color}
        strokeOpacity={active ? 0.9 : 0.45}
        strokeWidth={active ? 1.5 : 1}
      />
      <rect x={x - 7} y={y - 13} width={14} height={22} rx={1.5} fill={`${color}${active ? '33' : '1a'}`} />
      <DiagramCaption x={x} y={y + 32}>{label}</DiagramCaption>
    </motion.g>
  );
}

export default function SystemsDiagram({ color, reduced = false }) {
  return (
    <DiagramFrame
      title="Emergency Mesh illustrative protocol simulation"
      desc="Phones discover nearby peers over Bluetooth Low Energy. A message is encrypted, handed to a peer within range and acknowledged. When the next peer is out of range the message is stored on the device and forwarded opportunistically. Real multi-hop relay across physical devices is not yet fully validated."
    >
      <DiagramCaption x={160} y={16} dim={false}>
        ILLUSTRATIVE PROTOCOL SIMULATION
      </DiagramCaption>

      <Phone x={46} y={96} color={color} label="SENDER" active reduced={reduced} delay={0.1} />
      <Phone x={160} y={96} color={color} label="PEER" reduced={reduced} delay={0.25} />
      {/* Out of range: no range ring drawn around the link, link stays dashed. */}
      <Phone x={272} y={96} color={color} label="OUT OF RANGE" reduced={reduced} delay={0.4} range={false} />

      {/* The hop that completes. */}
      <DiagramLink d={HOP} color={color} reduced={reduced} delay={0.5} active />
      <DiagramPulse d={HOP} color={color} reduced={reduced} dur={2.6} />
      <DiagramCaption x={114} y={86}>ENCRYPTED</DiagramCaption>
      <DiagramCaption x={114} y={112} dim={false}>ACK</DiagramCaption>

      {/* The hop that cannot complete yet — dashed, no pulse, no ACK. */}
      <DiagramLink d="M 188 96 L 244 96" color={color} reduced={reduced} delay={0.7} dashed />
      <DiagramCaption x={216} y={86}>NO LINK</DiagramCaption>

      {/* Stored on the device until a link exists. */}
      <motion.g
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.normal, delay: 0.85, ease: ease.outExpo }}
      >
        <rect x={138} y={140} width={44} height={20} rx={4} fill="rgba(8,12,26,0.9)" stroke={color} strokeOpacity={0.5} />
        <text
          x={160}
          y={153}
          textAnchor="middle"
          className="font-code"
          style={{ fontSize: 7, fill: '#cbd5e1' }}
        >
          QUEUED
        </text>
        <DiagramCaption x={160} y={174}>STORE &amp; FORWARD</DiagramCaption>
      </motion.g>
      <DiagramLink d="M 160 116 L 160 138" color={color} reduced={reduced} delay={0.8} dashed />
    </DiagramFrame>
  );
}
