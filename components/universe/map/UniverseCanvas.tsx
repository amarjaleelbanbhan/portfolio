"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { DeviceTier } from "@/lib/deviceTier";
import { PLACEMENTS } from "./realmLayout";
import StarField from "./StarField";
import RealmOrbit from "./RealmOrbit";
import RealmNode from "./RealmNode";
import EnergyConnections from "./EnergyConnections";

/** Distinct conceptual-layer radii → faint concentric rings. */
const LAYER_RINGS = [4.5, 5.6, 6, 6.6, 9];

/**
 * The 3D Universe Map (canon doc 2 Act 3 / doc 4). Tier-aware: star count,
 * antialias and pixel-ratio scale down on weaker GPUs. No heavy post-processing.
 * Loaded only via dynamic(ssr:false) — R3F cannot render on the server.
 */
export default function UniverseCanvas({
  tier,
  reduced,
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  tier: DeviceTier;
  reduced: boolean;
  hovered: string | null;
  selected: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string | null) => void;
}) {
  const active = hovered ?? selected;
  const starCount = tier >= 2 ? 4000 : 1800;

  return (
    <Canvas
      camera={{ position: [0, 1.5, 19], fov: 52 }}
      dpr={[1, tier >= 2 ? 2 : 1.5]}
      gl={{ antialias: tier >= 2, powerPreference: "high-performance" }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={["#050508"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 2]} intensity={3} color="#FBBF24" distance={36} />
      <pointLight position={[0, 12, 8]} intensity={0.5} color="#7DD3FC" />

      <StarField count={starCount} twinkle={!reduced} />

      {LAYER_RINGS.map((r) => (
        <RealmOrbit key={r} radius={r} />
      ))}

      <EnergyConnections reduced={reduced} />

      {PLACEMENTS.map((p, i) => (
        <RealmNode
          key={p.slug}
          placement={p}
          appearDelay={reduced ? 0 : 0.3 + i * 0.08}
          reduced={reduced}
          active={active === p.slug}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={11}
        maxDistance={28}
        autoRotate={!reduced}
        autoRotateSpeed={0.25}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
