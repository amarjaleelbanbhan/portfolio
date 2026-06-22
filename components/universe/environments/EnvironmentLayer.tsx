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
import Generic3DScene from "./Generic3DScene";
import Generic2DCanvas from "./Generic2DCanvas";
import NetworkPathwaysScene from "./scenes/NetworkPathwaysScene";
import NetworkPathways2D from "./scenes/NetworkPathways2D";
import TheKernelScene from "./scenes/TheKernelScene";
import TheKernel2D from "./scenes/TheKernel2D";
import CodeHelixScene from "./scenes/CodeHelixScene";
import CodeHelix2D from "./scenes/CodeHelix2D";
import DataArchivesScene from "./scenes/DataArchivesScene";
import DataArchives2D from "./scenes/DataArchives2D";
import CyberCitadelScene from "./scenes/CyberCitadelScene";
import CyberCitadel2D from "./scenes/CyberCitadel2D";
import NeuralNebulaScene from "./scenes/NeuralNebulaScene";
import NeuralNebula2D from "./scenes/NeuralNebula2D";
import styles from "./EnvironmentLayer.module.css";

interface EnvironmentLayerProps {
  slug: string;
  onArrivalComplete: () => void;
}

/**
 * EnvironmentLayer — determines the current device tier and mounts the correct
 * background environment:
 *   - High/Medium Tier (1 & 2): R3F 3D motherboard city scene, networking pathways, or generic landmark nodes scene.
 *   - Low Tier (0): Flat, high-performance Canvas2D schematic drawing.
 *   - Reduced Motion: R3F scene with static camera/no animation.
 */
export default function EnvironmentLayer({
  slug,
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
  const isSiliconFoundry = slug === "silicon-foundry";
  const isNetworkPathways = slug === "network-pathways";
  const isKernel = slug === "the-kernel";
  const isCodeHelix = slug === "code-helix";
  const isDataArchives = slug === "data-archives";
  const isCitadel = slug === "the-citadel";
  const isNebula = slug === "neural-nebula";

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
            {isSiliconFoundry ? (
              <Motherboard3DScene
                reduced={reduced}
                onArrivalComplete={onArrivalComplete}
              />
            ) : isNetworkPathways ? (
              <NetworkPathwaysScene
                reduced={reduced}
                onArrivalComplete={onArrivalComplete}
              />
            ) : isKernel ? (
              <TheKernelScene
                reduced={reduced}
                onArrivalComplete={onArrivalComplete}
              />
            ) : isCodeHelix ? (
              <CodeHelixScene
                reduced={reduced}
                onArrivalComplete={onArrivalComplete}
              />
            ) : isDataArchives ? (
              <DataArchivesScene
                reduced={reduced}
                onArrivalComplete={onArrivalComplete}
              />
            ) : isCitadel ? (
              <CyberCitadelScene
                reduced={reduced}
                onArrivalComplete={onArrivalComplete}
              />
            ) : isNebula ? (
              <NeuralNebulaScene
                reduced={reduced}
                onArrivalComplete={onArrivalComplete}
              />
            ) : (
              <Generic3DScene
                slug={slug}
                reduced={reduced}
                onArrivalComplete={onArrivalComplete}
              />
            )}
          </Canvas>
        </div>
      ) : isSiliconFoundry ? (
        <Motherboard2DCanvas tier={tier} reduced={reduced} />
      ) : isNetworkPathways ? (
        <NetworkPathways2D tier={tier} reduced={reduced} />
      ) : isKernel ? (
        <TheKernel2D tier={tier} reduced={reduced} />
      ) : isCodeHelix ? (
        <CodeHelix2D tier={tier} reduced={reduced} />
      ) : isDataArchives ? (
        <DataArchives2D tier={tier} reduced={reduced} />
      ) : isCitadel ? (
        <CyberCitadel2D tier={tier} reduced={reduced} />
      ) : isNebula ? (
        <NeuralNebula2D tier={tier} reduced={reduced} />
      ) : (
        <Generic2DCanvas slug={slug} tier={tier} reduced={reduced} />
      )}
    </div>
  );
}
