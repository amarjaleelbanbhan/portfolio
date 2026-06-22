"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EDGES, edgeSegment } from "./realmLayout";

/**
 * EnergyConnections — draws the CS topology network connections between realms
 * and animates glowing data packets (energy pulses) traveling along these threads.
 */
export default function EnergyConnections({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.LineBasicMaterial>(null);
  const t = useRef(0);

  // Connection thread lines geometry (One single draw call)
  const geometry = useMemo(() => {
    const pts: number[] = [];
    for (const e of EDGES) {
      const seg = edgeSegment(e);
      if (!seg) continue;
      pts.push(...seg.a, ...seg.b);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  // Set up 8 background active network pulses
  const pulsesRef = useRef(
    Array.from({ length: 8 }, () => ({
      edgeIndex: Math.floor(Math.random() * EDGES.length),
      progress: Math.random(),
      speed: 0.3 + Math.random() * 0.5,
    }))
  );

  const pulseMeshesRef = useRef<THREE.Mesh[]>([]);

  useFrame((_, delta) => {
    // 1. Connection line fade-in
    if (mat.current) {
      t.current += delta;
      const appear = THREE.MathUtils.clamp((t.current - 1.0) / 1.2, 0, 1);
      mat.current.opacity = reduced ? 0.2 : 0.05 + appear * 0.17;
    }

    if (reduced) return;

    // 2. Animate energy pulses along connection paths
    pulsesRef.current.forEach((pulse, idx) => {
      pulse.progress += delta * pulse.speed;
      if (pulse.progress >= 1.0) {
        pulse.progress = 0;
        pulse.edgeIndex = Math.floor(Math.random() * EDGES.length);
        pulse.speed = 0.3 + Math.random() * 0.5;
      }

      const mesh = pulseMeshesRef.current[idx];
      if (mesh) {
        const edge = EDGES[pulse.edgeIndex];
        const seg = edgeSegment(edge);
        if (seg) {
          const start = new THREE.Vector3(...seg.a);
          const end = new THREE.Vector3(...seg.b);
          // Interpolate current position along connection edge
          const currentPos = new THREE.Vector3().lerpVectors(start, end, pulse.progress);
          mesh.position.copy(currentPos);
        }
      }
    });
  });

  return (
    <group>
      {/* ── Static Topology threads ── */}
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          ref={mat}
          color="#00F5FF"
          transparent
          opacity={reduced ? 0.2 : 0}
          depthWrite={false}
        />
      </lineSegments>

      {/* ── Animated Data Packets (WebGL Spheres, skipped under reduced-motion) ── */}
      {!reduced &&
        Array.from({ length: 8 }).map((_, idx) => (
          <mesh
            key={idx}
            ref={(el) => {
              if (el) pulseMeshesRef.current[idx] = el;
            }}
          >
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshBasicMaterial color="#00F5FF" toneMapped={false} />
          </mesh>
        ))}
    </group>
  );
}
