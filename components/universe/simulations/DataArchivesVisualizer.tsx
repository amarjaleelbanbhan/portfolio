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

export default function DataArchivesVisualizer({
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
        case "query":
          drawQuery(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "index":
          drawIndex(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "fetch":
          drawFetch(ctx, w, h, t, color, colorSecondary, animate);
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

// ── Step 1: SUBMIT QUERY (SQL query planner and parser tree) ──
function drawQuery(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.1, cy = h * 0.22, boxW = w * 0.8, boxH = h * 0.55;

  // Query editor console
  ctx.fillStyle = "#0c0a09";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(cx, cy, boxW, boxH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "600 8px var(--font-mono, monospace)";
  ctx.textAlign = "left";
  ctx.fillText("SQL TERMINAL", cx + 8, cy + 12);

  // SQL Query Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 12px var(--font-mono, monospace)";
  ctx.fillText("SELECT * FROM users WHERE id = 42;", cx + 12, cy + 32);

  // Parser output AST blocks
  const parseVal = animate ? (t * 2) % 3 : 2;

  ctx.fillStyle = parseVal > 1 ? color : "rgba(255, 255, 255, 0.2)";
  ctx.font = "600 9px var(--font-mono, monospace)";
  ctx.fillText("✔ PARSE SYNTAX", cx + 12, cy + 56);

  ctx.fillStyle = parseVal > 2 ? color : "rgba(255, 255, 255, 0.2)";
  ctx.fillText("✔ COST OPTIMIZER PLAN: INDEX SCAN (users_pkey)", cx + 12, cy + 74);
}

// ── Step 2: INDEX SCAN (Traversing B-Tree Index Towers) ──
function drawIndex(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const rootX = w / 2, rootY = h * 0.22;
  const midLeftX = w * 0.35, midLeftY = h * 0.5;
  const midRightX = w * 0.65, midRightY = h * 0.5;
  const leafNodesY = h * 0.78;

  const leaves = [w * 0.2, w * 0.4, w * 0.6, w * 0.8];

  // Draw connections
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(rootX, rootY); ctx.lineTo(midLeftX, midLeftY);
  ctx.moveTo(rootX, rootY); ctx.lineTo(midRightX, midRightY);
  ctx.moveTo(midLeftX, midLeftY); ctx.lineTo(leaves[0], leafNodesY);
  ctx.moveTo(midLeftX, midLeftY); ctx.lineTo(leaves[1], leafNodesY);
  ctx.moveTo(midRightX, midRightY); ctx.lineTo(leaves[2], leafNodesY);
  ctx.moveTo(midRightX, midRightY); ctx.lineTo(leaves[3], leafNodesY);
  ctx.stroke();

  // Draw Nodes
  const nodes = [
    { x: rootX, y: rootY, label: "Root: 50" },
    { x: midLeftX, y: midLeftY, label: "Node: 25" },
    { x: midRightX, y: midRightY, label: "Node: 75" },
    { x: leaves[0], y: leafNodesY, label: "Leaf: 10" },
    { x: leaves[1], y: leafNodesY, label: "Leaf: 42" },
    { x: leaves[2], y: leafNodesY, label: "Leaf: 60" },
    { x: leaves[3], y: leafNodesY, label: "Leaf: 90" }
  ];

  nodes.forEach((node) => {
    ctx.fillStyle = colorMix(color, 0.15);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 8px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y + 3);
  });

  if (animate) {
    const cycle = 2.0;
    const progress = (t % cycle) / cycle;

    // Pulse traversing down the matching branch: Root -> Node 25 -> Leaf 42
    let px = rootX, py = rootY;
    if (progress < 0.5) {
      const lp = progress / 0.5;
      px = lerp(rootX, midLeftX, lp);
      py = lerp(rootY, midLeftY, lp);
    } else {
      const lp = (progress - 0.5) / 0.5;
      px = lerp(midLeftX, leaves[1], lp);
      py = lerp(midLeftY, leafNodesY, lp);
    }

    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#F59E0B";
    ctx.font = "600 8.5px var(--font-mono, monospace)";
    if (progress > 0.5) {
      ctx.fillText("MATCH KEY 42 -> BLOCK ADDR 0x48f2", w / 2, h * 0.92);
    }
  }
}

// ── Step 3: FETCH DATA (Disk block page read and row output) ──
function drawFetch(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const slabX = w * 0.15, slabY = h * 0.22, slabW = w * 0.7, slabH = h * 0.55;

  // RAM Memory storage slot page block
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(slabX, slabY, slabW, slabH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "600 8px var(--font-mono, monospace)";
  ctx.textAlign = "left";
  ctx.fillText("RAM PAGE BLOCK: 0x48f2", slabX + 8, slabY + 12);

  // Rows of data representation
  const rows = [
    "id: 25 | name: Bob  | email: bob@example.com",
    "id: 42 | name: Amar | email: amar@example.com",
    "id: 75 | name: Jane | email: jane@example.com"
  ];

  ctx.font = "600 9px var(--font-mono, monospace)";
  rows.forEach((row, i) => {
    const isTarget = i === 1;
    ctx.fillStyle = isTarget ? "#F59E0B" : "rgba(255, 255, 255, 0.25)";
    ctx.fillText(row, slabX + 12, slabY + 34 + i * 20);

    if (isTarget && animate && Math.floor(t * 3.5) % 2 === 0) {
      // blinking selection target indicator
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(slabX + 6, slabY + 24 + i * 20, slabW - 12, 14);
      ctx.stroke();
    }
  });

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 8.5px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("TRANSACTION DURABILITY COMMIT SUCCESSFUL", w / 2, h * 0.9);
}
