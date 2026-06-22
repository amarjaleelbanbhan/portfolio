"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useUniverseStore } from "@/store/universeStore";
import HolographicPanel from "../HolographicPanel";
import s from "../MotherboardEnvironment.module.css";

interface CodeHelixSceneProps {
  reduced: boolean;
  onArrivalComplete: () => void;
}

export default function CodeHelixScene({
  reduced,
  onArrivalComplete,
}: CodeHelixSceneProps) {
  const { camera } = useThree();
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const activeSimStep = useUniverseStore((s) => s.activeSimStep);

  const [arrivalDone, setArrivalDone] = useState(reduced);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cameraTarget = useRef(new THREE.Vector3(0, 1, -4));
  const compilerSpireRef = useRef<THREE.Group>(null);
  const stackEngineRef = useRef<THREE.Group>(null);

  // Overview coordinates
  const overviewPos: [number, number, number] = [0, 8, 12];
  const overviewTarget: [number, number, number] = [0, 1, -4];

  // Coordinates of the landmarks in registry
  const coords = {
    "code-forge": new THREE.Vector3(-7, -1, 3),
    "compiler-engine": new THREE.Vector3(-3, 1.5, -4),
    "ds-factory": new THREE.Vector3(0, 0, 0),
    "algo-arena": new THREE.Vector3(3, 0.5, -4),
    "runtime-engine": new THREE.Vector3(7, -1, 3),
  };

  // 1. Initial entry pan
  useEffect(() => {
    if (reduced) {
      camera.position.set(overviewPos[0], overviewPos[1], overviewPos[2]);
      cameraTarget.current.set(overviewTarget[0], overviewTarget[1], overviewTarget[2]);
      setArrivalDone(true);
      onArrivalComplete();
      return;
    }

    camera.position.set(0, -2, 18);
    cameraTarget.current.set(0, -2, -5);

    const tl = gsap.timeline({
      delay: 0.3,
      onComplete: () => {
        setArrivalDone(true);
        onArrivalComplete();
      },
    });

    tl.to(camera.position, {
      x: overviewPos[0],
      y: overviewPos[1],
      z: overviewPos[2],
      duration: 3.0,
      ease: "power2.inOut",
    });

    tl.to(
      cameraTarget.current,
      {
        x: overviewTarget[0],
        y: overviewTarget[1],
        z: overviewTarget[2],
        duration: 3.0,
        ease: "power2.inOut",
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  }, [camera, reduced, onArrivalComplete]);

  // 2. Dynamic Camera Pan based on active step
  useEffect(() => {
    if (!arrivalDone || reduced) return;

    let tx = overviewTarget[0];
    let ty = overviewTarget[1];
    let tz = overviewTarget[2];

    let cx = overviewPos[0];
    let cy = overviewPos[1];
    let cz = overviewPos[2];

    switch (activeSimStep) {
      case 0: // WRITE CODE -> Focus code forge
        tx = coords["code-forge"].x;
        ty = coords["code-forge"].y;
        tz = coords["code-forge"].z;
        cx = coords["code-forge"].x + 2;
        cy = coords["code-forge"].y + 3;
        cz = coords["code-forge"].z + 5;
        break;
      case 1: // COMPILE -> Focus Compiler
        tx = coords["compiler-engine"].x;
        ty = coords["compiler-engine"].y;
        tz = coords["compiler-engine"].z;
        cx = coords["compiler-engine"].x - 2;
        cy = coords["compiler-engine"].y + 3;
        cz = coords["compiler-engine"].z + 5;
        break;
      case 2: // DATA LAYOUT -> Focus DS Factory
        tx = coords["ds-factory"].x;
        ty = coords["ds-factory"].y;
        tz = coords["ds-factory"].z;
        cx = coords["ds-factory"].x;
        cy = coords["ds-factory"].y + 4;
        cz = coords["ds-factory"].z + 6;
        break;
      case 3: // RUN ALGORITHM -> Focus Algo Arena
        tx = coords["algo-arena"].x;
        ty = coords["algo-arena"].y;
        tz = coords["algo-arena"].z;
        cx = coords["algo-arena"].x + 2;
        cy = coords["algo-arena"].y + 3;
        cz = coords["algo-arena"].z + 5;
        break;
      case 4: // RUNTIME OUTPUT -> Focus Runtime executor
        tx = coords["runtime-engine"].x;
        ty = coords["runtime-engine"].y;
        tz = coords["runtime-engine"].z;
        cx = coords["runtime-engine"].x - 2;
        cy = coords["runtime-engine"].y + 3;
        cz = coords["runtime-engine"].z + 5;
        break;
    }

    gsap.to(cameraTarget.current, {
      x: tx,
      y: ty,
      z: tz,
      duration: 1.8,
      ease: "power2.out",
    });

    gsap.to(camera.position, {
      x: cx,
      y: cy,
      z: cz,
      duration: 1.8,
      ease: "power2.out",
    });
  }, [activeSimStep, arrivalDone, reduced, camera]);

  useFrame((state) => {
    camera.lookAt(cameraTarget.current);
    const t = state.clock.getElapsedTime();

    // Compiler double-helix spin
    if (compilerSpireRef.current) {
      compilerSpireRef.current.rotation.y = t * 0.8;
    }

    // Call stack platform translation oscillation
    if (stackEngineRef.current) {
      stackEngineRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(t * 1.5 + i) * 0.3;
      });
    }
  });

  return (
    <group>
      {/* Fog */}
      <fog attach="fog" args={["#050508", 8, 26]} />

      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 5]} intensity={0.3} color="#7C3AED" />
      <pointLight position={[0, 4, 0]} intensity={4} color="#8B5CF6" distance={25} />

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.01, 0]}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark(null);
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#030406" roughness={0.7} metalness={0.4} />
      </mesh>
      <gridHelper args={[100, 100, "#7C3AED", "#0B0E0D"]} position={[0, -2.99, 0]} />

      {/* ── Landmark 1: The Code Forge ── */}
      <group
        position={coords["code-forge"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("code-forge");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("code-forge");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Forge anvil deck */}
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[2.5, 0.4, 1.8]} />
          <meshStandardMaterial
            color={activeLandmark === "code-forge" ? "#2e1065" : "#1e1b4b"}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {/* Hologram projecting code lines */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[2.0, 1.0, 0.05]} />
          <meshBasicMaterial color="#7C3AED" transparent opacity={0.35} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 1.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>CODE FORGE</span>
                <span className={s.labelValue}>SOURCE EDITOR</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 2: Compiler Spire ── */}
      <group
        position={coords["compiler-engine"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("compiler-engine");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("compiler-engine");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Rotating Double Helix spire */}
        <group ref={compilerSpireRef}>
          {[-1.5, -0.7, 0.1, 0.9, 1.7].map((y, i) => {
            const angle = i * 0.8;
            const r = 0.8;
            return (
              <group key={y}>
                <mesh position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}>
                  <sphereGeometry args={[0.22, 12, 12]} />
                  <meshBasicMaterial color="#22C55E" toneMapped={false} />
                </mesh>
                <mesh position={[-Math.cos(angle) * r, y, -Math.sin(angle) * r]}>
                  <sphereGeometry args={[0.22, 12, 12]} />
                  <meshBasicMaterial color="#7C3AED" toneMapped={false} />
                </mesh>
              </group>
            );
          })}
        </group>
        {/* Spire central pillar */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.15, 0.3, 4.2, 8]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.9} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 2.8, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>COMPILER SPIRE</span>
                <span className={s.labelValue}>AST TRANS PILER</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 3: Data Structure Factory ── */}
      <group
        position={coords["ds-factory"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("ds-factory");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("ds-factory");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Base block */}
        <mesh position={[0, -1.8, 0]}>
          <boxGeometry args={[3.2, 0.4, 3.2]} />
          <meshStandardMaterial
            color={activeLandmark === "ds-factory" ? "#2e1065" : "#1e1b4b"}
            roughness={0.5}
            metalness={0.8}
          />
        </mesh>
        {/* Array grid */}
        <mesh position={[-0.9, -1.2, 0]}>
          <boxGeometry args={[1.0, 0.6, 1.0]} />
          <meshStandardMaterial color="#8B5CF6" wireframe />
        </mesh>
        {/* Linked List pointer node */}
        <mesh position={[0.9, -1.2, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#22C55E" roughness={0.1} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, -0.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>DATA LAYOUTS</span>
                <span className={s.labelValue}>ARRAY & LINKED MAPS</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 4: Algorithm Arena ── */}
      <group
        position={coords["algo-arena"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("algo-arena");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("algo-arena");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Shifting algorithm sorting bars */}
        {[-0.9, -0.3, 0.3, 0.9].map((x, idx) => {
          const hVal = 1.0 + (idx % 2 === 0 ? 0.6 : 1.2);
          return (
            <mesh key={x} position={[x, hVal / 2 - 1.5, 0]}>
              <boxGeometry args={[0.4, hVal, 0.4]} />
              <meshStandardMaterial
                color={activeLandmark === "algo-arena" ? "#22C55E" : "#8B5CF6"}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
          );
        })}
        {arrivalDone && (
          <Html position={[0, 1.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>ALGORITHM ARENA</span>
                <span className={s.labelValue}>COMPLEXITY SHIFT</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 5: Execution Runtime Engine ── */}
      <group
        position={coords["runtime-engine"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("runtime-engine");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("runtime-engine");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        <group ref={stackEngineRef}>
          {/* Stack Frame 1 */}
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.25, 12]} />
            <meshStandardMaterial color="#7C3AED" opacity={0.6} transparent />
          </mesh>
          {/* Stack Frame 2 */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.25, 12]} />
            <meshStandardMaterial color="#8B5CF6" opacity={0.7} transparent />
          </mesh>
          {/* Stack Frame 3 */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.25, 12]} />
            <meshBasicMaterial color="#22C55E" toneMapped={false} />
          </mesh>
        </group>
        {arrivalDone && (
          <Html position={[0, 2.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>EXECUTION ENGINE</span>
                <span className={s.labelValue}>RUNTIME CALL STACK</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>
    </group>
  );
}
