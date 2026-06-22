"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useUniverseStore } from "@/store/universeStore";
import HolographicPanel from "../HolographicPanel";
import s from "../MotherboardEnvironment.module.css";

interface DataArchivesSceneProps {
  reduced: boolean;
  onArrivalComplete: () => void;
}

export default function DataArchivesScene({
  reduced,
  onArrivalComplete,
}: DataArchivesSceneProps) {
  const { camera } = useThree();
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const activeSimStep = useUniverseStore((s) => s.activeSimStep);

  const [arrivalDone, setArrivalDone] = useState(reduced);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cameraTarget = useRef(new THREE.Vector3(0, 0, -4));
  const crystalVaultRef = useRef<THREE.Group>(null);
  const queryEngineRef = useRef<THREE.Group>(null);

  // Overview coordinates from registry cameraOverview
  const overviewPos: [number, number, number] = [0, 6, 12];
  const overviewTarget: [number, number, number] = [0, 0, -4];

  // Coordinates of the landmarks
  const coords = {
    "crystal-vault": new THREE.Vector3(0, 1.5, -8),
    "query-engine": new THREE.Vector3(-6, -0.5, -5),
    "index-towers": new THREE.Vector3(6, -0.5, -5),
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

  // 2. Dynamic Camera Pan based on Sim Step
  useEffect(() => {
    if (!arrivalDone || reduced) return;

    let tx = overviewTarget[0];
    let ty = overviewTarget[1];
    let tz = overviewTarget[2];

    let cx = overviewPos[0];
    let cy = overviewPos[1];
    let cz = overviewPos[2];

    switch (activeSimStep) {
      case 0: // SUBMIT QUERY -> Focus query engine
        tx = coords["query-engine"].x;
        ty = coords["query-engine"].y;
        tz = coords["query-engine"].z;
        cx = coords["query-engine"].x + 2;
        cy = coords["query-engine"].y + 3;
        cz = coords["query-engine"].z + 5;
        break;
      case 1: // INDEX SCAN -> Focus Index Towers
        tx = coords["index-towers"].x;
        ty = coords["index-towers"].y;
        tz = coords["index-towers"].z;
        cx = coords["index-towers"].x - 2;
        cy = coords["index-towers"].y + 3;
        cz = coords["index-towers"].z + 5;
        break;
      case 2: // FETCH DATA -> Focus Crystal Vault
        tx = coords["crystal-vault"].x;
        ty = coords["crystal-vault"].y;
        tz = coords["crystal-vault"].z;
        cx = coords["crystal-vault"].x;
        cy = coords["crystal-vault"].y + 4;
        cz = coords["crystal-vault"].z + 6;
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

    // Rotate storage crystals
    if (crystalVaultRef.current) {
      crystalVaultRef.current.rotation.y = t * 0.3;
      crystalVaultRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(t * 1.2 + i) * 0.2;
      });
    }

    // Spin query engine tracks
    if (queryEngineRef.current) {
      queryEngineRef.current.rotation.y = t * 0.6;
    }
  });

  return (
    <group>
      {/* Fog */}
      <fog attach="fog" args={["#050508", 8, 26]} />

      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[-10, 20, 5]} intensity={0.3} color="#7DD3FC" />
      <pointLight position={[0, 4, -4]} intensity={4} color="#7DD3FC" distance={25} />

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
      <gridHelper args={[100, 100, "#7DD3FC", "#0B0E0D"]} position={[0, -2.99, 0]} />

      {/* ── Landmark 1: Database Crystal Vault ── */}
      <group
        position={coords["crystal-vault"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("crystal-vault");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("crystal-vault");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Shifting Crystal Group */}
        <group ref={crystalVaultRef}>
          {/* Main Crystal Cube */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.8, 1.8, 1.8]} />
            <meshStandardMaterial
              color={activeLandmark === "crystal-vault" ? "#F59E0B" : "#7DD3FC"}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.65}
            />
          </mesh>
          {/* Small satellite crystal block 1 */}
          <mesh position={[-1.4, 1.0, 1.4]} scale={[0.4, 0.4, 0.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#F59E0B" toneMapped={false} />
          </mesh>
          {/* Small satellite crystal block 2 */}
          <mesh position={[1.4, -0.6, -1.4]} scale={[0.4, 0.4, 0.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#7DD3FC" toneMapped={false} />
          </mesh>
        </group>
        {/* Core base */}
        <mesh position={[0, -1.4, 0]}>
          <cylinderGeometry args={[2.0, 2.0, 0.4, 16]} />
          <meshStandardMaterial color="#0A0F14" roughness={0.4} metalness={0.8} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 2.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>CRYSTAL VAULT</span>
                <span className={s.labelValue}>ACID STORAGE</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 2: SQL Query Engine ── */}
      <group
        position={coords["query-engine"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("query-engine");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("query-engine");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Spinning compiler rings */}
        <group ref={queryEngineRef}>
          <mesh position={[0, -0.4, 0]}>
            <torusGeometry args={[1.5, 0.08, 8, 24]} />
            <meshBasicMaterial color="#7DD3FC" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.0, 0.08, 8, 24]} />
            <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} />
          </mesh>
        </group>
        {/* Central hub */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 1.8, 12]} />
          <meshStandardMaterial
            color={activeLandmark === "query-engine" ? "#1e293b" : "#0f172a"}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 1.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>QUERY ENGINE</span>
                <span className={s.labelValue}>PARSER & OPTIMIZER</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 3: B-Tree Index Towers ── */}
      <group
        position={coords["index-towers"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("index-towers");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("index-towers");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Branching tree tower columns */}
        {/* Root level (Top) */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.6]} />
          <meshBasicMaterial color="#F59E0B" toneMapped={false} />
        </mesh>
        {/* Intermediate level (Mid) */}
        <mesh position={[-0.8, 0.1, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.8]} />
          <meshStandardMaterial
            color={activeLandmark === "index-towers" ? "#F59E0B" : "#7DD3FC"}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.8, 0.1, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.8]} />
          <meshStandardMaterial
            color={activeLandmark === "index-towers" ? "#F59E0B" : "#7DD3FC"}
            roughness={0.2}
          />
        </mesh>
        {/* Leaf level (Bottom) */}
        {[-1.6, -0.6, 0.6, 1.6].map((x) => (
          <mesh key={x} position={[x, -1.0, 0]}>
            <boxGeometry args={[0.5, 0.4, 0.5]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} wireframe />
          </mesh>
        ))}
        {/* Center stem link */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3.2, 8]} />
          <meshBasicMaterial color="rgba(255, 255, 255, 0.1)" />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 2.2, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>INDEX TOWERS</span>
                <span className={s.labelValue}>B-TREE COORDINATOR</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>
    </group>
  );
}
