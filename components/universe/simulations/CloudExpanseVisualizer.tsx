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

export default function CloudExpanseVisualizer({
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
        case "incoming":
          drawIncoming(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "scale":
          drawScale(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "metrics":
          drawMetrics(ctx, w, h, t, color, colorSecondary, animate);
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

// ── Step 1: INCOMING REQUEST (Load balancer proxy router) ──
function drawIncoming(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const lbX = w * 0.15, lbY = h * 0.5;
  const srvX = w * 0.7;
  const srvY = [h * 0.25, h * 0.5, h * 0.75];

  // Load Balancer node
  ctx.fillStyle = colorMix(color, 0.15);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(lbX, lbY, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 9px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("LOAD", lbX, lbY - 2);
  ctx.fillText("BALANCER", lbX, lbY + 8);

  // Target Server instances
  srvY.forEach((sy, i) => {
    const isDown = i === 2;
    ctx.fillStyle = colorMix(isDown ? "#ef4444" : secondary, 0.12);
    ctx.strokeStyle = isDown ? "#ef4444" : secondary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(srvX - 35, sy - 15, 70, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 8.5px var(--font-mono, monospace)";
    ctx.fillText(`Server ${i+1}`, srvX, sy - 2);
    ctx.fillStyle = isDown ? "#ef4444" : "#22c55e";
    ctx.font = "700 7px var(--font-mono, monospace)";
    ctx.fillText(isDown ? "DOWN" : "ONLINE", srvX, sy + 8);

    // connections
    ctx.strokeStyle = isDown ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lbX + 22, lbY);
    ctx.lineTo(srvX - 35, sy);
    ctx.stroke();
  });

  if (animate) {
    const cycle = 1.8;
    const progress = (t % cycle) / cycle;

    // Route only to online target servers (Server 1 or Server 2)
    const targetIdx = progress < 0.5 ? 0 : 1;
    const targetY = srvY[targetIdx];
    const tx = lerp(lbX + 22, srvX - 35, (progress % 0.5) / 0.5);
    const ty = lerp(lbY, targetY, (progress % 0.5) / 0.5);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(tx, ty, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Step 2: AUTO SCALING (Provisioning containers under CPU pressure) ──
function drawScale(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const leftX = w * 0.15, rightX = w * 0.65;
  const boxW = w * 0.22, boxH = h * 0.5;

  // CPU Alert state
  ctx.fillStyle = colorMix("#ef4444", 0.15);
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(leftX, h * 0.25, boxW, boxH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 8.5px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("CPU OVERLOAD", leftX + boxW / 2, h * 0.25 - 8);
  ctx.fillStyle = "#ef4444";
  ctx.font = "700 11px var(--font-mono, monospace)";
  ctx.fillText("92% LOAD", leftX + boxW / 2, h * 0.5 + 4);

  // Autoscaled Server Nodes Group
  ctx.fillStyle = colorMix(color, 0.15);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.rect(rightX, h * 0.25, boxW, boxH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 8.5px var(--font-mono, monospace)";
  ctx.fillText("AUTOSCALING", rightX + boxW / 2, h * 0.25 - 8);

  const spawnCount = animate ? Math.min(4, Math.floor(t * 1.5) % 5 + 1) : 4;
  for (let i = 0; i < spawnCount; i++) {
    const rx = rightX + 8 + (i % 2) * (boxW / 2 - 6);
    const ry = h * 0.25 + 8 + Math.floor(i / 2) * 24;

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(rx, ry, boxW / 2 - 10, 16);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 7px var(--font-mono, monospace)";
    ctx.fillText(`POD ${i+1}`, rx + (boxW / 2 - 10) / 2, ry + 10);
  }

  // scale link
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(leftX + boxW, h * 0.5);
  ctx.lineTo(rightX, h * 0.5);
  ctx.stroke();

  if (animate) {
    // scale trigger pulse
    const progress = (t * 0.8) % 1.0;
    const tx = lerp(leftX + boxW, rightX, progress);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(tx, h * 0.5, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Step 3: LOG TELEMETRY (Latency profiling) ──
function drawMetrics(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.15, cy = h * 0.22, boxW = w * 0.7, boxH = h * 0.55;

  // Monitor panel
  ctx.fillStyle = "#0c0a09";
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(cx, cy, boxW, boxH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "600 8.5px var(--font-mono, monospace)";
  ctx.textAlign = "left";
  ctx.fillText("PROMETHEUS TELEMETRY", cx + 8, cy + 12);

  // Telemetry metrics readout
  const latency = animate ? 12 + Math.floor(Math.sin(t * 4) * 3) : 14;
  ctx.fillStyle = "#38BDF8";
  ctx.font = "700 11px var(--font-mono, monospace)";
  ctx.fillText(`CLUSTER HEALTH: OK`, cx + 12, cy + 32);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`AVG LATENCY: ${latency}ms`, cx + 12, cy + 52);
  ctx.fillStyle = "#22c55e";
  ctx.fillText(`HTTP STATUS 200: 99.99%`, cx + 12, cy + 72);
}
