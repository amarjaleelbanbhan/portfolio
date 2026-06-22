"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EDGES, edgeSegment } from "./realmLayout";

/**
 * The relationship topology between realms (canon doc 4 §14.3) — the CS
 * dependency graph rendered as luminous threads. One LineSegments = one draw
 * call (cheap). Fades in after the nodes (connections follow the awakening).
 */
export default function EnergyConnections({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.LineBasicMaterial>(null);
  const t = useRef(0);

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

  useFrame((_, delta) => {
    if (reduced || !mat.current) return;
    t.current += delta;
    const appear = THREE.MathUtils.clamp((t.current - 1.0) / 1.2, 0, 1);
    mat.current.opacity = 0.05 + appear * 0.17;
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        ref={mat}
        color="#00F5FF"
        transparent
        opacity={reduced ? 0.2 : 0}
        depthWrite={false}
      />
    </lineSegments>
  );
}
