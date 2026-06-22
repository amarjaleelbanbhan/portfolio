"use client";

import { useEffect, useRef } from "react";
import type { DeviceTier } from "@/lib/deviceTier";
import { startTickEngine } from "@/lib/simulations/engine";

interface VisualizerProps {
  stepId: string;
  animate: boolean;
  tier: DeviceTier;
  color: string;
  colorSecondary: string;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function colorMix(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CyberCitadelVisualizer({
  stepId,
  animate,
  tier,
  color,
  colorSecondary,
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx?.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (elapsedMs: number) => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;
      const t = elapsedMs / 1000;
      ctx.clearRect(0, 0, w, h);

      switch (stepId) {
        case "scan":
          drawScan(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "auth":
          drawAuth(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "encrypt":
          drawEncrypt(ctx, w, h, t, color, colorSecondary, animate);
          break;
      }
    };

    if (!animate) {
      draw(0);
      return;
    }

    const engine = startTickEngine(({ elapsed }) => draw(elapsed), tier);
    return () => engine.stop();
  }, [stepId, animate, tier, color, colorSecondary]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "260px", background: "#050508", display: "block" }}
      aria-hidden="true"
    />
  );
}

// ── Step 1: THREAT SCAN (WAF exploit input scanner) ──
function drawScan(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.15, cy = h * 0.22, boxW = w * 0.7, boxH = h * 0.55;

  // Packet payload panel
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(cx, cy, boxW, boxH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "600 8.5px var(--font-mono, monospace)";
  ctx.textAlign = "left";
  ctx.fillText("INCOMING PAYLOAD BUFFER", cx + 8, cy + 12);

  // Payload text details
  const fields = [
    { label: "USERID:", val: "amar101" },
    { label: "INPUT:", val: "' OR 1=1; --" }
  ];

  fields.forEach((field, i) => {
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 10px var(--font-mono, monospace)";
    ctx.fillText(`${field.label} ${field.val}`, cx + 12, cy + 34 + i * 20);
  });

  // Sweeping scan laser line
  const laserY = cy + 18 + ((animate ? (t * 50) % (boxH - 24) : boxH / 2));
  ctx.strokeStyle = "#EF4444";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 4, laserY);
  ctx.lineTo(cx + boxW - 4, laserY);
  ctx.stroke();

  ctx.fillStyle = "#EF4444";
  ctx.font = "700 9px var(--font-mono, monospace)";
  ctx.fillText("⚠ EXPLOIT INJECTION DETECTED: BLOCKED", cx + 12, cy + 82);
}

// ── Step 2: IDENTITY AUTH (JWT cryptographic validator) ──
function drawAuth(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.1, cy = h * 0.22, boxW = w * 0.8, boxH = h * 0.55;

  // JWT envelope card
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(cx, cy, boxW, boxH);
  ctx.fill();
  ctx.stroke();

  // JWT components
  ctx.fillStyle = "#EF4444";
  ctx.font = "700 8px var(--font-mono, monospace)";
  ctx.textAlign = "left";
  ctx.fillText("HEADER: { alg: RS256 }", cx + 12, cy + 16);

  ctx.fillStyle = "#8B5CF6";
  ctx.fillText("PAYLOAD: { user: Amar, role: product-engineer }", cx + 12, cy + 34);

  ctx.fillStyle = "#22C55E";
  ctx.fillText("SIGNATURE: CryptVerify( SHA256(Header.Payload) )", cx + 12, cy + 52);

  // Status check
  if (animate) {
    const active = Math.floor(t * 2) % 2 === 0;
    ctx.fillStyle = active ? "#22C55E" : "rgba(255, 255, 255, 0.2)";
    ctx.font = "700 12px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText("VERIFY: AUTHENTICATED ACCESS GRANTED", w / 2, cy + 78);
  } else {
    ctx.fillStyle = "#22C55E";
    ctx.font = "700 12px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText("VERIFIED", w / 2, cy + 78);
  }
}

// ── Step 3: CRYPT ENGINE (Plaintext to Ciphertext encryption blocks) ──
function drawEncrypt(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const leftX = w * 0.12, rightX = w * 0.65;
  const boxW = w * 0.22, boxH = h * 0.5;

  // Plaintext data
  ctx.fillStyle = colorMix(secondary, 0.15);
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(leftX, h * 0.25, boxW, boxH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 8.5px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("PLAIN TEXT", leftX + boxW / 2, h * 0.25 - 8);
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText("SECRET DATA", leftX + boxW / 2, h * 0.5);

  // Ciphertext data
  ctx.fillStyle = colorMix(color, 0.15);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.rect(rightX, h * 0.25, boxW, boxH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText("CIPHER TEXT", rightX + boxW / 2, h * 0.25 - 8);
  ctx.fillStyle = color;
  ctx.fillText("U2FsdGVk...", rightX + boxW / 2, h * 0.5);

  // Crypt core in center
  const coreW = w * 0.18, coreH = h * 0.3;
  const coreX = w * 0.5 - coreW / 2, coreY = h * 0.5 - coreH / 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.rect(coreX, coreY, coreW, coreH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 7px var(--font-mono, monospace)";
  ctx.fillText("AES ENGINE", coreX + coreW / 2, coreY + coreH / 2);

  if (animate) {
    // Pulse traveling left -> core -> right
    const progress = (t * 0.7) % 1.0;
    const tx = lerp(leftX + boxW, rightX, progress);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(tx, h * 0.5, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
