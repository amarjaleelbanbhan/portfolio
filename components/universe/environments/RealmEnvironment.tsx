"use client";

import { type ReactNode, useState, useEffect } from "react";
import { useUniverseStore } from "@/store/universeStore";
import { getRealmKnowledge } from "@/lib/environments/registry";
import EnvironmentLayer from "./EnvironmentLayer";
import styles from "./MotherboardEnvironment.module.css";

interface RealmEnvironmentProps {
  slug: string;
  children: ReactNode;
}

/**
 * RealmEnvironment — coordinates dynamic realm backgrounds.
 * Instantiates the EnvironmentLayer with the appropriate slug,
 * triggers NEXUS's welcome dialogue once the entrance flight completes,
 * and overlays the HTML controls.
 */
export default function RealmEnvironment({
  slug,
  children,
}: RealmEnvironmentProps) {
  const sayNexus = useUniverseStore((s) => s.sayNexus);
  const setNexusAnimState = useUniverseStore((s) => s.setNexusAnimState);
  const [arrivalComplete, setArrivalComplete] = useState(false);

  const handleArrivalComplete = () => {
    setArrivalComplete(true);
  };

  useEffect(() => {
    setArrivalComplete(false);
  }, [slug]);

  useEffect(() => {
    if (arrivalComplete) {
      const knowledge = getRealmKnowledge(slug);
      if (knowledge && sayNexus && setNexusAnimState) {
        const timer = setTimeout(() => {
          sayNexus(knowledge.welcomeSpeech);
          setNexusAnimState("SPEAKING");
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [arrivalComplete, slug, sayNexus, setNexusAnimState]);

  return (
    <div className={styles.environmentWrapper}>
      {/* Dynamic 3D/2D background layer */}
      <EnvironmentLayer slug={slug} onArrivalComplete={handleArrivalComplete} />

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
