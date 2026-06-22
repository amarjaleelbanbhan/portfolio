"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { getRealmKnowledge } from "@/lib/environments/registry";
import { useUniverseStore } from "@/store/universeStore";

interface Generic3DSceneProps {
  slug: string;
  reduced: boolean;
  onArrivalComplete: () => void;
}

export default function Generic3DScene({
  slug,
  reduced,
  onArrivalComplete,
}: Generic3DSceneProps) {
  const { camera } = useThree();
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeLandmark = useUniverseStore((s) => s.activeLandmark);

  const [arrivalDone, setArrivalDone] = useState(reduced);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const knowledge = getRealmKnowledge(slug);
  const cameraTarget = useRef(new THREE.Vector3(0, 0, -5));

  useEffect(() => {
    if (!knowledge) {
      onArrivalComplete();
      return;
    }

    const { position, lookAt } = knowledge.cameraOverview;

    if (reduced) {
      camera.position.set(position[0], position[1], position[2]);
      cameraTarget.current.set(lookAt[0], lookAt[1], lookAt[2]);
      setArrivalDone(true);
      onArrivalComplete();
      return;
    }

    // Cinematic entry camera pan
    camera.position.set(0, -2, 18);
    cameraTarget.current.set(0, -2, -5);

    const tl = gsap.timeline({
      delay: 0.3,
      onComplete: () => {
        setArrivalDone(true);
        onArrivalComplete();
      },
    });

    // Animate camera to overview position
    tl.to(camera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 3.0,
      ease: "power2.inOut",
    });

    // Animate look-at target
    tl.to(
      cameraTarget.current,
      {
        x: lookAt[0],
        y: lookAt[1],
        z: lookAt[2],
        duration: 3.0,
        ease: "power2.inOut",
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  }, [camera, slug, reduced, onArrivalComplete, knowledge]);

  useFrame(() => {
    camera.lookAt(cameraTarget.current);
  });

  if (!knowledge) return null;

  return (
    <group>
      {/* Depth fog */}
      <fog attach="fog" args={["#050508", 5, 25]} />

      {/* Basic Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, -5]} intensity={3} color="var(--realm-primary, #00F5FF)" />
      <directionalLight position={[5, 10, 3]} intensity={0.5} />

      {/* Grid Floor */}
      <gridHelper args={[60, 60, "var(--realm-primary, #00F5FF)", "#0b0d0e"]} position={[0, -3, 0]} />

      {/* Landmarks as interactive nodes */}
      {arrivalDone &&
        knowledge.landmarks.map((landmark) => {
          const isHovered = hoveredNode === landmark.id;
          const isActive = activeLandmark === landmark.id;
          const scale = isActive ? 1.4 : isHovered ? 1.2 : 1.0;

          return (
            <group
              key={landmark.id}
              position={landmark.position}
              onClick={(e) => {
                e.stopPropagation();
                selectLandmark(landmark.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNode(landmark.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredNode(null);
                document.body.style.cursor = "auto";
              }}
            >
              {/* Glowing Landmark Core */}
              <mesh scale={[scale, scale, scale]}>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshBasicMaterial
                  color={isActive ? "var(--realm-accent, #FFF)" : "var(--realm-primary)"}
                  transparent
                  opacity={0.8}
                />
              </mesh>

              {/* Orbiting structure indicators */}
              <mesh rotation={[0, Date.now() * 0.001, 0]}>
                <torusGeometry args={[1.3, 0.08, 8, 32]} />
                <meshStandardMaterial color="var(--realm-primary)" roughness={0.3} />
              </mesh>

              {/* Faint label plate below node */}
              <mesh position={[0, -1.2, 0]}>
                <boxGeometry args={[2.0, 0.2, 0.1]} />
                <meshStandardMaterial color="#111" />
              </mesh>
            </group>
          );
        })}
    </group>
  );
}
