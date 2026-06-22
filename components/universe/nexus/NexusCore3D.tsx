"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { NexusMode, NexusAnimState } from "@/store/universeStore";

const ROT_SPEED: Record<NexusMode, number> = {
  ARCHITECT: 0.3,
  CYBER: 0.65,
  QUEST: 0.85,
  MENTOR: 0.18,
  AMBIENT: 0.3,
};

const STATE_SCALE: Record<NexusAnimState, number> = {
  IDLE: 1,
  SPEAKING: 1.18,
  THINKING: 0.82,
  ALERT: 1.05,
  EXCITED: 1.28,
};

const STATE_PULSE: Record<NexusAnimState, number> = {
  IDLE: 0.8,
  SPEAKING: 2.2,
  THINKING: 0.5,
  ALERT: 1.6,
  EXCITED: 3.0,
};

function Solid({ index }: { index: number }) {
  switch (index) {
    case 1:
      return <dodecahedronGeometry args={[1, 0]} />;
    case 2:
      return <octahedronGeometry args={[1, 0]} />;
    case 3:
      return <tetrahedronGeometry args={[1, 0]} />;
    default:
      return <icosahedronGeometry args={[1, 0]} />;
  }
}

function Polyhedron({
  mode,
  animState,
  color,
  reduced,
}: {
  mode: NexusMode;
  animState: NexusAnimState;
  color: string;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const nucleus = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const scale = useRef(1);
  const morph = useRef(1);
  const [shape, setShape] = useState(0);

  // The geometry "never settles" — cycle the platonic solids (doc 3 §3.1).
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setShape((s) => (s + 1) % 4);
      morph.current = 0.8; // scale dip on each morph
    }, 8000);
    return () => window.clearInterval(id);
  }, [reduced]);

  const target = new THREE.Color(color);

  useFrame((_, delta) => {
    t.current += delta;
    const g = group.current;
    if (!g) return;

    if (!reduced) g.rotation.y += delta * ROT_SPEED[mode];
    g.rotation.x = reduced ? 0 : Math.sin(t.current * 0.4) * 0.15;

    // color bleed toward the active realm (doc 3 §3.2 / doc 6 §7.3)
    if (coreMat.current) {
      coreMat.current.color.lerp(target, 0.06);
      coreMat.current.emissive.copy(coreMat.current.color);
      coreMat.current.emissiveIntensity =
        animState === "THINKING" ? 0.5 : animState === "ALERT" ? 1.6 : 1.0;
    }

    // scale: state target + morph-pop recovery + breathing + waveform oscillation when speaking
    morph.current += (1 - morph.current) * 0.12;
    const breathe = reduced ? 1 : 1 + Math.sin(t.current * 1.6) * 0.03;
    const wave = animState === "SPEAKING" ? 1 + Math.sin(t.current * 14) * 0.05 : breathe;
    const targetScale = STATE_SCALE[animState] * morph.current * wave;
    scale.current += (targetScale - scale.current) * 0.15;
    g.scale.setScalar(scale.current);

    // animate energy rings
    if (ringARef.current && !reduced) {
      ringARef.current.rotation.x += delta * 0.4;
      ringARef.current.rotation.y += delta * 0.15;
    }
    if (ringBRef.current && !reduced) {
      ringBRef.current.rotation.y -= delta * 0.25;
      ringBRef.current.rotation.z += delta * 0.45;
    }

    // nucleus heartbeat
    if (nucleus.current && !reduced) {
      const p = 1 + Math.sin(t.current * STATE_PULSE[animState]) * 0.18;
      nucleus.current.scale.setScalar(p);
    }
  });

  return (
    <group ref={group}>
      {/* morphing core */}
      <mesh>
        <Solid index={reduced ? 0 : shape} />
        <meshStandardMaterial
          ref={coreMat}
          color={color}
          emissive={color}
          emissiveIntensity={1}
          roughness={0.25}
          metalness={0.4}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* constant wireframe cage — the "digital entity" feel */}
      <mesh scale={1.32}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.28} />
      </mesh>

      {/* Concentric Energy Ring A */}
      {!reduced && (
        <mesh rotation={[Math.PI / 2, 0, 0]} ref={ringARef}>
          <torusGeometry args={[1.5, 0.015, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.25} />
        </mesh>
      )}

      {/* Concentric Energy Ring B */}
      {!reduced && (
        <mesh rotation={[0, Math.PI / 4, 0]} ref={ringBRef}>
          <torusGeometry args={[1.8, 0.012, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}

      {/* nucleus — where knowledge lives */}
      <mesh ref={nucleus} scale={0.34}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export default function NexusCore3D({
  mode,
  animState,
  color,
  reduced,
}: {
  mode: NexusMode;
  animState: NexusAnimState;
  color: string;
  reduced: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[2, 2, 3]} intensity={2.4} />
      <Polyhedron mode={mode} animState={animState} color={color} reduced={reduced} />
    </Canvas>
  );
}
