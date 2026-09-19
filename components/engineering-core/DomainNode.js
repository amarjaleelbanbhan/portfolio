/**
 * One domain node on the core ring.
 *
 * A faceted solid, not a sphere — the core reads as a schematic of engineering
 * work rather than a planet, and flat faces catch the rim light in a way that
 * makes the ring legible at a glance.
 *
 * Its satellites are the domain's technologies, one small mote each, so the node
 * visibly carries the weight of what is actually in it. Counts come from
 * canonical content, never from a number typed here.
 *
 * Highlight state is animated by mutating material and transform values inside
 * the existing frame loop. Driving it through React state instead would
 * re-render the whole scene graph on every pointer move.
 */
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { nodePosition } from './coreLayout';

function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export default function DomainNode({
  domain,
  isActive,
  isDimmed,
  detail,
  reducedMotion,
  onHover,
  onSelect,
}) {
  const group = useRef(null);
  const mesh = useRef(null);
  const material = useRef(null);
  const satellites = useRef(null);
  // Derived from the node's own ring angle rather than Math.random(): each node
  // still tumbles out of step with its neighbours, but the value is stable
  // across renders and identical on server and client.
  const phase = useRef((domain.angle / 360) * Math.PI * 2);

  const position = useMemo(() => nodePosition(domain.angle), [domain.angle]);
  const color = useMemo(() => new THREE.Color(domain.color), [domain.color]);

  // One mote per real technology. Mobile drops the satellites entirely via
  // `detail`, which is the cheapest meaningful geometry reduction available.
  const satelliteCount = detail === 'low' ? 0 : domain.technologies.length;

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 0.1);
    const lambda = 6;

    const targetScale = isActive ? 1.35 : 1;
    const targetOpacity = isDimmed ? 0.28 : 1;
    const targetEmissive = isActive ? 1.5 : 0.45;

    if (group.current) {
      const s = damp(group.current.scale.x, targetScale, lambda, dt);
      group.current.scale.setScalar(s);
    }
    if (material.current) {
      material.current.opacity = damp(material.current.opacity, targetOpacity, lambda, dt);
      material.current.emissiveIntensity = damp(
        material.current.emissiveIntensity,
        targetEmissive,
        lambda,
        dt
      );
    }
    if (mesh.current && !reducedMotion) {
      // A slow, per-node-offset tumble. Small enough that it reads as the
      // system being alive rather than as something spinning for its own sake.
      phase.current += dt * (isActive ? 0.5 : 0.18);
      mesh.current.rotation.x = Math.sin(phase.current) * 0.35;
      mesh.current.rotation.y = phase.current * 0.6;
    }
    if (satellites.current && !reducedMotion) {
      satellites.current.rotation.z += dt * (isActive ? 0.7 : 0.22);
    }
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(domain.domain);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(domain.domain);
      }}
    >
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.34, detail === 'low' ? 0 : 1]} />
        <meshStandardMaterial
          ref={material}
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.35}
          metalness={0.2}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Technology satellites — one per real technology in this domain. */}
      {satelliteCount > 0 && (
        <group ref={satellites}>
          {domain.technologies.map((tech, i) => {
            const a = (i / satelliteCount) * Math.PI * 2;
            const r = 0.62;
            return (
              <mesh key={tech.key} position={[Math.cos(a) * r, Math.sin(a) * r, 0]}>
                <sphereGeometry args={[0.055, 8, 8]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={isDimmed ? 0.15 : isActive ? 0.95 : 0.5}
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
