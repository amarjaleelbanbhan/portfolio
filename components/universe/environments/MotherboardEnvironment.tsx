"use client";

import { type ReactNode, useState, useEffect } from "react";
import { useUniverseStore } from "@/store/universeStore";
import EnvironmentLayer from "./EnvironmentLayer";
import styles from "./MotherboardEnvironment.module.css";

interface MotherboardEnvironmentProps {
  children: ReactNode;
}

/**
 * MotherboardEnvironment — coordinates the Silicon Foundry background environment.
 * Renders the R3F/2D Canvas layer, suppresses early NEXUS arrival lines, and triggers
 * them after the camera flight sequence reveals the city.
 */
export default function MotherboardEnvironment({
  children,
}: MotherboardEnvironmentProps) {
  const sayNexus = useUniverseStore((s) => s.sayNexus);
  const setNexusAnimState = useUniverseStore((s) => s.setNexusAnimState);
  const [arrivalComplete, setArrivalComplete] = useState(false);

  const handleArrivalComplete = () => {
    setArrivalComplete(true);
  };

  useEffect(() => {
    if (arrivalComplete) {
      // Direct timed dialogue sequence once camera reveals the motherboard city
      const timer = setTimeout(() => {
        if (sayNexus && setNexusAnimState) {
          sayNexus("We are no longer looking at the machine. We are inside it.");
          setNexusAnimState("SPEAKING");
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [arrivalComplete, sayNexus, setNexusAnimState]);

  return (
    <div className={styles.environmentWrapper}>
      {/* 3D R3F / 2D Canvas Motherboard backdrop layer */}
      <EnvironmentLayer onArrivalComplete={handleArrivalComplete} />

      {/* Grid overlay mask to darken edges and merge with void */}
      <div className={styles.ambientFog} />

      {/* Main website page content rendered in front */}
      <div
        className={`${styles.pageOverlay} ${
          arrivalComplete ? styles.visible : styles.hidden
        }`}
      >
        {children}
      </div>
    </div>
  );
}
