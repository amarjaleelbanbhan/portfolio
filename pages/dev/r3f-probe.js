/**
 * React Three Fiber proof.
 *
 * R3F, drei and postprocessing have been in package.json for a long time but had
 * never been imported or built in this repository — the only working 3D is the
 * hand-rolled Three.js in components/SkillCube.js. The salvage audit flagged R3F
 * as "unproven ground, not existing infrastructure", so Phase 3 proves it
 * compiles, mounts and renders before Phase 4 builds the Engineering Core on it.
 *
 * This is infrastructure verification, not a product page: noindex, absent from
 * the sitemap, disallowed in robots.txt, and not linked from any navigation.
 * Phase 4 should keep it as the place to test scene changes in isolation.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Seo from '@/components/Seo';
import SceneCanvas from '@/components/three/SceneCanvas';
import useDeviceTier from '@/lib/useDeviceTier';

function ProbeMesh() {
  const mesh = useRef();

  // Drives rotation from R3F's own loop, which SceneCanvas gates via
  // `frameloop`. If the scene is off-screen or motion is reduced, this stops.
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.4;
    mesh.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#14b8a6" metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

/** What a device without WebGL sees. Never an empty box. */
function Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="clip-hexagon w-24 h-24 bg-gradient-to-br from-neon-cyan to-neon-green opacity-60" />
    </div>
  );
}

export default function R3FProbe() {
  const { tier, hardwareTier, ready, webgl, reducedMotion, budget } = useDeviceTier();

  return (
    <>
      <Seo
        title="R3F Probe"
        description="Internal rendering probe."
        noindex
      />
      <main id="main-content" tabIndex={-1} className="section-container">
        <p className="section-label">Internal</p>
        <h1 className="section-heading">React Three Fiber probe</h1>
        <p className="mt-3 text-slate-400 max-w-2xl">
          Verifies that R3F compiles, mounts and renders through the shared
          SceneCanvas boundary, and that capability tiering and the WebGL
          fallback behave. Not part of the public portfolio.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <SceneCanvas
            className="h-80 surface-card overflow-hidden"
            fallback={<Fallback />}
            data-testid="probe-scene"
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <ProbeMesh />
          </SceneCanvas>

          <dl className="glass-panel space-y-2" data-testid="probe-caps">
            <div className="flex items-baseline gap-2">
              <dt className="text-[10px] font-code uppercase tracking-wider text-slate-500">Ready</dt>
              <dd className="text-xs font-code text-slate-300 m-0">{String(ready)}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-[10px] font-code uppercase tracking-wider text-slate-500">Effective tier</dt>
              <dd className="text-xs font-code text-slate-300 m-0">{tier}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-[10px] font-code uppercase tracking-wider text-slate-500">Hardware tier</dt>
              <dd className="text-xs font-code text-slate-300 m-0">{hardwareTier}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-[10px] font-code uppercase tracking-wider text-slate-500">WebGL</dt>
              <dd className="text-xs font-code text-slate-300 m-0">{String(webgl)}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-[10px] font-code uppercase tracking-wider text-slate-500">Reduced motion</dt>
              <dd className="text-xs font-code text-slate-300 m-0">{String(reducedMotion)}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-[10px] font-code uppercase tracking-wider text-slate-500">Particle budget</dt>
              <dd className="text-xs font-code text-slate-300 m-0">{budget}</dd>
            </div>
          </dl>
        </div>
      </main>
    </>
  );
}
