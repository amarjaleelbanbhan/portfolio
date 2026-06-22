"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import HolographicPanel from "./HolographicPanel";
import s from "./MotherboardEnvironment.module.css";

interface Motherboard3DSceneProps {
  reduced: boolean;
  onArrivalComplete: () => void;
}

export default function Motherboard3DScene({
  reduced,
  onArrivalComplete,
}: Motherboard3DSceneProps) {
  const { camera } = useThree();

  // Animation timeline state properties
  const timelineState = useRef({
    ambientIntensity: 0,
    pointIntensity: 0,
    cpuGlowScale: 0.1,
    cpuGlowColor: "#F59E0B",
    ramGlowAlpha: 0,
    mainPulseProgress: 0, // 0 -> 1 along the central highway
    secPulseProgress: 0,  // 0 -> 1 along the CPU-to-RAM highway
    secPulseActive: false,
  });

  const [arrivalDone, setArrivalDone] = useState(reduced);

  // References for three.js components
  const cpuCoreRef = useRef<THREE.Mesh>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const ramBlocksRef = useRef<THREE.Group>(null);
  const mainPulseRef = useRef<THREE.Mesh>(null);
  const secPulseRef = useRef<THREE.Mesh>(null);

  // Camera look-at target reference
  const cameraTarget = useRef(new THREE.Vector3(0, -2.4, -10));

  // 1. Central highway path (Start at Z=18 down to CPU Z=-4)
  const mainHighway = {
    start: new THREE.Vector3(0, -2.9, 18),
    end: new THREE.Vector3(0, -2.9, -4),
  };

  // 2. CPU-to-RAM highway path (CPU to Memory Slots)
  const ramHighway = {
    start: new THREE.Vector3(0, -2.9, -10),
    end: new THREE.Vector3(6.5, -2.9, -10),
  };

  // Setup initial camera and lights
  useEffect(() => {
    if (reduced) {
      // Immediate reveal for reduced motion
      camera.position.set(12, 10, 16);
      cameraTarget.current.set(0, 1, -10);
      timelineState.current.ambientIntensity = 0.55;
      timelineState.current.pointIntensity = 5;
      timelineState.current.cpuGlowScale = 1.0;
      timelineState.current.ramGlowAlpha = 0.8;
      timelineState.current.secPulseActive = true;
      setArrivalDone(true);
      onArrivalComplete();
      return;
    }

    // Set initial dark state & start position
    camera.position.set(0, -2.2, 18);
    cameraTarget.current.set(0, -2.4, -10);

    const state = timelineState.current;
    state.ambientIntensity = 0;
    state.pointIntensity = 0;
    state.cpuGlowScale = 0.1;
    state.ramGlowAlpha = 0;
    state.mainPulseProgress = 0;
    state.secPulseProgress = 0;
    state.secPulseActive = false;

    // Create GSAP cinematic arrival sequence timeline
    const tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        setArrivalDone(true);
        onArrivalComplete();
      },
    });

    // Act 1: Electrical pulse starts moving along the main highway
    tl.to(state, {
      mainPulseProgress: 0.5,
      duration: 1.8,
      ease: "power1.inOut",
    });

    // Camera flies behind/with the pulse along the main trace (Z moves 18 -> 1)
    tl.to(
      camera.position,
      {
        x: 0,
        y: -2.0,
        z: 1,
        duration: 2.2,
        ease: "power2.inOut",
      },
      "<"
    );

    // Act 2: CPU core awakens as pulse hits
    tl.to(
      state,
      {
        mainPulseProgress: 1.0,
        cpuGlowScale: 1.5,
        pointIntensity: 8,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=0.6"
    );

    // Ambient lighting slowly fades in to reveal the motherboard structures
    tl.to(
      state,
      {
        ambientIntensity: 0.55,
        pointIntensity: 5,
        cpuGlowScale: 1.0,
        duration: 1.5,
        ease: "power1.out",
      },
      "-=0.4"
    );

    // Act 3: Secondary pulse fires towards RAM and RAM activates
    tl.to(
      state,
      {
        secPulseActive: true,
        secPulseProgress: 1.0,
        ramGlowAlpha: 0.8,
        duration: 1.4,
        ease: "power2.out",
      },
      "-=1.0"
    );

    // Act 4: Cinematic overview reveal - camera pulls back and rises
    tl.to(
      camera.position,
      {
        x: 12,
        y: 10,
        z: 16,
        duration: 3.5,
        ease: "power3.inOut",
      },
      "-=1.2"
    );

    // Transition camera look-at target to CPU center
    tl.to(
      cameraTarget.current,
      {
        x: 0,
        y: 1,
        z: -10,
        duration: 3.5,
        ease: "power3.inOut",
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  }, [camera, reduced, onArrivalComplete]);

  // Frame tick updates
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const st = timelineState.current;

    // Smooth camera look-at
    camera.lookAt(cameraTarget.current);

    // Update light intensities from state object
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = st.ambientIntensity;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = st.pointIntensity + Math.sin(t * 4) * 0.8;
    }

    // Pulse the CPU core scale slightly in idle state
    if (cpuCoreRef.current) {
      const pulseFactor = arrivalDone ? 1.0 + Math.sin(t * 3.5) * 0.08 : st.cpuGlowScale;
      cpuCoreRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }

    // Animate electricity main pulse
    if (mainPulseRef.current) {
      const pos = new THREE.Vector3().lerpVectors(
        mainHighway.start,
        mainHighway.end,
        st.mainPulseProgress
      );
      mainPulseRef.current.position.copy(pos);
      mainPulseRef.current.visible = st.mainPulseProgress < 0.99;
    }

    // Animate secondary RAM pulse
    if (secPulseRef.current) {
      if (st.secPulseActive) {
        const pos = new THREE.Vector3().lerpVectors(
          ramHighway.start,
          ramHighway.end,
          st.secPulseProgress
        );
        secPulseRef.current.position.copy(pos);
        secPulseRef.current.visible = st.secPulseProgress < 0.99;
      } else {
        secPulseRef.current.visible = false;
      }
    }

    // Ambient loop for electricity pulses after arrival cinematic is done
    if (arrivalDone && !reduced) {
      const loopSpeed = 0.3;
      // Main central pulse loop
      const mainLoopVal = (t * loopSpeed) % 1.0;
      if (mainPulseRef.current) {
        mainPulseRef.current.visible = true;
        const pos = new THREE.Vector3().lerpVectors(mainHighway.start, mainHighway.end, mainLoopVal);
        mainPulseRef.current.position.copy(pos);
      }

      // secondary pulse loop
      const secLoopVal = ((t + 0.5) * loopSpeed * 1.3) % 1.0;
      if (secPulseRef.current) {
        secPulseRef.current.visible = true;
        const pos = new THREE.Vector3().lerpVectors(ramHighway.start, ramHighway.end, secLoopVal);
        secPulseRef.current.position.copy(pos);
      }
    }

    // Animate data blocks rising in RAM skyscrapers
    if (ramBlocksRef.current && arrivalDone && !reduced) {
      ramBlocksRef.current.children.forEach((mesh, index) => {
        const speed = 1.2 + (index % 3) * 0.4;
        const offset = index * 1.5;
        const yPos = -2.5 + ((t * speed + offset) % 6.5);
        mesh.position.y = yPos;
      });
    }
  });

  return (
    <group>
      {/* ── Atmospheric depth fog (creates massive landscape scale) ── */}
      <fog attach="fog" args={["#050508", 8, 28]} />

      {/* ── Lights ── */}
      <ambientLight ref={ambientLightRef} intensity={0} />
      <pointLight
        ref={pointLightRef}
        position={[0, 1.5, -10]}
        intensity={0}
        color="#F59E0B"
        distance={25}
      />
      <directionalLight position={[10, 20, 5]} intensity={0.25} color="#FFF7E6" />

      {/* ── Motherboard Base Plane ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#050706" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* PCB Circuit grid line patterns */}
      <gridHelper args={[100, 100, "#B45309", "#0B0E0D"]} position={[0, -2.99, 0]} />

      {/* ── Traces (Circuit Highways) ── */}
      {/* Central highway trace mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.98, 7]}>
        <planeGeometry args={[0.2, 22]} />
        <meshBasicMaterial color="#B45309" opacity={0.35} transparent />
      </mesh>
      {/* RAM bus trace mesh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.25, -2.98, -10]}>
        <planeGeometry args={[6.5, 0.15]} />
        <meshBasicMaterial color="#B45309" opacity={0.35} transparent />
      </mesh>
      {/* Distant background trace lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, -2.98, -16]}>
        <planeGeometry args={[0.08, 14]} />
        <meshBasicMaterial color="#B45309" opacity={0.15} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -2.98, -16]}>
        <planeGeometry args={[0.08, 14]} />
        <meshBasicMaterial color="#B45309" opacity={0.15} transparent />
      </mesh>

      {/* ── Moving Electrical Pulses ── */}
      <mesh ref={mainPulseRef}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial color="#FFF7E6" toneMapped={false} />
      </mesh>

      <mesh ref={secPulseRef}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#00F5FF" toneMapped={false} />
      </mesh>

      {/* ── Processor Tower (CPU) ── */}
      <group position={[0, 0, -10]}>
        {/* Layer 1: Base socket */}
        <mesh position={[0, -2.8, 0]}>
          <boxGeometry args={[11, 0.4, 11]} />
          <meshStandardMaterial color="#1E2321" roughness={0.5} metalness={0.8} />
        </mesh>

        {/* Layer 2: Ring connector collar */}
        <mesh position={[0, -2.4, 0]}>
          <boxGeometry args={[8.5, 0.4, 8.5]} />
          <meshStandardMaterial color="#321A0F" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Layer 3: Central metal shield with chip name */}
        <mesh position={[0, -2.0, 0]}>
          <boxGeometry args={[6, 0.4, 6]} />
          <meshStandardMaterial color="#4A524F" roughness={0.15} metalness={0.9} />
        </mesh>

        {/* Core Die: Pulsing glowing center */}
        <mesh ref={cpuCoreRef} position={[0, -1.3, 0]}>
          <boxGeometry args={[3, 1, 3]} />
          <meshBasicMaterial color="#F59E0B" toneMapped={false} transparent opacity={0.85} />
        </mesh>

        {/* Vertical processing energy pillar */}
        {arrivalDone && (
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 9, 12, 1, true]} />
            <meshBasicMaterial
              color="#F59E0B"
              transparent
              opacity={0.18 + Math.sin(THREE.MathUtils.degToRad(Date.now() * 0.08)) * 0.05}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Floating 3D HTML callout label */}
        {arrivalDone && (
          <Html position={[0, 4.8, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>PROCESSOR TOWER</span>
                <span className={s.labelValue}>CPU CORE — ALU ACTIVE</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Memory Skyscrapers (RAM Modules) ── */}
      <group position={[7.5, 0, -10]}>
        {/* RAM Tower 1 */}
        <mesh position={[0, 0.5, -3]}>
          <boxGeometry args={[0.5, 7, 1.8]} />
          <meshStandardMaterial color="#0B130E" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* RAM Tower 2 */}
        <mesh position={[0, 0.5, -1]}>
          <boxGeometry args={[0.5, 7, 1.8]} />
          <meshStandardMaterial color="#0B130E" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* RAM Tower 3 */}
        <mesh position={[0, 0.5, 1]}>
          <boxGeometry args={[0.5, 7, 1.8]} />
          <meshStandardMaterial color="#0B130E" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* RAM Tower 4 */}
        <mesh position={[0, 0.5, 3]}>
          <boxGeometry args={[0.5, 7, 1.8]} />
          <meshStandardMaterial color="#0B130E" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Vertical animated data block cubes inside skyscrapers */}
        <group ref={ramBlocksRef}>
          {/* We place 4 small glowing data packets in RAM slots */}
          {arrivalDone &&
            [-3, -1, 1, 3].map((zVal, idx) => (
              <mesh key={idx} position={[0, -2, zVal]}>
                <boxGeometry args={[0.55, 0.4, 0.4]} />
                <meshBasicMaterial color="#00F5FF" toneMapped={false} />
              </mesh>
            ))}
        </group>

        {/* Floating 3D HTML callout label */}
        {arrivalDone && (
          <Html position={[0, 4.8, 0]} center distanceFactor={14}>
            <HolographicPanel className={s.floatingLabel}>
              <div className={s.floatingText}>
                <span className={s.labelTitle}>MEMORY ARRAY</span>
                <span className={s.labelValue}>DDR5 — ADDRESS CHANNELS</span>
              </div>
            </HolographicPanel>
          </Html>
        )}
      </group>

      {/* ── Distant background skyscrapers (microscopic scale) ── */}
      {arrivalDone && (
        <group position={[0, -3, -32]}>
          {/* Faint tower left */}
          <mesh position={[-18, 5, 0]}>
            <boxGeometry args={[1.8, 16, 1.8]} />
            <meshStandardMaterial color="#070a09" roughness={0.7} metalness={0.8} />
          </mesh>
          {/* Faint tower right */}
          <mesh position={[18, 5, 0]}>
            <boxGeometry args={[1.8, 16, 1.8]} />
            <meshStandardMaterial color="#070a09" roughness={0.7} metalness={0.8} />
          </mesh>
          {/* Distant logic block */}
          <mesh position={[0, 2, -8]}>
            <boxGeometry args={[14, 10, 2]} />
            <meshStandardMaterial color="#070a09" roughness={0.8} metalness={0.7} />
          </mesh>
        </group>
      )}

      {/* ── Circuit Highway (Static Text/Floating Label) ── */}
      {arrivalDone && (
        <Html position={[0, -2.5, 8]} center distanceFactor={14}>
          <HolographicPanel className={s.floatingLabel}>
            <div className={s.floatingText}>
              <span className={s.labelTitle}>SIGNAL HIGHWAYS</span>
              <span className={s.labelValue}>6.4 GT/s SYSTEM BUS</span>
            </div>
          </HolographicPanel>
        </Html>
      )}
    </group>
  );
}
