"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useUniverseStore } from "@/store/universeStore";
import HolographicPanel from "../HolographicPanel";
import s from "../MotherboardEnvironment.module.css";

interface NeuralNebulaSceneProps {
  reduced: boolean;
  onArrivalComplete: () => void;
}

export default function NeuralNebulaScene({
  reduced,
  onArrivalComplete,
}: NeuralNebulaSceneProps) {
  const { camera } = useThree();
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const activeSimStep = useUniverseStore((s) => s.activeSimStep);

  const [arrivalDone, setArrivalDone] = useState(reduced);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cameraTarget = useRef(new THREE.Vector3(0, 0, -4));
  const datasetStreamRef = useRef<THREE.Group>(null);
  const neuralGalaxyRef = useRef<THREE.Group>(null);

  // Overview coordinates from registry cameraOverview
  const overviewPos: [number, number, number] = [0, 8, 12];
  const overviewTarget: [number, number, number] = [0, 0, -4];

  // Coordinates of the landmarks
  const coords = {
    "dataset-river": new THREE.Vector3(-6, -0.5, -5),
    "neural-galaxy": new THREE.Vector3(0, 1.5, -8),
    "training-chamber": new THREE.Vector3(6, -0.5, -5),
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
      case 0: // INGEST DATA -> Focus dataset river
        tx = coords["dataset-river"].x;
        ty = coords["dataset-river"].y;
        tz = coords["dataset-river"].z;
        cx = coords["dataset-river"].x + 2;
        cy = coords["dataset-river"].y + 3;
        cz = coords["dataset-river"].z + 5;
        break;
      case 1: // FORWARD PASS -> Focus neural galaxy layers
        tx = coords["neural-galaxy"].x;
        ty = coords["neural-galaxy"].y;
        tz = coords["neural-galaxy"].z;
        cx = coords["neural-galaxy"].x;
        cy = coords["neural-galaxy"].y + 4;
        cz = coords["neural-galaxy"].z + 6;
        break;
      case 2: // BACKPROPAGATE -> Focus training optimizer
        tx = coords["training-chamber"].x;
        ty = coords["training-chamber"].y;
        tz = coords["training-chamber"].z;
        cx = coords["training-chamber"].x - 2;
        cy = coords["training-chamber"].y + 3;
        cz = coords["training-chamber"].z + 5;
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

    // Dataset streams flow
    if (datasetStreamRef.current) {
      datasetStreamRef.current.children.forEach((child, i) => {
        child.position.x = -1.2 + ((t * 0.4 + i * 0.5) % 2.4);
      });
    }

    // Neural Galaxy layers pulses
    if (neuralGalaxyRef.current) {
      neuralGalaxyRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group>
      {/* Fog */}
      <fog attach="fog" args={["#050508", 8, 26]} />

      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 5]} intensity={0.3} color="#06B6D4" />
      <pointLight position={[0, 4, -4]} intensity={4} color="#06B6D4" distance={25} />

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
      <gridHelper args={[100, 100, "#06B6D4", "#0B0E0D"]} position={[0, -2.99, 0]} />

      {/* ── Landmark 1: Dataset River ── */}
      <group
        position={coords["dataset-river"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("dataset-river");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("dataset-river");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* River bed */}
        <mesh position={[0, -1.8, 0]}>
          <boxGeometry args={[3.2, 0.4, 1.8]} />
          <meshStandardMaterial
            color={activeLandmark === "dataset-river" ? "#06B6D4" : "#1F2937"}
            roughness={0.5}
          />
        </mesh>
        {/* Floating dataset tensors stream */}
        <group ref={datasetStreamRef}>
          {[-0.8, 0, 0.8].map((x, i) => (
            <mesh key={i} position={[x, -1.2, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshBasicMaterial color="#06B6D4" transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
        {arrivalDone && (
          <Html position={[0, 0.2, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>DATASET RIVER</span>
                <span className={s.labelValue}>TENSOR STREAM</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 2: Neural Layer Galaxy ── */}
      <group
        position={coords["neural-galaxy"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("neural-galaxy");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("neural-galaxy");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Rotating nodes array */}
        <group ref={neuralGalaxyRef}>
          {/* Input Layer */}
          {[-1.0, 0, 1.0].map((y) => (
            <mesh key={y} position={[-1.2, y + 0.2, 0]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshBasicMaterial color="#3B82F6" toneMapped={false} />
            </mesh>
          ))}
          {/* Hidden Layer */}
          {[-1.5, -0.5, 0.5, 1.5].map((y) => (
            <mesh key={y} position={[0, y + 0.2, 0]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshBasicMaterial color="#8B5CF6" toneMapped={false} />
            </mesh>
          ))}
          {/* Output Layer */}
          {[-0.6, 0.6].map((y) => (
            <mesh key={y} position={[1.2, y + 0.2, 0]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshBasicMaterial color="#06B6D4" toneMapped={false} />
            </mesh>
          ))}
        </group>
        {/* Base slot */}
        <mesh position={[0, -1.4, 0]}>
          <cylinderGeometry args={[2.0, 2.0, 0.4, 12]} />
          <meshStandardMaterial color="#0A0F14" roughness={0.4} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 2.6, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>NEURAL GALAXY</span>
                <span className={s.labelValue}>FORWARD PROP CORE</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 3: Gradient Training Chamber ── */}
      <group
        position={coords["training-chamber"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("training-chamber");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("training-chamber");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Chamber tube */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[1.0, 1.0, 2.4, 12, 1, true]} />
          <meshStandardMaterial
            color={activeLandmark === "training-chamber" ? "#8B5CF6" : "#1F2937"}
            roughness={0.1}
            transparent
            opacity={0.65}
          />
        </mesh>
        {/* Ascending optimization rings */}
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.8, 0.06, 8, 24]} />
          <meshBasicMaterial color="#8B5CF6" toneMapped={false} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 1.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>GRADIENT CHAMBER</span>
                <span className={s.labelValue}>BACKPROP ACCELERATOR</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>
    </group>
  );
}
