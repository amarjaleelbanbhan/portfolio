"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useUniverseStore } from "@/store/universeStore";
import HolographicPanel from "../HolographicPanel";
import s from "../MotherboardEnvironment.module.css";

interface TheKernelSceneProps {
  reduced: boolean;
  onArrivalComplete: () => void;
}

export default function TheKernelScene({
  reduced,
  onArrivalComplete,
}: TheKernelSceneProps) {
  const { camera } = useThree();
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const activeSimStep = useUniverseStore((s) => s.activeSimStep);

  const [arrivalDone, setArrivalDone] = useState(reduced);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cameraTarget = useRef(new THREE.Vector3(0, 0, -4));
  const schedulerRotationRef = useRef<THREE.Group>(null);
  const securityRingsRef = useRef<THREE.Group>(null);

  // Overview coordinates from registry cameraOverview
  const overviewPos: [number, number, number] = [0, 8, 14];
  const overviewTarget: [number, number, number] = [0, 0, -4];

  // Coordinates of the landmarks
  const coords = {
    "scheduler-tower": new THREE.Vector3(0, 1.5, -8),
    "memory-manager": new THREE.Vector3(-6, -0.5, -5),
    "file-system": new THREE.Vector3(6, -0.5, -5),
    "device-controller": new THREE.Vector3(-3, -1, 1),
    "security-ring": new THREE.Vector3(3, -1, 1),
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
      case 0: // APP OPEN -> Focus File System
        tx = coords["file-system"].x;
        ty = coords["file-system"].y;
        tz = coords["file-system"].z;
        cx = coords["file-system"].x - 3;
        cy = coords["file-system"].y + 3;
        cz = coords["file-system"].z + 5;
        break;
      case 1: // ALLOCATE MEMORY -> Focus Memory Manager
        tx = coords["memory-manager"].x;
        ty = coords["memory-manager"].y;
        tz = coords["memory-manager"].z;
        cx = coords["memory-manager"].x + 3;
        cy = coords["memory-manager"].y + 3;
        cz = coords["memory-manager"].z + 5;
        break;
      case 2: // SCHEDULE PROCESS -> Focus Scheduler Tower
        tx = coords["scheduler-tower"].x;
        ty = coords["scheduler-tower"].y;
        tz = coords["scheduler-tower"].z;
        cx = coords["scheduler-tower"].x;
        cy = coords["scheduler-tower"].y + 4;
        cz = coords["scheduler-tower"].z + 6;
        break;
      case 3: // HARDWARE ACCESS -> Focus Device Controller
        tx = coords["device-controller"].x;
        ty = coords["device-controller"].y;
        tz = coords["device-controller"].z;
        cx = coords["device-controller"].x - 2;
        cy = coords["device-controller"].y + 3;
        cz = coords["device-controller"].z + 5;
        break;
      case 4: // APP RUNNING -> Focus Security Ring
        tx = coords["security-ring"].x;
        ty = coords["security-ring"].y;
        tz = coords["security-ring"].z;
        cx = coords["security-ring"].x + 2;
        cy = coords["security-ring"].y + 3;
        cz = coords["security-ring"].z + 5;
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

    // Rotations for the Scheduler Tower layers
    if (schedulerRotationRef.current) {
      schedulerRotationRef.current.children.forEach((child, i) => {
        child.rotation.y = t * (i % 2 === 0 ? 0.5 : -0.5);
      });
    }

    // Rotations for Security Rings
    if (securityRingsRef.current) {
      securityRingsRef.current.children.forEach((child, i) => {
        child.rotation.z = t * (0.2 * (i + 1));
      });
    }
  });

  return (
    <group>
      {/* Fog for depth */}
      <fog attach="fog" args={["#050508", 8, 26]} />

      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[-10, 20, 5]} intensity={0.3} color="#22D3EE" />
      <pointLight position={[0, 5, -5]} intensity={5} color="#22D3EE" distance={25} />

      {/* Grid Floor */}
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
      <gridHelper args={[100, 100, "#22D3EE", "#0B0E0D"]} position={[0, -2.99, 0]} />

      {/* ── Landmark 1: Process Scheduler Tower ── */}
      <group
        position={coords["scheduler-tower"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("scheduler-tower");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("scheduler-tower");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        <group ref={schedulerRotationRef}>
          {/* Segment 1 */}
          <mesh position={[0, -1.0, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 1.0, 12, 1]} />
            <meshStandardMaterial
              color={activeLandmark === "scheduler-tower" ? "#1e293b" : "#0f172a"}
              wireframe
            />
          </mesh>
          {/* Segment 2 */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[1.2, 1.5, 1.0, 12, 1]} />
            <meshStandardMaterial
              color={activeLandmark === "scheduler-tower" ? "#334155" : "#1e293b"}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Segment 3 */}
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.8, 1.2, 1.0, 12, 1]} />
            <meshStandardMaterial
              color={activeLandmark === "scheduler-tower" ? "#475569" : "#334155"}
              wireframe
            />
          </mesh>
        </group>
        {/* Core pillar */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 4.0, 8]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.3} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 3.0, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>SCHEDULER TOWER</span>
                <span className={s.labelValue}>CPU TIME ALLOCATOR</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 2: Memory Manager Grid ── */}
      <group
        position={coords["memory-manager"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("memory-manager");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("memory-manager");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Substrate slab */}
        <mesh position={[0, -2.0, 0]}>
          <boxGeometry args={[3.2, 0.4, 3.2]} />
          <meshStandardMaterial
            color={activeLandmark === "memory-manager" ? "#1e293b" : "#0f172a"}
            roughness={0.5}
            metalness={0.9}
          />
        </mesh>
        {/* Array of RAM blocks */}
        {[-0.9, 0, 0.9].map((x) =>
          [-0.9, 0, 0.9].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -1.5, z]}>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial
                color="#22D3EE"
                transparent
                opacity={activeLandmark === "memory-manager" ? 0.8 : 0.3}
                roughness={0.1}
              />
            </mesh>
          ))
        )}
        {arrivalDone && (
          <Html position={[0, -0.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>MEMORY MANAGER</span>
                <span className={s.labelValue}>VIRTUAL ADDR SPACE</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 3: File System Archive ── */}
      <group
        position={coords["file-system"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("file-system");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("file-system");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Main Cabinet structure */}
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[2.0, 3.2, 2.0]} />
          <meshStandardMaterial
            color={activeLandmark === "file-system" ? "#1e293b" : "#0f172a"}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {/* Glowing slot lines */}
        {[-1.0, -0.2, 0.6].map((y) => (
          <mesh key={y} position={[0, y, 1.01]}>
            <planeGeometry args={[1.6, 0.15]} />
            <meshBasicMaterial color="#22D3EE" transparent opacity={0.7} />
          </mesh>
        ))}
        {arrivalDone && (
          <Html position={[0, 1.6, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>FILE ARCHIVE</span>
                <span className={s.labelValue}>INODE DIRECTORY</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 4: Device Controller Hub ── */}
      <group
        position={coords["device-controller"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("device-controller");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("device-controller");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Core base */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[1.5, 1.8, 0.4, 12]} />
          <meshStandardMaterial
            color={activeLandmark === "device-controller" ? "#1e293b" : "#0f172a"}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {/* Glowing antenna */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.15, 2.0, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#22D3EE" toneMapped={false} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 1.2, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>DEVICE HUB</span>
                <span className={s.labelValue}>INTERRUPT CONTROLLER</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 5: Security Rings ── */}
      <group
        position={coords["security-ring"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("security-ring");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("security-ring");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Concentric rings */}
        <group ref={securityRingsRef} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Ring 3: User mode */}
          <mesh position={[0, 0, -1.8]}>
            <torusGeometry args={[1.6, 0.06, 8, 32]} />
            <meshBasicMaterial color="#94A3B8" transparent opacity={0.6} />
          </mesh>
          {/* Ring 0: Kernel mode */}
          <mesh position={[0, 0, -1.8]}>
            <torusGeometry args={[0.8, 0.08, 8, 32]} />
            <meshBasicMaterial color="#22D3EE" transparent opacity={0.8} />
          </mesh>
        </group>
        {/* Shield core */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 12]} />
          <meshStandardMaterial
            color={activeLandmark === "security-ring" ? "#1e293b" : "#0f172a"}
            roughness={0.1}
          />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 0.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>SECURITY RINGS</span>
                <span className={s.labelValue}>RING 0 / RING 3 GATE</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>
    </group>
  );
}
