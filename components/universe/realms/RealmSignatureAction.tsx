"use client";

import { useRef, useState } from "react";
import { useUniverseStore } from "@/store/universeStore";
import styles from "./RealmSignatureAction.module.css";

/**
 * Three signature, hand-built interactions (Phase 1.1 audit fix #4) — one
 * each for Network Pathways, Code Helix, and the Citadel. Self-contained:
 * no new 3D primitives, just small CSS/SVG animations that fire a NEXUS
 * reaction event when complete. Every other realm is untouched.
 */
export default function RealmSignatureAction({ slug }: { slug: string }) {
  if (slug === "network-pathways") return <NetworkPacketAction />;
  if (slug === "code-helix") return <CodeHelixAction />;
  if (slug === "the-citadel") return <CitadelDefendAction />;
  return null;
}

// ── Network Pathways: SEND PACKET ───────────────────────────────────────────
function NetworkPacketAction() {
  const fireNexusEvent = useUniverseStore((s) => s.fireNexusEvent);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const send = () => {
    if (sending) return;
    setSending(true);
    setStatus("Routing packet through the pathway…");
    window.setTimeout(() => {
      setSending(false);
      setStatus("Packet delivered.");
      fireNexusEvent("packetSent");
    }, 1100);
  };

  return (
    <div className={styles.wrap} data-testid="network-packet-action">
      <p className={styles.kicker}>Signature Interaction</p>
      <button type="button" className={styles.action} onClick={send} disabled={sending}>
        {sending ? "Sending…" : "Send Packet"}
      </button>
      <div className={styles.stage}>
        <svg className={styles.path} viewBox="0 0 400 64" preserveAspectRatio="none">
          <path id="net-path" className={styles.pathLine} d="M 10 32 C 130 4, 270 60, 390 32" />
          {sending && (
            <circle r="6" className={styles.packet} fill="var(--realm-primary, #00F5FF)">
              <animateMotion dur="1s" repeatCount="1" path="M 10 32 C 130 4, 270 60, 390 32" />
            </circle>
          )}
        </svg>
      </div>
      <p className={styles.status} aria-live="polite">{status}</p>
    </div>
  );
}

// ── Code Helix: CREATE CODE ─────────────────────────────────────────────────
const CODE_SAMPLES = [
  "function listen(signal) { return signal.respond(); }",
  "const intent = parse(human.words);",
  "while (alive) { learn(world); }",
];

function CodeHelixAction() {
  const fireNexusEvent = useUniverseStore((s) => s.fireNexusEvent);
  const [creating, setCreating] = useState(false);
  const [line, setLine] = useState<string | null>(null);
  const [rungKey, setRungKey] = useState(0);
  const countRef = useRef(0);

  const create = () => {
    if (creating) return;
    setCreating(true);
    const sample = CODE_SAMPLES[countRef.current % CODE_SAMPLES.length];
    countRef.current += 1;
    setLine(sample);
    setRungKey((k) => k + 1);
    window.setTimeout(() => {
      setCreating(false);
      fireNexusEvent("codeCreated");
    }, 1400);
  };

  return (
    <div className={styles.wrap} data-testid="code-helix-action">
      <p className={styles.kicker}>Signature Interaction</p>
      <button type="button" className={styles.action} onClick={create} disabled={creating}>
        {creating ? "Compiling…" : "Create Code"}
      </button>
      <div className={styles.stage}>
        {line && <p key={rungKey} className={styles.codeLine}>{line}</p>}
        {creating && <span key={`rung-${rungKey}`} className={styles.rung} aria-hidden="true" />}
      </div>
    </div>
  );
}

// ── Cyber Citadel: DEFEND ───────────────────────────────────────────────────
function CitadelDefendAction() {
  const fireNexusEvent = useUniverseStore((s) => s.fireNexusEvent);
  const [phase, setPhase] = useState<"idle" | "incoming" | "blocked" | "hit">("idle");
  const windowOpenRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  const startAttack = () => {
    if (phase === "incoming") return;
    clearTimers();
    setPhase("incoming");
    windowOpenRef.current = false;

    // The block window opens partway through the pulse travel (≈ last 400ms).
    timersRef.current.push(
      window.setTimeout(() => {
        windowOpenRef.current = true;
      }, 500)
    );
    // If never blocked, the pulse "hits".
    timersRef.current.push(
      window.setTimeout(() => {
        if (windowOpenRef.current) {
          setPhase("hit");
          windowOpenRef.current = false;
        }
      }, 900)
    );
  };

  const onDefend = () => {
    if (phase !== "incoming") {
      startAttack();
      return;
    }
    if (windowOpenRef.current) {
      windowOpenRef.current = false;
      clearTimers();
      setPhase("blocked");
      fireNexusEvent("shieldBlocked");
    }
  };

  return (
    <div className={styles.wrap} data-testid="citadel-defend-action">
      <p className={styles.kicker}>Signature Interaction</p>
      <button type="button" className={styles.action} onClick={onDefend}>
        {phase === "incoming" ? "Defend!" : "Defend"}
      </button>
      <div className={`${styles.stage} ${styles.citadelStage}`}>
        {phase === "incoming" && <span className={styles.pulse} aria-hidden="true" />}
        <span
          className={`${styles.shield}${phase === "blocked" ? ` ${styles.blocked}` : ""}${phase === "hit" ? ` ${styles.hit}` : ""}`}
        >
          SHLD
        </span>
      </div>
      <p className={styles.status} aria-live="polite">
        {phase === "incoming" && "Attack incoming — click Defend again to intercept."}
        {phase === "blocked" && "Intercepted. The decision held."}
        {phase === "hit" && "Too slow — the packet got through. Try again."}
      </p>
    </div>
  );
}
