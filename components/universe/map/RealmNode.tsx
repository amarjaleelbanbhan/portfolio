"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { RealmPlacement } from "./realmLayout";

/**
 * A single realm orb. Appears with a staggered scale-in (the universe
 * "awakening"), bobs gently when idle, and brightens when active.
 */
export default function RealmNode({
  placement,
  appearDelay,
  reduced,
  active,
  onHover,
  onSelect,
}: {
  placement: RealmPlacement;
  appearDelay: number;
  reduced: boolean;
  active: boolean;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}) {
  const grp = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const t = useRef(0);

  const isCore = placement.slug === "architect-core";
  const baseScale = isCore ? 1.35 : 0.72;
  const color = placement.realm.colors.primary;
  const [bx, by, bz] = placement.position;

  useFrame((_, delta) => {
    t.current += delta;
    const g = grp.current;
    if (!g) return;
    const appear = reduced
      ? 1
      : THREE.MathUtils.clamp((t.current - appearDelay) / 0.6, 0, 1);
    const ease = 1 - Math.pow(1 - appear, 3);
    const hover = active ? 1.35 : 1;
    g.scale.setScalar(baseScale * ease * hover);
    g.position.set(
      bx,
      reduced ? by : by + Math.sin(t.current * 0.6 + appearDelay * 6) * 0.12,
      bz,
    );
    if (mat.current) {
      const target = active ? 1.5 : isCore ? 1.0 : 0.55;
      mat.current.emissiveIntensity +=
        (target - mat.current.emissiveIntensity) * 0.15;
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(placement.slug);
    document.body.style.cursor = "pointer";
  };
  const out = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(null);
    document.body.style.cursor = "auto";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(placement.slug);
  };

  return (
    <group
      ref={grp}
      position={placement.position}
      onPointerOver={over}
      onPointerOut={out}
      onClick={click}
    >
      <mesh>
        <icosahedronGeometry args={[1, isCore ? 1 : 0]} />
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
      {/* soft halo */}
      <mesh scale={1.4}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.2 : 0.07}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
