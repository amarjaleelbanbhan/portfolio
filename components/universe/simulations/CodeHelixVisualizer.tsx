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

export default function CodeHelixVisualizer({
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
        case "write":
          drawWrite(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "compile":
          drawCompile(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "ds-map":
          drawDsMap(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "execute":
          drawExecute(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "output":
          drawOutput(ctx, w, h, t, color, colorSecondary, animate);
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

// ── Step 1: WRITE CODE (Typewriter editor simulation) ──
function drawWrite(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.1, cy = h * 0.2;
  const boxW = w * 0.8, boxH = h * 0.6;

  // Code editor card boundary
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(cx, cy, boxW, boxH);
  ctx.fill();
  ctx.stroke();

  // Floating controls dots
  ctx.fillStyle = "#ef4444";
  ctx.beginPath(); ctx.arc(cx + 12, cy + 12, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#eab308";
  ctx.beginPath(); ctx.arc(cx + 24, cy + 12, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#22c55e";
  ctx.beginPath(); ctx.arc(cx + 36, cy + 12, 4, 0, Math.PI * 2); ctx.fill();

  const codeLines = [
    '// Human logic forge',
    'function process() {',
    '  let val = 42;',
    '  print("HELLO");',
    '}'
  ];

  ctx.font = "600 11px var(--font-mono, monospace)";
  ctx.textAlign = "left";

  let totalChars = 0;
  codeLines.forEach((l) => (totalChars += l.length));

  const charsToShow = animate ? Math.floor(t * 22) % (totalChars + 20) : totalChars;

  let currentCount = 0;
  codeLines.forEach((line, idx) => {
    if (currentCount > charsToShow) return;
    const lShow = Math.min(line.length, charsToShow - currentCount);
    const printedText = line.substring(0, lShow);

    if (idx === 0) ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    else if (line.includes("function") || line.includes("let")) ctx.fillStyle = color;
    else if (line.includes('"HELLO"')) ctx.fillStyle = "#22c55e";
    else ctx.fillStyle = "#ffffff";

    ctx.fillText(printedText, cx + 15, cy + 34 + idx * 18);

    // Blinking cursor
    if (lShow < line.length || (idx === codeLines.length - 1 && lShow === line.length)) {
      if (!animate || Math.floor(t * 3) % 2 === 0) {
        ctx.fillStyle = "#ffffff";
        const metric = ctx.measureText(printedText);
        ctx.fillRect(cx + 16 + metric.width, cy + 24 + idx * 18, 2, 12);
      }
    }
    currentCount += line.length;
  });
}

// ── Step 2: COMPILE ASSEMBLY (AST parsing nodes) ──
function drawCompile(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const rootX = w / 2, rootY = h * 0.22;
  const leftX = w * 0.35, leftY = h * 0.5;
  const rightX = w * 0.65, rightY = h * 0.5;
  const valX = w * 0.65, valY = h * 0.78;

  // AST Nodes
  const nodes = [
    { x: rootX, y: rootY, label: "CallExpr" },
    { x: leftX, y: leftY, label: "Identifier(print)" },
    { x: rightX, y: rightY, label: "Literal" },
    { x: valX, y: valY, label: '"HELLO"' }
  ];

  ctx.strokeStyle = colorMix(color, 0.25);
  ctx.lineWidth = 1.5;

  // Draw connections
  ctx.beginPath();
  ctx.moveTo(rootX, rootY); ctx.lineTo(leftX, leftY);
  ctx.moveTo(rootX, rootY); ctx.lineTo(rightX, rightY);
  ctx.moveTo(rightX, rightY); ctx.lineTo(valX, valY);
  ctx.stroke();

  // Draw node bubbles
  nodes.forEach((node, idx) => {
    ctx.fillStyle = colorMix(idx % 2 === 0 ? color : secondary, 0.15);
    ctx.strokeStyle = idx % 2 === 0 ? color : secondary;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 7.5px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y + 3);
  });

  if (animate) {
    // Binary pulse translating AST into machine code
    const progress = (t * 0.6) % 1.0;
    ctx.fillStyle = "#22c55e";
    ctx.font = "700 10px var(--font-mono, monospace)";
    ctx.fillText(
      `ASM: MOV RDI, 1; SYSCALL`,
      rootX + Math.sin(t * 3) * 10,
      h * 0.94
    );
  }
}

// ── Step 3: DATA LAYOUT (Array vs Linked List mapping) ──
function drawDsMap(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  // Contiguous Array (Top)
  const arrY = h * 0.35, arrCell = w * 0.12;
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 9px var(--font-mono, monospace)";
  ctx.textAlign = "left";
  ctx.fillText("ARRAY (CONTIGUOUS RAM DATA):", w * 0.1, arrY - 14);

  for (let i = 0; i < 4; i++) {
    const rx = w * 0.15 + i * (arrCell + 4);
    ctx.fillStyle = colorMix(color, 0.15);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(rx, arrY, arrCell, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 8.5px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText(`[${i}] val`, rx + arrCell / 2, arrY + 14);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "500 7px var(--font-mono, monospace)";
    ctx.fillText(`0x${(1000 + i * 4).toString(16)}`, rx + arrCell / 2, arrY - 2);
  }

  // Linked List nodes (Bottom)
  const listY = h * 0.72;
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 9px var(--font-mono, monospace)";
  ctx.textAlign = "left";
  ctx.fillText("LINKED LIST (SCATTERED POINTERS):", w * 0.1, listY - 18);

  const listNodes = [
    { x: w * 0.22, y: listY, addr: "0x12a0" },
    { x: w * 0.52, y: listY + 8, addr: "0x34bc" },
    { x: w * 0.82, y: listY - 6, addr: "0x7e02" }
  ];

  listNodes.forEach((node, i) => {
    ctx.fillStyle = colorMix(secondary, 0.15);
    ctx.strokeStyle = secondary;
    ctx.beginPath();
    ctx.rect(node.x - 22, node.y - 12, 44, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 8px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText(`Node ${i}`, node.x, node.y + 2);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "500 7px var(--font-mono, monospace)";
    ctx.fillText(node.addr, node.x, node.y - 14);

    // Draw pointer arrow to next node
    if (i < listNodes.length - 1) {
      const next = listNodes[i + 1];
      ctx.strokeStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(node.x + 22, node.y);
      ctx.lineTo(next.x - 22, next.y);
      ctx.stroke();

      // arrow pointer tip
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(next.x - 22, next.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// ── Step 4: RUN ALGORITHM (Sorting comparison arrays) ──
function drawExecute(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const count = 12;
  const bars: number[] = [];
  // seeded simple sorting simulation
  for (let i = 0; i < count; i++) {
    bars.push(10 + ((i * 7 + 13) % 25));
  }

  const activeIdx1 = animate ? Math.floor(t * 3) % count : 2;
  const activeIdx2 = (activeIdx1 + 1) % count;

  const barW = w * 0.05;
  const cx = w * 0.18;

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 10px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("QUICKSORT ALGORITHM OPTIMIZATION O(N log N)", w / 2, h * 0.18);

  for (let i = 0; i < count; i++) {
    const rx = cx + i * (barW + 6);
    const val = bars[i];
    const hVal = (val / 35) * (h * 0.5);

    const isActive = i === activeIdx1 || i === activeIdx2;
    ctx.fillStyle = isActive ? "#22c55e" : colorMix(color, 0.3);
    ctx.strokeStyle = isActive ? "#22c55e" : color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(rx, h * 0.8 - hVal, barW, hVal);
    ctx.fill();
    ctx.stroke();
  }

  if (animate) {
    ctx.fillStyle = "#22c55e";
    ctx.font = "500 8.5px var(--font-mono, monospace)";
    ctx.fillText(`SWAP INDEX ${activeIdx1} <-> ${activeIdx2}`, w / 2, h * 0.9);
  }
}

// ── Step 5: HARDWARE OUTPUT (Renders printed standard output) ──
function drawOutput(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.15, cy = h * 0.22, boxW = w * 0.7, boxH = h * 0.55;

  // Terminal box
  ctx.fillStyle = "#0c0a09";
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(cx, cy, boxW, boxH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "600 10px var(--font-mono, monospace)";
  ctx.textAlign = "left";
  ctx.fillText("STDOUT MONITOR", cx + 10, cy - 8);

  // Printed data
  ctx.fillStyle = "#22c55e";
  ctx.font = "700 16px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("HELLO", w / 2, cy + boxH / 2 + 5);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "500 8px var(--font-mono, monospace)";
  ctx.fillText("HTTP 200 OK | Process Exit 0", w / 2, cy + boxH - 8);
}
