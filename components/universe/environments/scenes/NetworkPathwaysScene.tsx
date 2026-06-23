"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useUniverseStore } from "@/store/universeStore";
import HolographicPanel from "../HolographicPanel";
import s from "../MotherboardEnvironment.module.css";

interface NetworkPathwaysSceneProps {
  reduced: boolean;
  onArrivalComplete: () => void;
}

export default function NetworkPathwaysScene({
  reduced,
  onArrivalComplete,
}: NetworkPathwaysSceneProps) {
  const { camera } = useThree();
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const activeSimStep = useUniverseStore((s) => s.activeSimStep);

  const [arrivalDone, setArrivalDone] = useState(reduced);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cameraTarget = useRef(new THREE.Vector3(0, 1, -2));
  const firewallPulseRef = useRef<THREE.Mesh>(null);
  const dnsPulseRef = useRef<THREE.Mesh>(null);
  const ambientPacketRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Overview coordinates
  const overviewPos: [number, number, number] = [12, 10, 15];
  const overviewTarget: [number, number, number] = [0, 1, -2];

  // Coordinates of the landmarks
  const coords = {
    client: new THREE.Vector3(-8, -1, 4),
    dns: new THREE.Vector3(-4, 1.5, -4),
    router: new THREE.Vector3(0, 0, 0),
    firewall: new THREE.Vector3(4, 0.5, -4),
    server: new THREE.Vector3(8, -1, 4),
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

  // 2. Dynamic Camera Pan ("Packet POV") based on Sim Step
  useEffect(() => {
    if (!arrivalDone || reduced) return;

    let tx = overviewTarget[0];
    let ty = overviewTarget[1];
    let tz = overviewTarget[2];

    let cx = overviewPos[0];
    let cy = overviewPos[1];
    let cz = overviewPos[2];

    // Align camera angles to view active step operations closely
    switch (activeSimStep) {
      case 0: // CREATE -> focus client
      case 2: // ENCAPSULATE -> focus client
        tx = coords.client.x;
        ty = coords.client.y + 1;
        tz = coords.client.z;
        cx = coords.client.x + 3;
        cy = coords.client.y + 4;
        cz = coords.client.z + 6;
        break;
      case 1: // DNS -> focus DNS
        tx = coords.dns.x;
        ty = coords.dns.y;
        tz = coords.dns.z;
        cx = coords.dns.x - 2;
        cy = coords.dns.y + 3;
        cz = coords.dns.z + 5;
        break;
      case 3: // ROUTING -> focus Router
        tx = coords.router.x;
        ty = coords.router.y + 1;
        tz = coords.router.z;
        cx = coords.router.x + 4;
        cy = coords.router.y + 4;
        cz = coords.router.z + 6;
        break;
      case 4: // FIREWALL -> focus Firewall
        tx = coords.firewall.x;
        ty = coords.firewall.y + 1;
        tz = coords.firewall.z;
        cx = coords.firewall.x + 3;
        cy = coords.firewall.y + 3;
        cz = coords.firewall.z + 5;
        break;
      case 5: // SERVER -> focus Server
        tx = coords.server.x;
        ty = coords.server.y + 1;
        tz = coords.server.z;
        cx = coords.server.x - 3;
        cy = coords.server.y + 4;
        cz = coords.server.z + 6;
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

    // Animate radar sweep on DNS Beacon
    const dnsRadar = state.scene.getObjectByName("dns-radar");
    if (dnsRadar) {
      dnsRadar.rotation.y = t * 1.5;
    }

    // Animate pulses during active steps
    if (dnsPulseRef.current && activeSimStep === 1) {
      const progress = (t * 0.8) % 1.0;
      // path: client -> dns -> client
      if (progress < 0.5) {
        const local = progress / 0.5;
        dnsPulseRef.current.position.lerpVectors(coords.client, coords.dns, local);
      } else {
        const local = (progress - 0.5) / 0.5;
        dnsPulseRef.current.position.lerpVectors(coords.dns, coords.client, local);
      }
    }

    if (firewallPulseRef.current && activeSimStep === 4) {
      // pause packet at firewall barrier, sweep scan
      const progress = (t * 0.5) % 1.0;
      if (progress < 0.4) {
        // travel to firewall gate
        const local = progress / 0.4;
        firewallPulseRef.current.position.lerpVectors(coords.router, coords.firewall, local);
      } else if (progress < 0.7) {
        // pause at firewall
        firewallPulseRef.current.position.copy(coords.firewall);
      } else {
        // pass through firewall to server
        const local = (progress - 0.7) / 0.3;
        firewallPulseRef.current.position.lerpVectors(coords.firewall, coords.server, local);
      }
    }

    // Ambient background traffic: small packets continuously traveling the
    // full client→dns→router→firewall→server path, independent of the
    // active sim step — "alternate routes" at different speeds (Phase 14 §1).
    if (arrivalDone && !reduced) {
      const route = [coords.client, coords.dns, coords.router, coords.firewall, coords.server];
      const speeds = [0.12, 0.18, 0.09];
      ambientPacketRefs.current.forEach((mesh, i) => {
        if (!mesh) return;
        const speed = speeds[i % speeds.length];
        const segLen = route.length - 1;
        const progress = ((t * speed + i * 0.33) % 1.0) * segLen;
        const segIndex = Math.min(Math.floor(progress), segLen - 1);
        const local = progress - segIndex;
        mesh.position.lerpVectors(route[segIndex], route[segIndex + 1], local);
      });
    }
  });

  return (
    <group>
      {/* ── Atmospheric depth fog ── */}
      <fog attach="fog" args={["#050508", 8, 26]} />

      {/* ── Lights ── */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 5]} intensity={0.3} color="#E0F2FE" />
      <pointLight position={[0, 4, 0]} intensity={4} color="#0D9488" distance={25} />

      {/* ── Grid Base ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.01, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark(null);
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#030406" roughness={0.7} metalness={0.4} />
      </mesh>
      <gridHelper args={[100, 100, "#0D9488", "#0B0E0D"]} position={[0, -2.99, 0]} />

      {/* ── Luminous Fiber Pathways ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, -2.98, 0]}>
        <planeGeometry args={[8, 0.12]} />
        <meshBasicMaterial color="#0D9488" opacity={0.3} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, -2.98, 0]}>
        <planeGeometry args={[8, 0.12]} />
        <meshBasicMaterial color="#0D9488" opacity={0.3} transparent />
      </mesh>

      {/* ── Visual Pulse Elements ── */}
      {activeSimStep === 1 && (
        <mesh ref={dnsPulseRef}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color="#E0F2FE" toneMapped={false} />
        </mesh>
      )}

      {activeSimStep === 4 && (
        <mesh ref={firewallPulseRef}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color="#38BDF8" toneMapped={false} />
        </mesh>
      )}

      {/* Ambient background traffic — independent of the active sim step */}
      {arrivalDone &&
        !reduced &&
        [0, 1, 2].map((i) => (
          <mesh
            key={`ambient-packet-${i}`}
            ref={(el) => {
              ambientPacketRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#0D9488" transparent opacity={0.55} toneMapped={false} />
          </mesh>
        ))}

      {/* ── Landmark 1: Client Terminal ── */}
      <group
        position={coords.client.toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("client-terminal");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("client-terminal");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Terminal desk block */}
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[3, 0.4, 2]} />
          <meshStandardMaterial
            color={activeLandmark === "client-terminal" ? "#1E2E2A" : "#0F1715"}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {/* Monitor Screen */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.6, 1.2, 0.4]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* Glowing Screen Face */}
        <mesh position={[0, 0.6, 0.22]}>
          <planeGeometry args={[1.4, 1.0]} />
          <meshBasicMaterial color="#0D9488" transparent opacity={0.8} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 1.8, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>CLIENT TERMINAL</span>
                <span className={s.labelValue}>REQUEST INITIATION</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 2: DNS Beacon Tower ── */}
      <group
        position={coords.dns.toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("dns-beacon");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("dns-beacon");
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
            color={activeLandmark === "dns-beacon" ? "#1E2E2A" : "#0F1715"}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Rotating Radar Beacon Ring */}
        <mesh name="dns-radar" position={[0, 1.8, 0]}>
          <torusGeometry args={[1.2, 0.08, 8, 24]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.8} />
        </mesh>
        {/* Beacon Center Sphere */}
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#E0F2FE" toneMapped={false} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 3.2, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>DNS BEACON</span>
                <span className={s.labelValue}>NAME DIRECTORY</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 3: Router Network Hub ── */}
      <group
        position={coords.router.toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("router-network");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("router-network");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Central Router core socket */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[2.5, 2.5, 0.4, 16]} />
          <meshStandardMaterial
            color={activeLandmark === "router-network" ? "#1E2E2A" : "#0F1715"}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {/* Moving routing signal ring */}
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 1.2, 16, 1, true]} />
          <meshBasicMaterial color="#0D9488" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 1.0, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>ROUTER NETWORK</span>
                <span className={s.labelValue}>L3 NEXT-HOP ROUTER</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 4: Firewall Scanner Gate ── */}
      <group
        position={coords.firewall.toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("firewall-gate");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("firewall-gate");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Gate base supports */}
        <mesh position={[-1.2, -1.2, 0]}>
          <boxGeometry args={[0.4, 2.0, 0.4]} />
          <meshStandardMaterial color="#0F1715" />
        </mesh>
        <mesh position={[1.2, -1.2, 0]}>
          <boxGeometry args={[0.4, 2.0, 0.4]} />
          <meshStandardMaterial color="#0F1715" />
        </mesh>
        {/* Laser scanner shield plane */}
        <mesh position={[0, -0.2, 0]}>
          <planeGeometry args={[2.0, 2.0]} />
          <meshBasicMaterial
            color={
              activeSimStep === 4
                ? "rgba(34, 197, 94, 0.6)"
                : activeLandmark === "firewall-gate"
                ? "rgba(239, 68, 68, 0.6)"
                : "rgba(239, 68, 68, 0.2)"
            }
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 1.4, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>FIREWALL GATE</span>
                <span className={s.labelValue}>HEADER INSPECTION</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Landmark 5: Server Core ── */}
      <group
        position={coords.server.toArray()}
        onClick={(e) => {
          e.stopPropagation();
          selectLandmark("server-core");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode("server-core");
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Server Rack 1 */}
        <mesh position={[-0.8, 0.5, 0]}>
          <boxGeometry args={[0.8, 6.0, 1.8]} />
          <meshStandardMaterial
            color={activeLandmark === "server-core" ? "#1E2E2A" : "#0A0D0E"}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {/* Server Rack 2 */}
        <mesh position={[0.8, 0.5, 0]}>
          <boxGeometry args={[0.8, 6.0, 1.8]} />
          <meshStandardMaterial
            color={activeLandmark === "server-core" ? "#1E2E2A" : "#0A0D0E"}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        {arrivalDone && (
          <Html position={[0, 4.2, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>SERVER CORE</span>
                <span className={s.labelValue}>API ENDPOINT SERVER</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>
    </group>
  );
}
