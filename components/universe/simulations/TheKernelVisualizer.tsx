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

export default function TheKernelVisualizer({
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
        case "app-open":
          drawAppOpen(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "alloc-memory":
          drawMemoryAlloc(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "schedule-cpu":
          drawScheduleCpu(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "access-hardware":
          drawHardwareAccess(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "run-app":
          drawRunApp(ctx, w, h, t, color, colorSecondary, animate);
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

// ── Step 1: APP OPEN (Read File Headers from storage) ──
function drawAppOpen(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const diskX = w * 0.15, diskY = h * 0.5, diskW = w * 0.18, diskH = h * 0.5;
  const bufferX = w * 0.65, bufferY = h * 0.5, bufferW = w * 0.22, bufferH = h * 0.5;

  // Storage Disk
  ctx.fillStyle = colorMix(color, 0.12);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(diskX, diskY - diskH / 2, diskW, diskH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 10px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("DISK SECTORS", diskX + diskW / 2, diskY - diskH / 2 - 8);

  // File system sector blocks inside disk
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = colorMix(color, 0.2);
    ctx.fillRect(diskX + 8, diskY - diskH / 2 + 10 + i * 22, diskW - 16, 16);
  }

  // OS Page Cache Loader Buffer
  ctx.fillStyle = colorMix(secondary, 0.12);
  ctx.strokeStyle = secondary;
  ctx.beginPath();
  ctx.rect(bufferX, bufferY - bufferH / 2, bufferW, bufferH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText("OS LOADER BUFFER", bufferX + bufferW / 2, bufferY - bufferH / 2 - 8);

  // Connection bus
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.moveTo(diskX + diskW, diskY);
  ctx.lineTo(bufferX, diskY);
  ctx.stroke();

  if (animate) {
    const cycle = 2.0;
    const progress = (t % cycle) / cycle;
    const tx = lerp(diskX + diskW, bufferX, progress);

    // Glowing data packet
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(tx, diskY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Render loading text details
    ctx.fillStyle = secondary;
    ctx.font = "500 8px var(--font-mono, monospace)";
    if (progress > 0.5) {
      ctx.fillText("LOAD ELF HEADER", bufferX + bufferW / 2, bufferY);
    } else {
      ctx.fillText("READING INODE", diskX + diskW / 2, diskY);
    }
  } else {
    ctx.fillStyle = secondary;
    ctx.font = "500 8px var(--font-mono, monospace)";
    ctx.fillText("READY", bufferX + bufferW / 2, bufferY);
  }
}

// ── Step 2: ALLOCATE MEMORY (Virtual to Physical MMU translations) ──
function drawMemoryAlloc(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const leftX = w * 0.15, rightX = w * 0.7;
  const boxW = w * 0.18, boxH = h * 0.5;

  // Virtual Address Blocks
  ctx.fillStyle = colorMix(color, 0.12);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.rect(leftX, h * 0.25, boxW, boxH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 10px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("VIRTUAL PAGES", leftX + boxW / 2, h * 0.25 - 8);

  // Physical RAM slots
  ctx.fillStyle = colorMix(secondary, 0.12);
  ctx.strokeStyle = secondary;
  ctx.beginPath();
  ctx.rect(rightX, h * 0.25, boxW, boxH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText("PHYSICAL RAM", rightX + boxW / 2, h * 0.25 - 8);

  // Page translation box in center
  const centerW = w * 0.15, centerH = h * 0.3;
  const centerX = w * 0.5 - centerW / 2, centerY = h * 0.5 - centerH / 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.beginPath();
  ctx.rect(centerX, centerY, centerW, centerH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "500 8px var(--font-mono, monospace)";
  ctx.fillText("PAGE TABLE", centerX + centerW / 2, centerY + centerH / 2);

  // Draw mapping lines
  const leftPoints = [h * 0.35, h * 0.5, h * 0.65];
  const rightPoints = [h * 0.65, h * 0.35, h * 0.5]; // mapped differently (virtual isolation)

  leftPoints.forEach((ly, i) => {
    const ry = rightPoints[i];
    ctx.strokeStyle = colorMix(color, 0.2);
    ctx.beginPath();
    ctx.moveTo(leftX + boxW, ly);
    ctx.lineTo(centerX, centerY + centerH * 0.25 + i * 20);
    ctx.lineTo(centerX + centerW, centerY + centerH * 0.25 + i * 20);
    ctx.lineTo(rightX, ry);
    ctx.stroke();

    if (animate) {
      const cycle = 2.0;
      const progress = ((t * 0.8) + i * 0.33) % cycle;
      if (progress < 1.0) {
        // Pulse traveling virtual page -> page table -> physical slot
        let px = leftX + boxW;
        let py = ly;
        if (progress < 0.4) {
          const lp = progress / 0.4;
          px = lerp(leftX + boxW, centerX, lp);
          py = lerp(ly, centerY + centerH * 0.25 + i * 20, lp);
        } else if (progress < 0.6) {
          const lp = (progress - 0.4) / 0.2;
          px = lerp(centerX, centerX + centerW, lp);
          py = centerY + centerH * 0.25 + i * 20;
        } else {
          const lp = (progress - 0.6) / 0.4;
          px = lerp(centerX + centerW, rightX, lp);
          py = lerp(centerY + centerH * 0.25 + i * 20, ry, lp);
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

// ── Step 3: SCHEDULE CPU (Wait lists & context switching) ──
function drawScheduleCpu(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const queueX = w * 0.15, queueY = h * 0.5, queueW = w * 0.3, queueH = h * 0.4;
  const cpuX = w * 0.65, cpuY = h * 0.5, cpuW = w * 0.2, cpuH = h * 0.4;

  // Runqueue box
  ctx.fillStyle = colorMix(color, 0.12);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.rect(queueX, queueY - queueH / 2, queueW, queueH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 10px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("SCHEDULER RUNQUEUE", queueX + queueW / 2, queueY - queueH / 2 - 8);

  // Processes in queue
  const pCount = 3;
  const pWidth = queueW / 4;
  for (let i = 0; i < pCount; i++) {
    const shiftX = animate ? Math.sin(t * 3 + i) * 3 : 0;
    ctx.fillStyle = colorMix(color, 0.3);
    ctx.fillRect(queueX + 15 + i * (pWidth + 12) + shiftX, queueY - 12, pWidth, 24);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 9px var(--font-mono, monospace)";
    ctx.fillText(`P${i+1}`, queueX + 15 + i * (pWidth + 12) + pWidth / 2 + shiftX, queueY + 3);
  }

  // CPU Cores
  ctx.fillStyle = colorMix(secondary, 0.12);
  ctx.strokeStyle = secondary;
  ctx.beginPath();
  ctx.rect(cpuX, cpuY - cpuH / 2, cpuW, cpuH);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText("CPU CORES", cpuX + cpuW / 2, cpuY - cpuH / 2 - 8);

  // Cores inside CPU
  ctx.fillStyle = colorMix(secondary, 0.2);
  ctx.fillRect(cpuX + 10, cpuY - cpuH / 2 + 10, cpuW - 20, cpuH / 2 - 14);
  ctx.fillRect(cpuX + 10, cpuY + 4, cpuW - 20, cpuH / 2 - 14);

  // Transition signal
  if (animate) {
    const cycle = 1.6;
    const progress = (t % cycle) / cycle;
    const tx = lerp(queueX + queueW, cpuX, progress);

    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.arc(tx, queueY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "500 8px var(--font-mono, monospace)";
    if (progress > 0.5) {
      ctx.fillText("CONTEXT SWITCH", (queueX + queueW + cpuX) / 2, queueY - 10);
    } else {
      ctx.fillText("DISPATCHING", (queueX + queueW + cpuX) / 2, queueY - 10);
    }
  }
}

// ── Step 4: HARDWARE ACCESS (Keyboard clicks -> Driver interrupts) ──
function drawHardwareAccess(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const hwX = w * 0.15, hwY = h * 0.5;
  const hubX = w * 0.5, hubY = h * 0.5;
  const appX = w * 0.85, appY = h * 0.5;

  // Keyboard device
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.beginPath();
  ctx.rect(hwX - 35, hwY - 20, 70, 40);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 10px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("KEYBOARD", hwX, hwY - 26);
  ctx.fillText("[Keys]", hwX, hwY + 5);

  // Kernel Interrupt Hub
  ctx.fillStyle = colorMix(color, 0.15);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(hubX, hubY, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.fillText("KERNEL", hubX, hubY - 30);
  ctx.font = "700 9px var(--font-mono, monospace)";
  ctx.fillText("ISR", hubX, hubY + 3);

  // User Space Application
  ctx.fillStyle = colorMix(secondary, 0.12);
  ctx.strokeStyle = secondary;
  ctx.beginPath();
  ctx.rect(appX - 35, appY - 25, 70, 50);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 10px var(--font-mono, monospace)";
  ctx.fillText("APP", appX, appY - 30);
  ctx.font = "500 8px var(--font-mono, monospace)";
  ctx.fillText("active", appX, appY + 4);

  // Connecting buses
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.moveTo(hwX + 35, hwY);
  ctx.lineTo(hubX - 24, hubY);
  ctx.moveTo(hubX + 24, hubY);
  ctx.lineTo(appX - 35, appY);
  ctx.stroke();

  if (animate) {
    const cycle = 2.4;
    const progress = (t % cycle) / cycle;

    if (progress < 0.5) {
      // Phase 1: Tap triggers Interrupt (IRQ)
      const lp = progress / 0.5;
      const tx = lerp(hwX + 35, hubX - 24, lp);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(tx, hwY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = "500 8px var(--font-mono, monospace)";
      ctx.fillText("IRQ INTERRUPT", (hwX + hubX) / 2, hwY - 8);
    } else {
      // Phase 2: Driver delivers buffer data to user app
      const lp = (progress - 0.5) / 0.5;
      const tx = lerp(hubX + 24, appX - 35, lp);
      ctx.fillStyle = secondary;
      ctx.beginPath();
      ctx.arc(tx, appY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = secondary;
      ctx.font = "500 8px var(--font-mono, monospace)";
      ctx.fillText("BUFFER IO", (hubX + appX) / 2, appY - 8);
    }
  }
}

// ── Step 5: APP RUNNING (User vs Kernel Rings & Syscalls) ──
function drawRunApp(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w / 2, cy = h / 2;

  // Draw concentric rings representing privilege levels
  // Ring 3: User mode (outer)
  ctx.strokeStyle = colorMix(color, 0.25);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 75, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = "700 9px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("RING 3 (USER MODE)", cx, cy - 82);

  // Ring 0: Kernel mode (inner)
  ctx.strokeStyle = colorMix(secondary, 0.4);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 35, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = secondary;
  ctx.fillText("RING 0 (KERNEL)", cx, cy - 42);

  // Center Core process
  ctx.fillStyle = colorMix(secondary, 0.15);
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 9px var(--font-mono, monospace)";
  ctx.fillText("CORE", cx, cy + 3);

  if (animate) {
    const cycle = 3.0;
    const progress = (t % cycle) / cycle;

    // A process makes a system call to transition from Ring 3 to Ring 0 and back
    let dist = 75;
    let label = "USER SPACE";
    let pulseColor = color;

    if (progress < 0.4) {
      // Pushing down into Kernel
      const lp = progress / 0.4;
      dist = lerp(75, 35, lp);
      label = "SYSCALL TRAP";
      pulseColor = secondary;
    } else if (progress < 0.7) {
      // inside Kernel
      dist = 35;
      label = "EXEC RESOURCE";
      pulseColor = secondary;
    } else {
      // Returning to User mode
      const lp = (progress - 0.7) / 0.3;
      dist = lerp(35, 75, lp);
      label = "RETURN TO USER";
      pulseColor = color;
    }

    const angle = t * 1.5;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;

    // Glowing process bubble
    ctx.fillStyle = pulseColor;
    ctx.shadowColor = pulseColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label text floating next to bubble
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 8px var(--font-mono, monospace)";
    ctx.fillText(label, px, py - 10);
  }
}
