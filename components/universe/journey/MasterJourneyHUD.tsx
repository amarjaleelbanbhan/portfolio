"use client";

import { useEffect, useState, useRef } from "react";
import { useUniverseStore, type MasterJourneyPhase } from "@/store/universeStore";
import styles from "./MasterJourneyHUD.module.css";

interface JourneyStep {
  phase: MasterJourneyPhase;
  realmSlug: string;
  name: string;
  tagline: string;
  description: string;
  nexusLine: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    phase: "code-creation",
    realmSlug: "code-helix",
    name: "Code Helix",
    tagline: "1. Human Intent",
    description: "Your idea becomes code. We compile it into abstract syntax tokens, ready for the operating system.",
    nexusLine: "We begin at the Code Helix. Human intent crystallizes into instructions. I am compiling your request, preparing it for the system layer.",
  },
  {
    phase: "kernel-scheduler",
    realmSlug: "the-kernel",
    name: "The Kernel",
    tagline: "2. OS Control",
    description: "The OS registers the process, maps virtual address blocks, and schedules physical CPU cycles.",
    nexusLine: "Entering the Kernel—the control room. Here, your process is scheduled and allocated memory pages.",
  },
  {
    phase: "silicon-execution",
    realmSlug: "silicon-foundry",
    name: "Silicon Foundry",
    tagline: "3. Hardware Execution",
    description: "Electricity pulses across motherboard trace highways. The CPU tower decodes and executes calculations.",
    nexusLine: "Deep inside the physical motherboard. Traces carry your execution command directly to the registers of the CPU tower.",
  },
  {
    phase: "database-lookup",
    realmSlug: "data-archives",
    name: "Data Archives",
    tagline: "4. Storage & Indexing",
    description: "The result is stored. The query optimizer parses inputs and utilizes indexed towers for ACID-guaranteed commits.",
    nexusLine: "Next, to the Data Archives. We store transaction logs and search indexes under ACID guarantees.",
  },
  {
    phase: "network-hop",
    realmSlug: "network-pathways",
    name: "Network Pathways",
    tagline: "5. Internet Transit",
    description: "The data fragments into packets. TCP/IP headers append, routing across gateways and firewall inspects.",
    nexusLine: "Now, your data becomes a packet. We wrap it in TCP/IP envelopes and route it across global pathway links.",
  },
  {
    phase: "citadel-check",
    realmSlug: "the-citadel",
    name: "Cyber Citadel",
    tagline: "6. Security Citadel",
    description: "Firewalls, auth systems, and decrypters scan payload buffers to defend against exploits.",
    nexusLine: "Arriving at the Cyber Citadel. The security layer filters traffic, decrypts payloads, and verifies identity.",
  },
  {
    phase: "cloud-deployment",
    realmSlug: "cloud-expanse",
    name: "Cloud Expanse",
    tagline: "7. Cloud Scaling",
    description: "Request flows scale across gateways, load balancers, container fleets, and distributed server nodes.",
    nexusLine: "Welcome to the Cloud Expanse. Computation scales dynamically across redundant container fleets and gateways.",
  },
  {
    phase: "neural-inference",
    realmSlug: "neural-nebula",
    name: "Neural Nebula",
    tagline: "8. AI Inference",
    description: "Deep learning nodes process parameters across weighted layer networks to predict outcomes.",
    nexusLine: "Finally, the Neural Nebula. An AI inference engine processes parameters to optimize future flows.",
  },
];

const STAGE_DURATION_MS = 12000; // 12 seconds per world

export default function MasterJourneyHUD() {
  const activePhase = useUniverseStore((s) => s.activeMasterJourneyPhase);
  const setMasterJourneyPhase = useUniverseStore((s) => s.setMasterJourneyPhase);
  const enterRealm = useUniverseStore((s) => s.enterRealm);
  const exitRealm = useUniverseStore((s) => s.exitRealm);
  const sayNexus = useUniverseStore((s) => s.sayNexus);
  const setNexusAnimState = useUniverseStore((s) => s.setNexusAnimState);
  const setNexusVisible = useUniverseStore((s) => s.setNexusVisible);

  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(STAGE_DURATION_MS);
  const [showCongrats, setShowCongrats] = useState(false);

  const activeIndex = JOURNEY_STEPS.findIndex((s) => s.phase === activePhase);
  const timerRef = useRef<number | null>(null);

  // If not in master journey, return nothing
  if (!activePhase && !showCongrats) return null;

  const currentStep = JOURNEY_STEPS[activeIndex] || JOURNEY_STEPS[0];

  // 1. Sync current realm and trigger NEXUS dialogue on phase change
  useEffect(() => {
    if (!activePhase) return;
    const step = JOURNEY_STEPS.find((s) => s.phase === activePhase);
    if (step) {
      enterRealm(step.realmSlug);
      // Let NEXUS speak the custom journey line
      sayNexus(step.nexusLine);
      setNexusAnimState("SPEAKING");
      setNexusVisible(true);
      setTimeLeft(STAGE_DURATION_MS);
    }
  }, [activePhase, enterRealm, sayNexus, setNexusAnimState, setNexusVisible]);

  // 2. Autoplay Countdown Ticker
  useEffect(() => {
    if (!activePhase || !isPlaying) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          // Timer finished, auto-advance
          handleNext();
          return STAGE_DURATION_MS;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhase, isPlaying, activeIndex]);

  const handleNext = () => {
    if (activeIndex < JOURNEY_STEPS.length - 1) {
      const nextStep = JOURNEY_STEPS[activeIndex + 1];
      setMasterJourneyPhase(nextStep.phase);
    } else {
      // Completed last stage
      setIsPlaying(false);
      setShowCongrats(true);
      setMasterJourneyPhase(null);
      // NEXUS speaks congratulations
      sayNexus("Congratulations. You have traced the full life cycle of data in modern systems. You now understand the machine from the copper traces to the intelligence of the cloud.");
      setNexusAnimState("EXCITED");
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const prevStep = JOURNEY_STEPS[activeIndex - 1];
      setMasterJourneyPhase(prevStep.phase);
    }
  };

  const handleExit = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setMasterJourneyPhase(null);
    setShowCongrats(false);
    exitRealm();
    sayNexus(null);
    setNexusAnimState("IDLE");
  };

  const handleReplay = () => {
    setShowCongrats(false);
    setMasterJourneyPhase(JOURNEY_STEPS[0].phase);
    setIsPlaying(true);
  };

  // Calculate percentage of progress
  const progressPercent = ((activeIndex + 1) / JOURNEY_STEPS.length) * 100;
  const timerPercent = (timeLeft / STAGE_DURATION_MS) * 100;

  if (showCongrats) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.trophy}>🏆</div>
          <div className={styles.congratsKicker}>SYSTEM SYNCHRONIZED</div>
          <h2 className={styles.congratsTitle}>Master Journey Complete</h2>
          <p className={styles.congratsMessage}>
            Magnificent. You have followed the complete lifecycle of data inside modern computer systems. 
            From developer intent (Code) to kernel scheduler memory mapping, physical motherboard instruction processing, 
            ACID transaction vaults, internet packet routing, firewall defenses, cloud scale expansions, 
            and deep learning neural processing.
          </p>
          <div className={styles.modalButtons}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleReplay}
            >
              ↻ Replay Journey
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={handleExit}
            >
              Return to Universe Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.hud} style={{ "--rp": currentStep.realmSlug === "silicon-foundry" ? "#FBBF24" : undefined } as React.CSSProperties}>
      {/* Visual countdown progress line */}
      {isPlaying && (
        <div 
          className={styles.timerBar} 
          style={{ width: `${timerPercent}%` }} 
        />
      )}

      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <p className={styles.kicker}>{currentStep.tagline}</p>
          <h3 className={styles.currentName}>{currentStep.name}</h3>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.btn}
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous realm"
          >
            ◀ PREV
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={handleNext}
            aria-label="Next realm"
          >
            {activeIndex === JOURNEY_STEPS.length - 1 ? "FINISH 🏁" : "NEXT ▶"}
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={handleExit}
            aria-label="Exit Master Journey"
          >
            ✕ EXIT
          </button>
        </div>
      </div>

      {/* Progress pipeline */}
      <div className={styles.pipeline}>
        <div className={styles.pipelineLine} />
        <div 
          className={styles.pipelineProgress} 
          style={{ width: `calc(${progressPercent}% - 24px)` }} 
        />
        {JOURNEY_STEPS.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isCompleted = idx < activeIndex;
          return (
            <div
              key={step.phase}
              className={`${styles.node} ${isActive ? styles.nodeActive : ""} ${isCompleted ? styles.nodeCompleted : ""}`}
              onClick={() => setMasterJourneyPhase(step.phase)}
              style={{ "--rp": step.realmSlug === "silicon-foundry" ? "#FBBF24" : undefined } as React.CSSProperties}
            >
              <div className={styles.dot} />
              <span className={styles.nodeLabel}>{step.name}</span>
            </div>
          );
        })}
      </div>

      <p className={styles.desc}>{currentStep.description}</p>
    </div>
  );
}
