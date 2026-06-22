import { useEffect, useRef } from "react";
import type { DeviceTier } from "@/lib/deviceTier";
import { particleBudget } from "@/lib/deviceTier";
import { startTickEngine } from "@/lib/simulations/engine";
import NetworkPathwaysVisualizer from "./NetworkPathwaysVisualizer";
import TheKernelVisualizer from "./TheKernelVisualizer";
import CodeHelixVisualizer from "./CodeHelixVisualizer";
import styles from "./SignalVisualizer.module.css";

interface SignalVisualizerProps {
  slug: string;
  stepId: string;
  /** false on tier 0 / reduced-motion: draw one accurate static frame, no loop */
  animate: boolean;
  tier: DeviceTier;
  color: string;
  colorSecondary: string;
}

type Gate = "AND" | "OR" | "NOT";
const GATES: Gate[] = ["AND", "OR", "NOT"];
function evalGate(gate: Gate, a: number, b: number): number {
  if (gate === "AND") return a & b;
  if (gate === "OR") return a | b;
  return a ? 0 : 1; // NOT only reads input a
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/**
 * Canvas2D renderer for the Silicon Foundry signal journey. Every step draws
 * a real, named CS process — not decorative particles. One component, five
 * draw functions, switched by `stepId`. `animate=false` draws a single
 * correct still frame (reduced-motion / tier 0 contract).
 */
export default function SignalVisualizer({ slug, stepId, animate, tier, color, colorSecondary }: SignalVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  if (slug === "network-pathways") {
    return (
      <NetworkPathwaysVisualizer
        stepId={stepId}
        animate={animate}
        tier={tier}
        color={color}
        colorSecondary={colorSecondary}
      />
    );
  }

  if (slug === "the-kernel") {
    return (
      <TheKernelVisualizer
        stepId={stepId}
        animate={animate}
        tier={tier}
        color={color}
        colorSecondary={colorSecondary}
      />
    );
  }

  if (slug === "code-helix") {
    return (
      <CodeHelixVisualizer
        stepId={stepId}
        animate={animate}
        tier={tier}
        color={color}
        colorSecondary={colorSecondary}
      />
    );
  }

  // Resize: match canvas resolution to its CSS box (capped DPR for perf).
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

    const density = Math.max(0.35, particleBudget(tier) || 0.35);

    const draw = (elapsedMs: number) => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;
      const t = elapsedMs / 1000;
      ctx.clearRect(0, 0, w, h);
      switch (stepId) {
        case "electricity":
          drawElectricity(ctx, w, h, t, color, density, animate);
          break;
        case "logic":
          drawLogic(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "cpu":
          drawCpu(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "memory":
          drawMemory(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "result":
          drawResult(ctx, w, h, t, color, colorSecondary, animate);
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

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}

// ---- Step 1: electricity travels the circuit traces ----
function drawElectricity(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, color: string, density: number, animate: boolean) {
  const path: [number, number][] = [
    [w * 0.06, h * 0.5],
    [w * 0.3, h * 0.5],
    [w * 0.3, h * 0.2],
    [w * 0.55, h * 0.2],
    [w * 0.55, h * 0.8],
    [w * 0.78, h * 0.8],
    [w * 0.78, h * 0.5],
    [w * 0.94, h * 0.5],
  ];
  ctx.strokeStyle = colorMix(color, 0.35);
  ctx.lineWidth = 3;
  ctx.beginPath();
  path.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();

  const segLengths = path.slice(1).map((p, i) => dist(path[i], p));
  const total = segLengths.reduce((a, b) => a + b, 0);

  const count = animate ? Math.max(2, Math.round(6 * density)) : 4;
  for (let i = 0; i < count; i++) {
    const phase = animate ? (t * 0.18 + i / count) % 1 : i / count;
    const [x, y] = pointAlong(path, segLengths, total, phase);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

// ---- Step 2: a real logic gate, evaluated live ----
function drawLogic(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, color: string, secondary: string, animate: boolean) {
  const inputs: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
  let gate: Gate = "AND";
  let a = 1, b = 1;
  if (animate) {
    const cycle = 1.4;
    gate = GATES[Math.floor(t / (cycle * inputs.length)) % GATES.length];
    const seq = gate === "NOT" ? [[0, 0], [1, 0]] : inputs;
    [a, b] = seq[Math.floor(t / cycle) % seq.length] as [number, number];
  }
  const out = evalGate(gate, a, b);

  const cx = w / 2, cy = h / 2, boxW = w * 0.22, boxH = h * 0.34;
  // input lines
  drawWire(ctx, w * 0.08, cy - boxH * 0.4, cx - boxW / 2, cy - boxH * 0.4, a, color, secondary);
  if (gate !== "NOT") drawWire(ctx, w * 0.08, cy + boxH * 0.4, cx - boxW / 2, cy + boxH * 0.4, b, color, secondary);
  // gate box
  ctx.fillStyle = colorMix(color, 0.16);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  roundRect(ctx, cx - boxW / 2, cy - boxH / 2, boxW, boxH, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = `700 ${Math.max(14, w * 0.032)}px var(--font-mono, monospace)`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(gate, cx, cy);
  // output line
  drawWire(ctx, cx + boxW / 2, cy, w * 0.92, cy, out, color, secondary);
}

function drawWire(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, bit: number, color: string, secondary: string) {
  ctx.strokeStyle = bit ? color : secondary;
  ctx.lineWidth = bit ? 3 : 1.5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.fillStyle = bit ? color : secondary;
  ctx.font = "600 13px var(--font-mono, monospace)";
  ctx.textAlign = x1 < x2 - 40 ? "left" : "right";
  ctx.fillText(String(bit), x1 < x2 - 40 ? x1 + 4 : x1 - 4, y1 - 8);
}

// ---- Step 3: fetch / decode / execute ----
function drawCpu(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, color: string, secondary: string, animate: boolean) {
  const phases = ["FETCH", "DECODE", "EXECUTE"];
  const boxes = [
    { x: w * 0.1, label: "MEMORY" },
    { x: w * 0.42, label: "CONTROL UNIT" },
    { x: w * 0.74, label: "ALU" },
  ];
  const boxW = w * 0.18, boxY = h * 0.35, boxH = h * 0.3;
  const phaseIdx = animate ? Math.floor(t / 1.3) % phases.length : 0;

  boxes.forEach((box, i) => {
    const active = i === phaseIdx;
    ctx.fillStyle = active ? colorMix(color, 0.22) : colorMix(secondary, 0.12);
    ctx.strokeStyle = active ? color : secondary;
    ctx.lineWidth = active ? 2.5 : 1.5;
    roundRect(ctx, box.x, boxY, boxW, boxH, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? color : secondary;
    ctx.font = `600 ${Math.max(11, w * 0.022)}px var(--font-mono, monospace)`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(box.label, box.x + boxW / 2, boxY + boxH / 2);
  });

  // connecting line + traveling token
  ctx.strokeStyle = colorMix(color, 0.3);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(boxes[0].x + boxW, boxY + boxH / 2);
  ctx.lineTo(boxes[2].x, boxY + boxH / 2);
  ctx.stroke();

  if (animate) {
    const localT = (t / 1.3) % 1;
    const from = boxes[phaseIdx].x + boxW / 2;
    const to = boxes[Math.min(phaseIdx + 1, boxes.length - 1)].x + boxW / 2;
    const tokenX = lerp(from, to, localT);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(tokenX, boxY + boxH / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = color;
  ctx.font = `700 ${Math.max(13, w * 0.026)}px var(--font-mono, monospace)`;
  ctx.textAlign = "center";
  ctx.fillText(phases[phaseIdx], w / 2, boxY - 16);
}

// ---- Step 4: CPU <-> RAM round trip ----
function drawMemory(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, color: string, secondary: string, animate: boolean) {
  const cpuX = w * 0.14, ramX = w * 0.72, boxW = w * 0.18, boxY = h * 0.35, boxH = h * 0.3;
  [[cpuX, "CPU"], [ramX, "RAM"]].forEach(([x, label]) => {
    ctx.fillStyle = colorMix(color, 0.16);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    roundRect(ctx, x as number, boxY, boxW, boxH, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = `700 ${Math.max(12, w * 0.024)}px var(--font-mono, monospace)`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label as string, (x as number) + boxW / 2, boxY + boxH / 2);
  });

  ctx.strokeStyle = colorMix(secondary, 0.4);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cpuX + boxW, boxY + boxH / 2);
  ctx.lineTo(ramX, boxY + boxH / 2);
  ctx.stroke();

  const cycle = 2.2;
  const phase = animate ? (t % cycle) / cycle : 0.0;
  const requesting = phase < 0.5;
  const localPhase = requesting ? phase / 0.5 : (phase - 0.5) / 0.5;
  const x = requesting ? lerp(cpuX + boxW, ramX, animate ? localPhase : 1) : lerp(ramX, cpuX + boxW, animate ? localPhase : 0);

  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(animate ? x : ramX, boxY + boxH / 2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = color;
  ctx.font = `600 ${Math.max(11, w * 0.022)}px var(--font-mono, monospace)`;
  ctx.textAlign = "center";
  ctx.fillText(!animate || requesting ? "ADDRESS →" : "← DATA", (cpuX + boxW + ramX) / 2, boxY - 14);
}

// ---- Step 5: the converged result ----
function drawResult(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, color: string, secondary: string, animate: boolean) {
  const cx = w / 2, cy = h / 2;
  const pulse = animate ? 1 + Math.sin(t * 2.4) * 0.08 : 1;
  const r = Math.min(w, h) * 0.16 * pulse;

  ctx.strokeStyle = colorMix(secondary, 0.3);
  ctx.lineWidth = 1.5;
  for (let i = 1; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, r + i * 22, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = colorMix(color, 0.25);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = color;
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = color;
  ctx.font = `700 ${Math.max(13, w * 0.026)}px var(--font-mono, monospace)`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RESULT", cx, cy);
}

// ---- small canvas helpers ----
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function dist(a: [number, number], b: [number, number]) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}
function pointAlong(path: [number, number][], segLengths: number[], total: number, phase: number): [number, number] {
  let target = phase * total;
  for (let i = 0; i < segLengths.length; i++) {
    if (target <= segLengths[i] || i === segLengths.length - 1) {
      const segT = segLengths[i] ? target / segLengths[i] : 0;
      const [x1, y1] = path[i];
      const [x2, y2] = path[i + 1];
      return [lerp(x1, x2, segT), lerp(y1, y2, segT)];
    }
    target -= segLengths[i];
  }
  return path[0];
}
function colorMix(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
