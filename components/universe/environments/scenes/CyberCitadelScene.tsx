"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useUniverseStore } from "@/store/universeStore";
import HolographicPanel from "../HolographicPanel";
import s from "../MotherboardEnvironment.module.css";

interface CyberCitadelSceneProps {
  reduced: boolean;
  onArrivalComplete: () => void;
}

export default function CyberCitadelScene({
  reduced,
  onArrivalComplete,
}: CyberCitadelSceneProps) {
  const { camera } = useThree();
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const activeSimStep = useUniverseStore((s) => s.activeSimStep);

  const [arrivalDone, setArrivalDone] = useState(reduced);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cameraTarget = useRef(new THREE.Vector3(0, 0, -4));
  const lockCylinderRef = useRef<THREE.Group>(null);
  const gateLaserRef = useRef<THREE.Mesh>(null);
  const ambientShieldPulseRef = useRef<THREE.Mesh>(null);
  const ambientShieldState = useRef({ cycleStart: 0, cycleLength: 5 });

  // Overview coordinates from registry cameraOverview
  const overviewPos: [number, number, number] = [0, 8, 12];
  const overviewTarget: [number, number, number] = [0, 0, -4];

  // Coordinates of the landmarks
  const coords = {
    "auth-gate": new THREE.Vector3(-6, -0.5, -5),
    "encryption-chamber": new THREE.Vector3(0, 1.5, -8),
    "threat-scanner": new THREE.Vector3(6, -0.5, -5),
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
      case 0: // THREAT SCAN -> Focus threat scanner
        tx = coords["threat-scanner"].x;
        ty = coords["threat-scanner"].y;
        tz = coords["threat-scanner"].z;
        cx = coords["threat-scanner"].x - 2;
        cy = coords["threat-scanner"].y + 3;
        cz = coords["threat-scanner"].z + 5;
        break;
      case 1: // IDENTITY AUTH -> Focus auth gate
        tx = coords["auth-gate"].x;
        ty = coords["auth-gate"].y;
        tz = coords["auth-gate"].z;
        cx = coords["auth-gate"].x + 2;
        cy = coords["auth-gate"].y + 3;
        cz = coords["auth-gate"].z + 5;
        break;
      case 2: // CRYPT ENGINE -> Focus encryption chamber
        tx = coords["encryption-chamber"].x;
        ty = coords["encryption-chamber"].y;
        tz = coords["encryption-chamber"].z;
        cx = coords["encryption-chamber"].x;
        cy = coords["encryption-chamber"].y + 4;
        cz = coords["encryption-chamber"].z + 6;
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

    // Rotate encryption cylinders
    if (lockCylinderRef.current) {
      lockCylinderRef.current.children.forEach((child, i) => {
        child.rotation.y = t * (i % 2 === 0 ? 0.4 : -0.4);
      });
    }

    // Oscillate authentication gate laser scanner
    if (gateLaserRef.current) {
      gateLaserRef.current.position.x = Math.sin(t * 2) * 0.8;
    }

    // Ambient threat: an occasional small pulse approaches the encryption
    // chamber ("shield") from outside and is absorbed/deflected at its
    // boundary — ambient, not user-triggered (Phase 14 §1).
    if (ambientShieldPulseRef.current && arrivalDone && !reduced) {
      const qs = ambientShieldState.current;
      const elapsed = t - qs.cycleStart;
      if (elapsed > qs.cycleLength) {
        qs.cycleStart = t;
        qs.cycleLength = 4 + Math.random() * 2; // 4-6s
      }
      const travelDuration = 1.0;
      const local = Math.min(elapsed / travelDuration, 1);
      ambientShieldPulseRef.current.visible = local < 1;
      // Approaches from outside (local z) toward the shield core at origin.
      ambientShieldPulseRef.current.position.set(0, 0.2 + (1 - local) * 0.4, 4 - local * 4);
    }
  });

  return (
    <group>
      {/* Fog */}
      <fog attach="fog" args={["#050508", 8, 26]} />

      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[-10, 20, 5]} intensity={0.3} color="#EF4444" />
      <pointLight position={[0, 4, -4]} intensity={4} color="#EF4444" distance={25} />

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
      <gridHelper args={[100, 100, "#EF4444", "#0B0E0D"]} position={[0, -2.99, 0]} />

      {/* ── Landmark 1: Authentication Gate ── */}
      <group
        position={coords["auth-gate"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("auth-gate");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("auth-gate");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Gate Pillars */}
        <mesh position={[-1.0, -0.6, 0]}>
          <boxGeometry args={[0.4, 3.2, 0.4]} />
          <meshStandardMaterial
            color={activeLandmark === "auth-gate" ? "#EF4444" : "#1F2937"}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[1.0, -0.6, 0]}>
          <boxGeometry args={[0.4, 3.2, 0.4]} />
          <meshStandardMaterial
            color={activeLandmark === "auth-gate" ? "#EF4444" : "#1F2937"}
            roughness={0.4}
          />
        </mesh>
        {/* Sweeping Laser scanner plane */}
        <mesh ref={gateLaserRef} position={[0, -0.6, 0]}>
          <boxGeometry args={[0.05, 3.0, 0.6]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.6} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 1.6, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>AUTH GATE</span>
                <span className={s.labelValue}>SIGNATURE CONTROL</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 2: Encryption Chamber ── */}
      <group
        position={coords["encryption-chamber"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("encryption-chamber");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("encryption-chamber");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Interlocking cylinder blocks */}
        <group ref={lockCylinderRef}>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.5, 16, 1, true]} />
            <meshStandardMaterial color="#EF4444" wireframe />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[1.1, 1.1, 0.5, 16, 1, true]} />
            <meshStandardMaterial color="#1F2937" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.5, 16, 1, true]} />
            <meshBasicMaterial color="#22C55E" transparent opacity={0.4} />
          </mesh>
        </group>
        {/* Core database key */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#22C55E" toneMapped={false} />
        </mesh>
        {/* Ambient incoming threat pulse, absorbed at the shield boundary */}
        {arrivalDone && !reduced && (
          <mesh ref={ambientShieldPulseRef}>
            <sphereGeometry args={[0.16, 10, 10]} />
            <meshBasicMaterial color="#EF4444" toneMapped={false} />
          </mesh>
        )}
        {arrivalDone && (
          <Html position={[0, 2.2, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>CRYPT CHAMBER</span>
                <span className={s.labelValue}>AES KEY ENCRYPTOR</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 3: Threat Intrusion Scanner ── */}
      <group
        position={coords["threat-scanner"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("threat-scanner");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("threat-scanner");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Scan panel base */}
        <mesh position={[0, -1.8, 0]}>
          <boxGeometry args={[2.5, 0.4, 2.5]} />
          <meshStandardMaterial
            color={activeLandmark === "threat-scanner" ? "#EF4444" : "#1F2937"}
            roughness={0.4}
          />
        </mesh>
        {/* Scanning lasers beams */}
        {[-0.8, 0, 0.8].map((x) => (
          <mesh key={x} position={[x, -0.6, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.0, 8]} />
            <meshBasicMaterial color="#EF4444" transparent opacity={0.4} />
          </mesh>
        ))}
        {arrivalDone && (
          <Html position={[0, 0.8, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>THREAT SCANNER</span>
                <span className={s.labelValue}>XSS / INJECTION AUDITOR</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>
    </group>
  );
}
