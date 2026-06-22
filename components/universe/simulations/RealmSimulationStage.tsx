import { useEffect, useRef, useState } from "react";
import { useUniverseStore } from "@/store/universeStore";
import { REALM_BY_SLUG } from "@/lib/realms";
import {
  quickDeviceTier,
  prefersReducedMotion as detectReduced,
  type DeviceTier,
} from "@/lib/deviceTier";
import { getRealmKnowledge } from "@/lib/environments/registry";
import SignalVisualizer from "./SignalVisualizer";
import SimulationControls from "./SimulationControls";
import styles from "./RealmSimulationStage.module.css";

const STEP_DURATION_MS = 4200;

/**
 * The living simulation layer (EXPERIENCE_TRANSFORMATION_PLAN.md §1/§2).
 * Renders nothing if the realm has no registered simulation — realms without
 * an entry in lib/simulations/registry.ts are untouched by this phase.
 * Text is secondary here: this stage IS the primary experience; RealmDistrict
 * below it becomes "details if you want them."
 */
export default function RealmSimulationStage({ slug }: { slug: string }) {
  const definition = getRealmKnowledge(slug);
  const realm = REALM_BY_SLUG[slug];

  const [mounted, setMounted] = useState(false);
  const [tier, setTier] = useState<DeviceTier>(2);
  const [reduced, setReduced] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const sayNexus = useUniverseStore((s) => s.sayNexus);
  const setNexusAnimState = useUniverseStore((s) => s.setNexusAnimState);
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);

  const autoplayTimer = useRef<number | null>(null);

  useEffect(() => {
    const r = detectReduced();
    setReduced(r);
    setTier(quickDeviceTier());
    setPlaying(!r);
    setMounted(true);
  }, []);

  // Autoplay: advance through the signal journey unless paused or reduced-motion.
  useEffect(() => {
    if (!mounted || !definition || !playing || reduced) return;
    autoplayTimer.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % definition.steps.length);
    }, STEP_DURATION_MS);
    return () => {
      if (autoplayTimer.current) window.clearInterval(autoplayTimer.current);
    };
  }, [mounted, playing, reduced, definition]);

  // NEXUS narrates the active step through the real companion (no second voice).
  useEffect(() => {
    if (!mounted || !definition) return;
    const step = definition.steps[activeIndex];
    sayNexus(step.nexusLine);
    setNexusAnimState("SPEAKING");
    if (step.activeLandmarkId) {
      selectLandmark(step.activeLandmarkId);
    } else {
      selectLandmark(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, activeIndex, definition]);

  if (!definition || !realm) return null;
  if (!mounted) return <div className={styles.stage} aria-hidden="true" />;

  const step = definition.steps[activeIndex];
  const animate = tier > 0 && !reduced;

  const goToStep = (index: number) => {
    setPlaying(false);
    setActiveIndex(((index % definition.steps.length) + definition.steps.length) % definition.steps.length);
  };

  return (
    <section className={styles.stage} aria-label={`${realm.name} — live simulation`}>
      <p className={styles.kicker}>{definition.title}</p>

      <SignalVisualizer
        slug={slug}
        stepId={step.id}
        animate={animate}
        tier={tier}
        color={realm.colors.primary}
        colorSecondary={realm.colors.secondary}
      />

      <p className={styles.stepLabel}>{step.label}</p>
      <p className={styles.caption}>{step.caption}</p>

      <SimulationControls
        steps={definition.steps}
        activeIndex={activeIndex}
        playing={playing}
        canAutoplay={!reduced}
        onSelect={goToStep}
        onStep={(delta) => goToStep(activeIndex + delta)}
        onTogglePlay={() => setPlaying((p) => !p)}
      />

      {!animate && (
        <p className={styles.staticNote}>
          Motion is paused for this device/setting — step through the stages manually above.
        </p>
      )}
    </section>
  );
}
