/**
 * The Engineering Core.
 *
 * Composes three layers over one interaction state:
 *
 *   1. the 3D scene (or the 2D SVG when WebGL is unavailable)
 *   2. the semantic domain navigation — real links, always in the DOM
 *   3. the description panel
 *
 * The scene is mounted through the Phase 3 SceneCanvas boundary, so capability
 * tiering, DPR caps, viewport gating, reduced-motion handling and the WebGL
 * fallback are all inherited rather than re-implemented.
 *
 * Loaded with next/dynamic and ssr:false: the 3D stack must not enter the server
 * bundle, and the hero text must paint before any of it arrives. On narrow
 * screens the ring becomes a list and the scene runs at low detail.
 */
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getCoreDomains } from '@/lib/content';
import { useIsWide } from '@/lib/useMediaQuery';
import useDeviceTier from '@/lib/useDeviceTier';
import SceneCanvas from '@/components/three/SceneCanvas';
import useCoreInteraction from './useCoreInteraction';
import DomainRing from './DomainRing';
import DomainDetail from './DomainDetail';
import CoreFallback from './CoreFallback';
import { duration, ease } from '@/lib/motion';

// Kept out of the initial payload; SceneCanvas decides whether it is ever needed.
const CoreScene = dynamic(() => import('./CoreScene'), { ssr: false });

const domains = getCoreDomains();

export default function EngineeringCore() {
  const isWide = useIsWide();
  const { tier, reducedMotion } = useDeviceTier();
  const {
    active,
    activeDomain,
    cameraState,
    setHovered,
    setFocused,
    toggle,
  } = useCoreInteraction(domains);

  // Mobile and weaker hardware get simpler geometry and no satellites.
  const detail = tier >= 2 && isWide ? 'high' : 'low';
  const activeAngle = activeDomain ? activeDomain.angle : null;

  return (
    <section
      className="relative w-full"
      aria-labelledby="engineering-core-heading"
      data-camera-state={cameraState}
    >
      <h2 id="engineering-core-heading" className="sr-only">
        Engineering domains
      </h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: duration.cinematic, delay: 0.2, ease: ease.outExpo }}
        className="relative w-full aspect-square max-w-[520px] mx-auto"
      >
        {/* Ambient wash behind the core. Contained by the parent's bounds so it
            cannot contribute to page overflow. */}
        <div
          aria-hidden="true"
          className="absolute inset-[12%] rounded-full blur-[70px] pointer-events-none"
          style={{
            background: activeDomain
              ? `radial-gradient(circle, ${activeDomain.color}26, transparent 70%)`
              : 'radial-gradient(circle, rgba(20,184,166,0.16), transparent 70%)',
            transition: 'background var(--duration-slow) cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {/* SceneCanvas sets `relative` on its own root for layering, so it must
            not also be handed `absolute` — Tailwind emits .relative after
            .absolute and the canvas container collapses to zero height. The
            wrapper does the positioning instead. */}
        <div className="absolute inset-0">
        <SceneCanvas
          className="w-full h-full"
          minTier={1}
          camera={{ position: [0, 0, 7.2], fov: 45 }}
          fallback={<CoreFallback domains={domains} active={active} />}
        >
          <CoreScene
            domains={domains}
            active={active}
            activeAngle={activeAngle}
            detail={detail}
            reducedMotion={reducedMotion}
            onHover={setHovered}
            onSelect={toggle}
          />
        </SceneCanvas>
        </div>

        {/* The accessible layer, above the canvas. On wide screens it frames the
            constellation; below that the ring would crowd, so it moves out. */}
        {isWide && (
          <DomainRing
            domains={domains}
            active={active}
            layout="ring"
            onHover={setHovered}
            onFocus={setFocused}
            onSelect={toggle}
          />
        )}
      </motion.div>

      {!isWide && (
        <div className="mt-4">
          <DomainRing
            domains={domains}
            active={active}
            layout="list"
            onHover={setHovered}
            onFocus={setFocused}
            onSelect={toggle}
          />
        </div>
      )}

      {/* Only on wide screens: the list layout already shows every description
          inline, so repeating them here would say the same thing twice. */}
      {isWide && (
        <div className="mt-5 max-w-[520px] mx-auto px-1">
          <DomainDetail domain={activeDomain} />
        </div>
      )}
    </section>
  );
}
