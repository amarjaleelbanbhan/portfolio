/**
 * The Engineering Core scene contents.
 *
 * Mounted inside SceneCanvas, which owns capability tiering, DPR, visibility
 * gating and the frame loop. Nothing here starts a loop of its own — every
 * animation runs in useFrame, so when SceneCanvas switches to frameloop="demand"
 * (off-screen, hidden tab, reduced motion) all of it stops together.
 *
 * Lighting is three cheap lights and no postprocessing. Bloom on five small
 * emissive nodes would cost a full-screen pass for an effect the emissive
 * materials already imply.
 */
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import CameraRig from './CameraRig';
import CoreConnections from './CoreConnections';
import DomainNode from './DomainNode';

/**
 * Tracks the pointer in normalised device coordinates for camera parallax.
 *
 * Read from R3F's own per-frame state rather than a window listener, so it
 * stops when the frame loop stops and needs no cleanup of its own.
 */
function usePointerRef() {
  const pointer = useRef({ x: 0, y: 0 });
  useFrame((state) => {
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
  });
  return pointer;
}

function SceneBody({ domains, active, activeAngle, detail, reducedMotion, onHover, onSelect }) {
  const pointer = usePointerRef();

  return (
    <>
      <CameraRig activeAngle={activeAngle} pointer={pointer} reducedMotion={reducedMotion} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 6]} intensity={1.1} />
      {/* Cool rim light from behind so the faceted solids keep an edge against
          the dark background. */}
      <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#38bdf8" />

      <CoreConnections
        domains={domains}
        active={active}
        detail={detail}
        reducedMotion={reducedMotion}
      />

      {domains.map((domain) => (
        <DomainNode
          key={domain.domain}
          domain={domain}
          isActive={active === domain.domain}
          isDimmed={Boolean(active) && active !== domain.domain}
          detail={detail}
          reducedMotion={reducedMotion}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default function CoreScene(props) {
  return <SceneBody {...props} />;
}
