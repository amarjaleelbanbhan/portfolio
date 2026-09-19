/**
 * The centre of the core, and the links from it to each domain.
 *
 * The links are the point of the whole visualisation. Each one's brightness is
 * derived from how much real work sits in that domain — project count, or merged
 * pull requests for Open Source — so the picture is weighted by evidence rather
 * than drawn evenly for looks. A domain with more behind it genuinely reads
 * stronger, and it changes on its own when content changes.
 *
 * Lines rather than tubes: a tube per link would add geometry and shadow cost
 * for a difference nobody would notice at this scale.
 */
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { nodePosition } from './coreLayout';

function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function Link({ domain, weight, isActive, isDimmed }) {
  const material = useRef(null);

  const geometry = useMemo(() => {
    const [x, y, z] = nodePosition(domain.angle);
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, z),
    ]);
  }, [domain.angle]);

  // Evidence → brightness. Floored so a lighter domain is still visibly
  // connected; nothing is hidden for having less behind it.
  const restOpacity = 0.18 + weight * 0.42;

  useFrame((_state, delta) => {
    if (!material.current) return;
    const dt = Math.min(delta, 0.1);
    const target = isDimmed ? 0.06 : isActive ? 0.95 : restOpacity;
    material.current.opacity = damp(material.current.opacity, target, 6, dt);
  });

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        ref={material}
        color={domain.color}
        transparent
        opacity={restOpacity}
      />
    </line>
  );
}

export default function CoreConnections({ domains, active, detail, reducedMotion }) {
  const core = useRef(null);
  const shell = useRef(null);

  // Normalised evidence weight per domain, so link brightness is comparable.
  const weights = useMemo(() => {
    const max = Math.max(...domains.map((d) => d.stat.value), 1);
    return new Map(domains.map((d) => [d.domain, d.stat.value / max]));
  }, [domains]);

  useFrame((_state, delta) => {
    if (reducedMotion) return;
    const dt = Math.min(delta, 0.1);
    if (core.current) {
      core.current.rotation.y += dt * 0.12;
      core.current.rotation.x += dt * 0.05;
    }
    if (shell.current) {
      shell.current.rotation.y -= dt * 0.07;
    }
  });

  return (
    <group>
      {/* Central core — the engineer at the middle of the system. */}
      <mesh ref={core}>
        <octahedronGeometry args={[0.52, detail === 'low' ? 0 : 1]} />
        <meshStandardMaterial
          color="#5eead4"
          emissive="#14b8a6"
          emissiveIntensity={0.9}
          roughness={0.25}
          metalness={0.35}
          flatShading
        />
      </mesh>

      {/* Wireframe shell — reads as a schematic enclosure, not a planet. */}
      {detail !== 'low' && (
        <mesh ref={shell}>
          <icosahedronGeometry args={[0.95, 1]} />
          <meshBasicMaterial color="#14b8a6" wireframe transparent opacity={0.12} />
        </mesh>
      )}

      {domains.map((domain) => (
        <Link
          key={domain.domain}
          domain={domain}
          weight={weights.get(domain.domain) ?? 0}
          isActive={active === domain.domain}
          isDimmed={Boolean(active) && active !== domain.domain}
        />
      ))}
    </group>
  );
}
