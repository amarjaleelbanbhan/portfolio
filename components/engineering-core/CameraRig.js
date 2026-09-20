/**
 * Camera controller for the Engineering Core.
 *
 * Four states, driven by interaction rather than by a clock:
 *
 *   INTRO         one authored reveal — pulls back and settles. Plays once.
 *   IDLE          almost still: a slow breath plus clamped pointer parallax.
 *   DOMAIN_FOCUS  leans a short distance toward the active domain.
 *   RETURN        the same easing back to rest; not a separate path, just
 *                 DOMAIN_FOCUS with no target, which is why it cannot fight it.
 *
 * No GSAP. The salvaged `cinematicCamera.ts` animates CSS 2D transforms on DOM
 * elements and is the repo's only GSAP consumer (~70 KB for one timeline), so
 * what carries over is its shape — an anticipation beat, an authored move, a
 * settle — and its reduced-motion contract, not its code. Framer Motion cannot
 * drive a Three.js camera either, so the move is critically-damped interpolation
 * inside the frame loop SceneCanvas already owns.
 *
 * Deliberately restrained: the labels sit in the DOM around this scene and must
 * stay readable, so amplitudes are small and there is no continuous rotation.
 */
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { nodePosition } from './coreLayout';

const REST = { x: 0, y: 0, z: 7.2 };
const INTRO_START_Z = 11;
/** How far the camera leans toward a focused domain. Small on purpose. */
const FOCUS_LEAN = 0.5;
const PARALLAX = 0.32;

/** Frame-rate-independent damping: the fraction of remaining distance per second. */
function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export default function CameraRig({ activeAngle, pointer, reducedMotion, intro = true }) {
  const started = useRef(false);
  const elapsed = useRef(0);

  // The camera is read from the per-frame state rather than from useThree(),
  // because it is mutated every frame and a hook's return value must not be.
  useFrame((state, delta) => {
    const camera = state.camera;

    if (!started.current) {
      started.current = true;
      // Reduced motion skips the reveal and opens at rest — the same contract
      // as the salvaged reducedMotionDive(): no movement, no information lost.
      camera.position.set(REST.x, REST.y, intro && !reducedMotion ? INTRO_START_Z : REST.z);
      camera.lookAt(0, 0, 0);
    }

    // Guard against tab-switch delta spikes producing a jump.
    const dt = Math.min(delta, 0.1);
    elapsed.current += dt;

    if (reducedMotion) {
      camera.position.set(REST.x, REST.y, REST.z);
      camera.lookAt(0, 0, 0);
      return;
    }

    let targetX = REST.x;
    let targetY = REST.y;

    // DOMAIN_FOCUS: lean toward the active node. With no active domain this
    // expression is simply REST, so RETURN is the same easing running out.
    if (activeAngle !== null && activeAngle !== undefined) {
      const [nx, ny] = nodePosition(activeAngle);
      targetX += nx * FOCUS_LEAN;
      targetY += ny * FOCUS_LEAN;
    }

    // IDLE breath — a long, low-amplitude drift so the scene is never frozen
    // but never demands attention either.
    targetY += Math.sin(elapsed.current * 0.35) * 0.06;

    // Clamped pointer parallax. Never required to reach anything: touch and
    // keyboard leave pointer at origin and lose nothing.
    targetX += pointer.current.x * PARALLAX;
    targetY += pointer.current.y * PARALLAX * 0.6;

    // The intro is just a slower lambda on the first beat, so it reads as one
    // authored move rather than a separate animation that can desync.
    const lambda = elapsed.current < 1.8 ? 1.6 : 3.2;

    camera.position.x = damp(camera.position.x, targetX, lambda, dt);
    camera.position.y = damp(camera.position.y, targetY, lambda, dt);
    camera.position.z = damp(camera.position.z, REST.z, lambda, dt);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
