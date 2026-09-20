/**
 * Reusable React Three Fiber boundary.
 *
 * Every 3D scene in later phases mounts through here so the capability,
 * visibility, reduced-motion and fallback rules are decided once instead of
 * being re-implemented per scene.
 *
 * What it guarantees:
 *   - never renders WebGL on a device that cannot do it (tier 0 / no context)
 *   - always renders a real `fallback` instead, so the page is never empty
 *   - pauses the render loop when scrolled off-screen or the tab is hidden
 *   - honours prefers-reduced-motion by rendering a single static frame
 *   - sizes and layers consistently: the canvas fills its container and sits
 *     at --z-base, with content layered above at --z-content
 *
 * R3F had never been imported in this repository before Phase 3 (see the
 * dependency note in docs/portfolio-2026/codex-salvage-audit.md), so it is
 * loaded dynamically with ssr:false — it must not enter the server bundle or
 * the initial JS payload of pages that have no 3D at all.
 */
import { Component, Suspense } from 'react';
import dynamic from 'next/dynamic';
import useDeviceTier from '@/lib/useDeviceTier';
import useInViewport from '@/lib/useInViewport';
import useDocumentVisible from '@/lib/useDocumentVisible';

const Canvas = dynamic(() => import('@react-three/fiber').then((m) => m.Canvas), {
  ssr: false,
});

/**
 * Catches anything the scene throws — a shader that will not compile, a lost
 * WebGL context, a geometry error on unusual hardware — and shows the same
 * fallback a device without WebGL gets. Without this a scene error takes the
 * whole page down, which is a bad trade for a decorative layer.
 */
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Surfaced for debugging; the visitor just sees the fallback.
    console.error('[SceneCanvas] scene failed, showing fallback:', error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

/** Device-pixel-ratio ceiling per tier: high-DPR phones melt at full ratio. */
const DPR = { 2: [1, 2], 1: [1, 1.5], 0: [1, 1] };

export default function SceneCanvas({
  children,
  fallback = null,
  className = '',
  style,
  camera = { position: [0, 0, 5], fov: 50 },
  minTier = 1,
  ...rest
}) {
  const { tier, ready, webgl, reducedMotion, shouldAnimate } = useDeviceTier();
  const [ref, inViewport] = useInViewport();
  const tabVisible = useDocumentVisible();

  // Until the mount heuristic has run we do not know what this device can do.
  // Rendering the fallback first and upgrading is the safe order: the reverse
  // would briefly mount WebGL on hardware that cannot carry it.
  const canRender3D = ready && webgl && tier >= minTier;

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ zIndex: 'var(--z-base)', ...style }}
    >
      {canRender3D ? (
        // The canvas is hidden from assistive technology on purpose: every
        // scene here has its information in the DOM beside it — the domain
        // ring is real links, the skill galaxy is real buttons — so announcing
        // the canvas as well would read the same content twice, the second
        // time as an unnamed "graphic".
        <SceneErrorBoundary fallback={fallback}>
        <div aria-hidden="true" className="w-full h-full">
        <Canvas
          dpr={DPR[tier] ?? DPR[1]}
          camera={camera}
          // Only drive frames when the scene is actually visible and motion is
          // wanted. 'demand' renders once and then only when invalidated, which
          // is exactly the right behaviour for a static or paused scene.
          frameloop={inViewport && tabVisible && shouldAnimate && !reducedMotion ? 'always' : 'demand'}
          gl={{ antialias: tier >= 2, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
          {...rest}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
        </div>
        </SceneErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
