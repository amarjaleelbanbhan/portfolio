"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  quickDeviceTier,
  prefersReducedMotion as detectReduced,
  type DeviceTier,
} from "@/lib/deviceTier";
import Motherboard3DScene from "./Motherboard3DScene";
import Motherboard2DCanvas from "./Motherboard2DCanvas";
import styles from "./EnvironmentLayer.module.css";

interface EnvironmentLayerProps {
  onArrivalComplete: () => void;
}

/**
 * EnvironmentLayer — determines the current device tier and mounts the correct
 * motherboard environment:
 *   - High/Medium Tier (1 & 2): R3F 3D motherboard city scene with light, depth, camera animations.
 *   - Low Tier (0): Flat, high-performance Canvas2D schematic drawing.
 *   - Reduced Motion: R3F scene with static camera/no animation.
 */
export default function EnvironmentLayer({
  onArrivalComplete,
}: EnvironmentLayerProps) {
  const [mounted, setMounted] = useState(false);
  const [tier, setTier] = useState<DeviceTier>(2);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(detectReduced());
    setTier(quickDeviceTier());
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.blackout} aria-hidden="true" />;
  }

  const use3D = tier > 0;

  return (
    <div className={styles.environment} aria-hidden="true">
      {use3D ? (
        <div className={styles.canvasHolder}>
          <Canvas
            camera={{ position: [0, -2.0, 18], fov: 55 }}
            dpr={[1, tier >= 2 ? 2 : 1.5]}
            gl={{ antialias: tier >= 2, powerPreference: "high-performance" }}
          >
            <color attach="background" args={["#050508"]} />
            <Motherboard3DScene
              reduced={reduced}
              onArrivalComplete={onArrivalComplete}
            />
          </Canvas>
        </div>
      ) : (
        <Motherboard2DCanvas tier={tier} reduced={reduced} />
      )}
    </div>
  );
}
