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

export default function NeuralNebulaVisualizer({
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
        case "ingest":
          drawIngest(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "forward":
          drawForward(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "optimize":
          drawOptimize(ctx, w, h, t, color, colorSecondary, animate);
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

// ── Step 1: INGEST DATA (Dataset inputs) ──
function drawIngest(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.15, cy = h * 0.22, boxW = w * 0.7, boxH = h * 0.55;

  // Ingest boundary
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
  ctx.fillText("DATASET MINI-BATCH TENSOR LOAD", cx + 8, cy + 12);

  // Ingest stream rows
  const batch = [
    "Row 1: [ x0: 0.85, x1: 0.12, x2: 0.44 ] -> label: 1.00",
    "Row 2: [ x0: 0.22, x1: 0.95, x2: 0.08 ] -> label: 0.00"
  ];

  ctx.font = "600 9px var(--font-mono, monospace)";
  batch.forEach((row, i) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillText(row, cx + 12, cy + 32 + i * 20);
  });

  if (animate) {
    const pulseX = cx + 8 + ((t * 80) % (boxW - 16));
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.arc(pulseX, cy + boxH - 12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "500 7px var(--font-mono, monospace)";
    ctx.fillText("INGESTING...", cx + 8, cy + boxH - 10);
  }
}

// ── Step 2: FORWARD PASS (Layers dot products) ──
function drawForward(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const leftX = w * 0.2, rightX = w * 0.8, midX = w * 0.5;
  const inY = [h * 0.3, h * 0.5, h * 0.7];
  const hidY = [h * 0.2, h * 0.4, h * 0.6, h * 0.8];
  const outY = [h * 0.4, h * 0.6];

  // Draw synapses lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  inY.forEach((iy) => hidY.forEach((hy) => {
    ctx.moveTo(leftX, iy); ctx.lineTo(midX, hy);
  }));
  hidY.forEach((hy) => outY.forEach((oy) => {
    ctx.moveTo(midX, hy); ctx.lineTo(rightX, oy);
  }));
  ctx.stroke();

  // Draw input nodes
  inY.forEach((y) => {
    ctx.fillStyle = colorMix(color, 0.15);
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.arc(leftX, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  });

  // Draw hidden nodes
  hidY.forEach((y) => {
    ctx.fillStyle = colorMix(secondary, 0.15);
    ctx.strokeStyle = secondary;
    ctx.beginPath(); ctx.arc(midX, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  });

  // Draw output nodes
  outY.forEach((y) => {
    ctx.fillStyle = colorMix(color, 0.15);
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.arc(rightX, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  });

  if (animate) {
    const cycle = 1.6;
    const progress = (t % cycle) / cycle;

    // Pulse traveling forward
    let px = leftX, py = inY[1];
    if (progress < 0.5) {
      const lp = progress / 0.5;
      px = lerp(leftX, midX, lp);
      py = lerp(inY[1], hidY[2], lp);
    } else {
      const lp = (progress - 0.5) / 0.5;
      px = lerp(midX, rightX, lp);
      py = lerp(hidY[2], outY[0], lp);
    }

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = "600 8px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText("FORWARD PASS DOT PRODUCTS: Y = ReLU(W*X + B)", w / 2, h * 0.92);
  }
}

// ── Step 3: BACKPROPAGATE (Optimization updates) ──
function drawOptimize(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const leftX = w * 0.2, rightX = w * 0.8, midX = w * 0.5;
  const inY = [h * 0.3, h * 0.5, h * 0.7];
  const hidY = [h * 0.2, h * 0.4, h * 0.6, h * 0.8];
  const outY = [h * 0.4, h * 0.6];

  // Draw connections
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  inY.forEach((iy) => hidY.forEach((hy) => {
    ctx.moveTo(leftX, iy); ctx.lineTo(midX, hy);
  }));
  hidY.forEach((hy) => outY.forEach((oy) => {
    ctx.moveTo(midX, hy); ctx.lineTo(rightX, oy);
  }));
  ctx.stroke();

  // Draw nodes
  inY.forEach((y) => {
    ctx.fillStyle = colorMix(color, 0.15);
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.arc(leftX, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  });
  hidY.forEach((y) => {
    ctx.fillStyle = colorMix(secondary, 0.15);
    ctx.strokeStyle = secondary;
    ctx.beginPath(); ctx.arc(midX, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  });
  outY.forEach((y) => {
    ctx.fillStyle = colorMix(color, 0.15);
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.arc(rightX, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  });

  if (animate) {
    const cycle = 1.6;
    const progress = (t % cycle) / cycle;

    // Pulse traveling BACKWARD (right to left)
    let px = rightX, py = outY[0];
    if (progress < 0.5) {
      const lp = progress / 0.5;
      px = lerp(rightX, midX, lp);
      py = lerp(outY[0], hidY[2], lp);
    } else {
      const lp = (progress - 0.5) / 0.5;
      px = lerp(midX, leftX, lp);
      py = lerp(hidY[2], inY[1], lp);
    }

    ctx.fillStyle = "#8B5CF6";
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8B5CF6";
    ctx.font = "600 8px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText("BACKWARD ERROR GRADIENTS UPDATING WEIGHT MATRICES", w / 2, h * 0.92);
  }
}
