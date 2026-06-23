"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CircuitGrid from "@/components/universe/boot/CircuitGrid";
import PowerCore from "@/components/universe/boot/PowerCore";
import { quickDeviceTier, type DeviceTier } from "@/lib/deviceTier";
import { buildDiveTimeline, reducedMotionDive } from "@/lib/journey/cinematicCamera";
import styles from "./CinematicCamera.module.css";

/**
 * CODEX INFINITUM — Cinematic Camera (Phase 10.2)
 * Canon: CINEMATIC_LAYER_PLAN.md §1.3
 *
 * The "enter the machine" cinematic. Sits between ArchitectAvatar and
 * BootTerminal in JourneyDirector's first-visit sequence.
 *
 * User experience:
 *   1. "Idle" state:  Architect cue text + PowerCore button (same CircuitGrid backdrop)
 *   2. Power click:   Architect cue exits → Canvas burst fires → GSAP scales the
 *                     power zone FORWARD (camera rushing into the circuit board) →
 *                     white-hot flash fills the screen
 *   3. Flash peaks:   onDone() → JourneyDirector mounts BootTerminal (which arrives
 *                     by fading FROM white, making the flash a seamless bridge)
 *
 * Constraints honoured:
 *   - BootSequence.tsx, PowerCore.tsx, CircuitGrid.tsx — byte-for-byte untouched
 *   - No new WebGL context — Canvas2D only for the trace burst
 *   - Device-tier gated: tier-0 or reduced-motion → instant cut, no canvas
 *   - Mobile safe: scale transform uses will-change; canvas is position:fixed
 */

// ── Canvas trace burst ──────────────────────────────────────────────────────

/**
 * Draws one frame of the "PCB trace burst" — 20 lines radiating from center,
 * growing outward with a leading glow tip. Called inside a RAF loop.
 *
 * @param ctx    Canvas 2D context (sized to full viewport)
 * @param cx     Center X
 * @param cy     Center Y
 * @param t      Elapsed time in seconds (0 → 1.5 = full duration)
 * @param count  Number of trace lines (tier-scaled: 20 / 12)
 */
function drawTraceBurst(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  count: number
): void {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const maxLen = Math.hypot(W, H) * 0.55; // traces reach ~55% of viewport diagonal

  // Acceleration curve: slow start, then a fast surge at the end (t > 1.1s)
  // This mirrors the GSAP ease and makes the canvas + GSAP feel synchronised.
  const progress = t < 1.1
    ? Math.pow(t / 1.1, 1.8)          // eased growth phase
    : 1 + (t - 1.1) / 0.4 * 0.6;     // surge phase — extends beyond maxLen

  ctx.clearRect(0, 0, W, H);

  // Global alpha fades out in the final 300ms (handoff to the white flash)
  const alpha = t > 1.2 ? Math.max(0, 1 - (t - 1.2) / 0.3) : 1;
  ctx.globalAlpha = alpha;

  for (let i = 0; i < count; i++) {
    // Evenly spaced angles, with a slight offset per line for organic feel
    const baseAngle = (i / count) * Math.PI * 2;
    const angle = baseAngle + (i % 3 === 0 ? 0.08 : i % 3 === 1 ? -0.04 : 0);

    // Each line starts at a slightly different time (stagger)
    const delay = (i % 5) * 0.06;
    const localT = Math.max(0, t - delay);
    if (localT <= 0) continue;

    const lineLen = Math.min(maxLen * progress * (0.7 + (i % 4) * 0.1), maxLen * 1.8);
    const tipX = cx + Math.cos(angle) * lineLen;
    const tipY = cy + Math.sin(angle) * lineLen;

    // ── Main trace line ──────────────────────────────────────────
    // Alternates between amber (#F59E0B) and cyan (#00F5FF) for variety
    const isAmber = i % 3 !== 1;
    const traceColor = isAmber ? "251, 158, 11" : "0, 245, 255"; // RGB values

    ctx.shadowBlur = 0;
    ctx.lineWidth = isAmber ? 1.5 : 1;
    ctx.strokeStyle = `rgba(${traceColor}, 0.55)`;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    // ── PCB-style 90° branch (every 3rd line) ────────────────────
    if (i % 3 === 0 && lineLen > 80) {
      const branchStart = lineLen * 0.45;
      const bx = cx + Math.cos(angle) * branchStart;
      const by = cy + Math.sin(angle) * branchStart;
      const perpAngle = angle + Math.PI / 2;
      const branchLen = Math.min(lineLen * 0.3, 120);
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(${traceColor}, 0.35)`;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(
        bx + Math.cos(perpAngle) * branchLen,
        by + Math.sin(perpAngle) * branchLen
      );
      ctx.stroke();
    }

    // ── Leading glow tip ─────────────────────────────────────────
    if (lineLen > 20) {
      ctx.shadowBlur = 14;
      ctx.shadowColor = isAmber ? "#FBBF24" : "#00F5FF";
      ctx.fillStyle = isAmber ? "#FFF7E6" : "#E0FDFF";
      ctx.beginPath();
      ctx.arc(tipX, tipY, isAmber ? 2.5 : 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  ctx.globalAlpha = 1;
}

// ── Component ───────────────────────────────────────────────────────────────

type State = "idle" | "activated";

export default function CinematicCamera({
  reduced = false,
  onDone,
}: {
  reduced?: boolean;
  onDone: () => void;
}) {
  const [cueExiting, setCueExiting] = useState(false);
  const [circuitIgniting, setCircuitIgniting] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [tier, setTier] = useState<DeviceTier>(2);

  // DOM refs for GSAP
  const powerZoneRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const dimmerRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const lastClickRef = useRef<{ clientX: number; clientY: number } | null>(null);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const canvasActiveRef = useRef(false);

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // Detect device tier on mount
  useEffect(() => {
    setTier(quickDeviceTier());
  }, []);

  // Resize canvas to full viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Canvas RAF loop ─────────────────────────────────────────────
  // Only runs after power is pressed, only on tier >= 1 and not reduced
  const startCanvasBurst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced || tier === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvasActiveRef.current = true;
    const traceCount = tier === 2 ? 20 : 12;
    const BURST_DURATION = 1.5; // seconds

    const tick = (now: number) => {
      if (!canvasActiveRef.current) return;
      if (startTimeRef.current === null) startTimeRef.current = now;

      const t = (now - startTimeRef.current) / 1000;

      drawTraceBurst(ctx, canvas.width / 2, canvas.height / 2, t, traceCount);

      if (t < BURST_DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Burst complete — clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasActiveRef.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [reduced, tier]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      canvasActiveRef.current = false;
    };
  }, []);

  // ── Power button handler ────────────────────────────────────────
  const onPowerActivate = useCallback(
    (e?: { clientX: number; clientY: number }) => {
      if (state === "activated") return;
      setState("activated");

      // Position the anticipation-beat spark at the click location (falls back
      // to viewport center if no coordinates are available, e.g. keyboard activation).
      const spark = sparkRef.current;
      if (spark) {
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
      }

      // 1. Architect cue text exits
      setCueExiting(true);

      // 2. Circuit grid ignites
      setCircuitIgniting(true);

      // 3. Reduced-motion: hold the anticipation beat, then cut (no movement)
      if (reduced || tier === 0) {
        buildDiveTimeline({
          stage: powerZoneRef.current ?? document.createElement("div"),
          flash: flashRef.current ?? document.createElement("div"),
          dimmer: dimmerRef.current,
          spark: sparkRef.current,
          reduced: true,
          onComplete: () => reducedMotionDive(doneRef.current),
        });
        return;
      }

      // 4. Canvas burst fires
      startCanvasBurst();

      // 5. GSAP dive timeline (anticipation beat prepended)
      const pz = powerZoneRef.current;
      const fl = flashRef.current;
      if (!pz || !fl) {
        reducedMotionDive(doneRef.current);
        return;
      }

      buildDiveTimeline({
        stage: pz,
        flash: fl,
        dimmer: dimmerRef.current,
        spark: sparkRef.current,
        onComplete: doneRef.current,
      });
    },
    [state, reduced, tier, startCanvasBurst]
  );

  // Esc skips the whole cinematic
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setState("activated");
        doneRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Circuit grid backdrop — same as BootSequence's */}
      <CircuitGrid igniting={circuitIgniting} />

      {/* Full-screen trace-burst canvas (behind the power zone) */}
      <canvas
        ref={canvasRef}
        className={`${styles.canvas}${state === "activated" ? ` ${styles.active}` : ""}`}
        aria-hidden="true"
      />

      <section
        className={styles.stage}
        aria-label="Prepare to enter the computer"
      >
        <p className="sr-only" aria-live="polite">
          Ready to enter the computer? Press the power button to begin.
        </p>

        {/* ── Architect cue ── */}
        <div className={`${styles.cue}${cueExiting ? ` ${styles.exiting}` : ""}`}>
          <span className={styles.cueLabel}>ARCHITECT</span>
          <p className={styles.cueLine}>Ready?</p>
          <p className={styles.cueLine}>Let&#39;s go inside.</p>
        </div>

        {/* ── Power button — reused from boot/, unmodified ── */}
        <div
          ref={powerZoneRef}
          className={styles.powerZone}
          onClickCapture={(e) => {
            // Capture click coordinates for the anticipation-beat spark before
            // PowerCore's own onActivate (no args) fires onPowerActivate().
            lastClickRef.current = { clientX: e.clientX, clientY: e.clientY };
          }}
        >
          <PowerCore reduced={reduced} onActivate={() => onPowerActivate(lastClickRef.current ?? undefined)} />
        </div>
      </section>

      {/* Anticipation-beat dimmer — near-black overlay held briefly before the burst */}
      <div ref={dimmerRef} className={styles.dimmer} aria-hidden="true" />

      {/* Anticipation-beat spark — single point of light at the click location */}
      <div ref={sparkRef} className={styles.spark} aria-hidden="true" />

      {/* White-flash overlay — sits above everything, GSAP drives it to opacity 1 */}
      <div ref={flashRef} className={styles.flash} aria-hidden="true" />
    </>
  );
}
