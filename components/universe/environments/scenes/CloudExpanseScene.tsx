"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useUniverseStore } from "@/store/universeStore";
import HolographicPanel from "../HolographicPanel";
import s from "../MotherboardEnvironment.module.css";

interface CloudExpanseSceneProps {
  reduced: boolean;
  onArrivalComplete: () => void;
}

export default function CloudExpanseScene({
  reduced,
  onArrivalComplete,
}: CloudExpanseSceneProps) {
  const { camera } = useThree();
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const activeSimStep = useUniverseStore((s) => s.activeSimStep);

  const [arrivalDone, setArrivalDone] = useState(reduced);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cameraTarget = useRef(new THREE.Vector3(0, 0, -4));
  const balancerRadarRef = useRef<THREE.Group>(null);
  const serverClusterRef = useRef<THREE.Group>(null);

  // Overview coordinates from registry cameraOverview
  const overviewPos: [number, number, number] = [0, 8, 12];
  const overviewTarget: [number, number, number] = [0, 0, -4];

  // Coordinates of the landmarks
  const coords = {
    "load-balancer": new THREE.Vector3(0, 1.5, -8),
    "server-cluster": new THREE.Vector3(-6, -0.5, -5),
    "monitoring-center": new THREE.Vector3(6, -0.5, -5),
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
      case 0: // INCOMING REQUEST -> Focus load balancer
        tx = coords["load-balancer"].x;
        ty = coords["load-balancer"].y;
        tz = coords["load-balancer"].z;
        cx = coords["load-balancer"].x;
        cy = coords["load-balancer"].y + 4;
        cz = coords["load-balancer"].z + 6;
        break;
      case 1: // AUTO SCALING -> Focus server cluster
        tx = coords["server-cluster"].x;
        ty = coords["server-cluster"].y;
        tz = coords["server-cluster"].z;
        cx = coords["server-cluster"].x + 2;
        cy = coords["server-cluster"].y + 3;
        cz = coords["server-cluster"].z + 5;
        break;
      case 2: // LOG TELEMETRY -> Focus monitoring center
        tx = coords["monitoring-center"].x;
        ty = coords["monitoring-center"].y;
        tz = coords["monitoring-center"].z;
        cx = coords["monitoring-center"].x - 2;
        cy = coords["monitoring-center"].y + 3;
        cz = coords["monitoring-center"].z + 5;
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

    // Rotate load balancer radar scanner ring
    if (balancerRadarRef.current) {
      balancerRadarRef.current.rotation.y = t * 1.6;
    }

    // Oscillate server instance scale heights (autoscaling animation)
    if (serverClusterRef.current) {
      serverClusterRef.current.children.forEach((child, i) => {
        const speed = 1.0 + i * 0.2;
        const scaleVal = 1.0 + Math.sin(t * speed) * 0.4;
        child.scale.set(1.0, scaleVal, 1.0);
      });
    }
  });

  return (
    <group>
      {/* Fog */}
      <fog attach="fog" args={["#050508", 8, 26]} />

      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 5]} intensity={0.3} color="#38BDF8" />
      <pointLight position={[0, 4, -4]} intensity={4} color="#38BDF8" distance={25} />

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
      <gridHelper args={[100, 100, "#38BDF8", "#0B0E0D"]} position={[0, -2.99, 0]} />

      {/* ── Landmark 1: Load Balancer Tower ── */}
      <group
        position={coords["load-balancer"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("load-balancer");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("load-balancer");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Tower Stem */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.6, 4.0, 12]} />
          <meshStandardMaterial
            color={activeLandmark === "load-balancer" ? "#38BDF8" : "#1e293b"}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Radar Ring */}
        <group ref={balancerRadarRef} position={[0, 1.6, 0]}>
          <mesh>
            <torusGeometry args={[1.4, 0.08, 8, 24]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.7} />
          </mesh>
          <mesh position={[1.4, 0, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>
        {arrivalDone && (
          <Html position={[0, 3.2, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>LOAD BALANCER</span>
                <span className={s.labelValue}>REVERSE PROXY</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 2: Horizontal Server Cluster ── */}
      <group
        position={coords["server-cluster"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("server-cluster");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("server-cluster");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Base slot */}
        <mesh position={[0, -1.8, 0]}>
          <boxGeometry args={[3.2, 0.4, 3.2]} />
          <meshStandardMaterial color="#0A0F14" roughness={0.4} />
        </mesh>
        {/* Auto scaling instances group */}
        <group ref={serverClusterRef}>
          {[-0.9, 0, 0.9].map((x, i) =>
            [-0.9, 0, 0.9].map((z, j) => (
              <mesh key={`${x}-${z}`} position={[x, -1.2, z]}>
                <boxGeometry args={[0.4, 1.2, 0.4]} />
                <meshStandardMaterial
                  color={activeLandmark === "server-cluster" ? "#ffffff" : "#38BDF8"}
                  roughness={0.2}
                  transparent
                  opacity={activeLandmark === "server-cluster" ? 0.95 : 0.5}
                />
              </mesh>
            ))
          )}
        </group>
        {arrivalDone && (
          <Html position={[0, 0.2, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>SERVER CLUSTER</span>
                <span className={s.labelValue}>POD AUTOSCALING</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 3: Metric Monitoring Center ── */}
      <group
        position={coords["monitoring-center"].toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("monitoring-center");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("monitoring-center");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Dish base support */}
        <mesh position={[0, -1.4, 0]}>
          <cylinderGeometry args={[1.5, 1.8, 0.4, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Radar dish structure */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0.3, 0.3]}>
          <cylinderGeometry args={[1.2, 0.2, 0.8, 12, 1, true]} />
          <meshStandardMaterial
            color={activeLandmark === "monitoring-center" ? "#ffffff" : "#38BDF8"}
            roughness={0.3}
            wireframe
          />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 1.6, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>MONITORING CENTER</span>
                <span className={s.labelValue}>TELEMETRY METRICS</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>
    </group>
  );
}
