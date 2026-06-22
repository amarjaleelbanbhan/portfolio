"use client";

import { useEffect, useRef } from "react";
import type { DeviceTier } from "@/lib/deviceTier";
import { startTickEngine } from "@/lib/simulations/engine";
import styles from "./EnvironmentLayer.module.css";

interface Motherboard2DCanvasProps {
  tier: DeviceTier;
  reduced: boolean;
}

export default function Motherboard2DCanvas({
  tier,
  reduced,
}: Motherboard2DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the static motherboard blueprint layout
    const draw = (t: number) => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;

      ctx.clearRect(0, 0, w, h);

      // Deep substrate background
      ctx.fillStyle = "#050706";
      ctx.fillRect(0, 0, w, h);

      // Draw faint background grid
      ctx.strokeStyle = "rgba(180, 83, 9, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const cx = w * 0.45;
      const cy = h * 0.5;
      const cpuSize = Math.min(180, w * 0.25);

      // ── Draw CPU Socket ──
      ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
      ctx.fillStyle = "rgba(11, 11, 18, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(cx - cpuSize / 2, cy - cpuSize / 2, cpuSize, cpuSize);
      ctx.fill();
      ctx.stroke();

      // CPU Outer Collar
      ctx.strokeStyle = "rgba(180, 83, 9, 0.4)";
      ctx.beginPath();
      ctx.rect(cx - cpuSize * 0.4, cy - cpuSize * 0.4, cpuSize * 0.8, cpuSize * 0.8);
      ctx.stroke();

      // CPU Glowing Core
      const corePulse = 0.85 + Math.sin(t * 2.5) * 0.08;
      ctx.fillStyle = `rgba(245, 158, 11, ${0.15 + (corePulse - 0.85) * 2})`;
      ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
      ctx.beginPath();
      ctx.rect(cx - (cpuSize * 0.2) * corePulse, cy - (cpuSize * 0.2) * corePulse, cpuSize * 0.4 * corePulse, cpuSize * 0.4 * corePulse);
      ctx.fill();
      ctx.stroke();

      // CPU Socket Pin details (dashed outline)
      ctx.strokeStyle = "rgba(245, 158, 11, 0.15)";
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.rect(cx - cpuSize * 0.45, cy - cpuSize * 0.45, cpuSize * 0.9, cpuSize * 0.9);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // ── Draw Memory Channels (RAM Slots) ──
      const ramStartX = cx + cpuSize / 2 + 50;
      const ramY = cy - 100;
      const ramW = 12;
      const ramH = 200;
      const gap = 16;

      for (let i = 0; i < 4; i++) {
        const x = ramStartX + i * (ramW + gap);
        // Socket slot
        ctx.fillStyle = "rgba(11, 11, 18, 0.9)";
        ctx.strokeStyle = "rgba(180, 83, 9, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(x, ramY, ramW, ramH);
        ctx.fill();
        ctx.stroke();

        // DRAM chips on the slots
        ctx.fillStyle = "rgba(5, 5, 8, 0.95)";
        for (let dy = 15; dy < ramH - 15; dy += 35) {
          ctx.fillRect(x + 2, ramY + dy, ramW - 4, 20);
        }
      }

      // ── Draw Circuit Highways ──
      ctx.strokeStyle = "rgba(180, 83, 9, 0.2)";
      ctx.lineWidth = 1.5;

      // 1. Central signal trace
      ctx.beginPath();
      ctx.moveTo(cx - 300, cy);
      ctx.lineTo(cx - cpuSize / 2, cy);
      ctx.stroke();

      // 2. RAM bus traces
      for (let i = 0; i < 4; i++) {
        const targetX = ramStartX + i * (ramW + gap) + ramW / 2;
        ctx.beginPath();
        ctx.moveTo(cx + cpuSize / 2, cy - 40 + i * 20);
        ctx.lineTo(targetX - 25, cy - 40 + i * 20);
        ctx.lineTo(targetX, cy - 15 + i * 10);
        ctx.lineTo(targetX, ramY);
        ctx.stroke();
      }

      // ── Moving Electrical pulses ──
      if (!reduced) {
        ctx.fillStyle = "#FFF7E6";
        ctx.shadowColor = "#F59E0B";
        ctx.shadowBlur = 8;

        // Central pulse
        const mainP = (t * 0.22) % 1.0;
        const mainX = cx - 300 + 300 * mainP;
        ctx.beginPath();
        ctx.arc(mainX, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // RAM pulses
        for (let i = 0; i < 4; i++) {
          const ramP = ((t * 0.25) + i * 0.25) % 1.0;
          const targetX = ramStartX + i * (ramW + gap) + ramW / 2;
          ctx.fillStyle = "#00F5FF";
          ctx.shadowColor = "#00F5FF";
          const ramYPos = ramY + ramH * ramP;
          ctx.beginPath();
          ctx.arc(targetX, ramYPos, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0; // Reset shadow
      }
    };

    if (reduced) {
      draw(0);
      return;
    }

    const engine = startTickEngine(({ elapsed }) => draw(elapsed / 1000), tier);
    return () => engine.stop();
  }, [tier, reduced]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
