/**
 * 2D Engineering Core.
 *
 * Shown whenever WebGL is unavailable, the device is minimal-tier, or the
 * visitor asked for reduced motion. It is the same diagram drawn in SVG — core,
 * five weighted links, five nodes — not a placeholder, and it highlights on the
 * same interaction state, so no information or interaction is lost without 3D.
 *
 * Link opacity is derived from evidence exactly as in the 3D scene, so the two
 * renderings agree about which domains carry the most work.
 */
import { angleToUnit } from './coreLayout';

const VIEW = 240;
const CENTRE = VIEW / 2;
const RADIUS = 78;

export default function CoreFallback({ domains, active }) {
  const maxStat = Math.max(...domains.map((d) => d.stat.value), 1);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="w-full h-full max-w-[380px] max-h-[380px]"
        role="img"
        aria-label="Engineering core: five connected domains — product, AI, security, systems and open source."
      >
        <defs>
          <radialGradient id="core-glow">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={CENTRE} cy={CENTRE} r={54} fill="url(#core-glow)" />

        {/* Schematic enclosure — the same read as the 3D wireframe shell. */}
        <circle
          cx={CENTRE}
          cy={CENTRE}
          r={RADIUS}
          fill="none"
          stroke="#14b8a6"
          strokeOpacity="0.14"
          strokeDasharray="3 5"
        />

        {domains.map((domain) => {
          const { x, y } = angleToUnit(domain.angle);
          const nx = CENTRE + x * RADIUS;
          const ny = CENTRE - y * RADIUS;
          const isActive = active === domain.domain;
          const isDimmed = Boolean(active) && !isActive;
          const weight = domain.stat.value / maxStat;

          return (
            <g
              key={domain.domain}
              style={{
                opacity: isDimmed ? 0.3 : 1,
                transition: 'opacity var(--duration-normal) cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <line
                x1={CENTRE}
                y1={CENTRE}
                x2={nx}
                y2={ny}
                stroke={domain.color}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 0.95 : 0.18 + weight * 0.42}
              />
              <circle
                cx={nx}
                cy={ny}
                r={isActive ? 11 : 8}
                fill={domain.color}
                fillOpacity={isActive ? 0.35 : 0.18}
                stroke={domain.color}
                strokeWidth="1.5"
                style={{ transition: 'r var(--duration-normal) cubic-bezier(0.16,1,0.3,1)' }}
              />
            </g>
          );
        })}

        {/* Central core, drawn last so it sits above the links. */}
        <circle cx={CENTRE} cy={CENTRE} r={15} fill="#07111f" stroke="#5eead4" strokeWidth="1.5" />
        <circle cx={CENTRE} cy={CENTRE} r={6} fill="#14b8a6" />
      </svg>
    </div>
  );
}
