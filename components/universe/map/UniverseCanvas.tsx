"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import type { DeviceTier } from "@/lib/deviceTier";
import { PLACEMENTS } from "./realmLayout";
import StarField from "./StarField";
import RealmOrbit from "./RealmOrbit";
import RealmNode from "./RealmNode";
import EnergyConnections from "./EnergyConnections";

/** Distinct conceptual-layer radii → faint concentric rings. */
const LAYER_RINGS = [4.5, 5.6, 6, 6.6, 9];

/**
 * ZoomDirector — manages the camera zoom travel sequence when a realm is selected.
 * Unmounts OrbitControls, zooms camera positions into the center of the node core,
 * and calls the onZoomComplete callback once finished.
 */
function ZoomDirector({
  zoomingTo,
  onZoomComplete,
  reduced,
}: {
  zoomingTo: string | null;
  onZoomComplete: () => void;
  reduced: boolean;
}) {
  const { camera } = useThree();
  const placement = zoomingTo ? PLACEMENTS.find((p) => p.slug === zoomingTo) : null;
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (!zoomingTo || !placement) return;
    const [tx, ty, tz] = placement.position;

    if (reduced) {
      onZoomComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: onZoomComplete,
    });

    // Zoom camera directly into the node core
    tl.to(camera.position, {
      x: tx,
      y: ty + 0.08,
      z: tz + 0.9,
      duration: 1.5,
      ease: "power2.inOut",
    });

    // Slide look-at target to the center of the node
    tl.to(
      targetLook.current,
      {
        x: tx,
        y: ty,
        z: tz,
        duration: 1.5,
        ease: "power2.inOut",
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  }, [zoomingTo, placement, camera, onZoomComplete, reduced]);

  useFrame(() => {
    if (zoomingTo) {
      camera.lookAt(targetLook.current);
    }
  });

  return null;
}

/**
 * ParallaxContainer — adds mouse movement parallax to the internal 3D group
 * of orbits, connections, and nodes.
 */
function ParallaxContainer({
  children,
  reduced,
  zoomingActive,
}: {
  children: React.ReactNode;
  reduced: boolean;
  zoomingActive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reduced || zoomingActive || !groupRef.current) return;
    // Normalize coordinates
    const mx = state.pointer.x * 0.85;
    const my = state.pointer.y * 0.85;

    // Smooth interpolation
    groupRef.current.position.x += (mx - groupRef.current.position.x) * 0.06;
    groupRef.current.position.y += (my - groupRef.current.position.y) * 0.06;
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * The 3D Universe Map (canon doc 2 Act 3 / doc 4). Tier-aware: star count,
 * antialias and pixel-ratio scale down on weaker GPUs. No heavy post-processing.
 * Features parallax, specialized planet shapes, connection pulses, and exit zooms.
 */
export default function UniverseCanvas({
  tier,
  reduced,
  hovered,
  selected,
  zoomingTo,
  onHover,
  onSelect,
  onZoomComplete,
}: {
  tier: DeviceTier;
  reduced: boolean;
  hovered: string | null;
  selected: string | null;
  zoomingTo: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string | null) => void;
  onZoomComplete: () => void;
}) {
  const active = hovered ?? selected;
  const starCount = tier >= 2 ? 3000 : 1200;

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

      {/* ── Background layers (Deep space stars + faint data stream fields) ── */}
      <StarField count={starCount} twinkle={!reduced} />
      {tier >= 2 && (
        <Stars radius={110} depth={60} count={1000} factor={6} speed={twinkleSpeed(reduced)} fade />
      )}

      {/* ── Foreground layers (Close-up floating particles creating depth) ── */}
      {tier >= 1 && (
        <Stars radius={15} depth={10} count={220} factor={1.2} speed={twinkleSpeed(reduced)} />
      )}

      {/* ── Parallax content group (Orbits, connections, planets) ── */}
      <ParallaxContainer reduced={reduced} zoomingActive={!!zoomingTo}>
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
      </ParallaxContainer>

      {/* ── Travel zoom sequence director ── */}
      <ZoomDirector
        zoomingTo={zoomingTo}
        onZoomComplete={onZoomComplete}
        reduced={reduced}
      />

      {/* ── Camera controls (Disabled during camera flight) ── */}
      {!zoomingTo && (
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
      )}
    </Canvas>
  );
}

function twinkleSpeed(reduced: boolean) {
  return reduced ? 0 : 0.45;
}
