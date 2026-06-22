"use client";

import { useEffect, useRef } from "react";
import type { DeviceTier } from "@/lib/deviceTier";
import { startTickEngine } from "@/lib/simulations/engine";
import styles from "./SignalVisualizer.module.css";

interface Point2D {
  x: number; // 0 to 1
  y: number; // 0 to 1
}

interface SignalTracerProps {
  path: Point2D[];
  color: string;
  animate: boolean;
  tier: DeviceTier;
  speed?: number;
  pulseSize?: number;
  lineWidth?: number;
  pulseCount?: number;
}

export default function SignalTracer({
  path,
  color,
  animate,
  tier,
  speed = 0.2,
  pulseSize = 4,
  lineWidth = 2,
  pulseCount = 3,
}: SignalTracerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  // Handle canvas sizing and responsiveness
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || path.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper functions for path calculations
    const dist = (p1: Point2D, p2: Point2D, w: number, h: number) => {
      return Math.hypot((p2.x - p1.x) * w, (p2.y - p1.y) * h);
    };

    const lerp = (a: number, b: number, t: number) => {
      return a + (b - a) * Math.max(0, Math.min(1, t));
    };

    const draw = (elapsedMs: number) => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;

      const t = elapsedMs / 1000;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw static path wire
      ctx.strokeStyle = `${color}40`; // 25% opacity
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      path.forEach((pt, i) => {
        const px = pt.x * w;
        const py = pt.y * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // 2. Animate traveling pulses along the segments
      if (!animate) return;

      const segLengths = path.slice(1).map((p, i) => dist(path[i], p, w, h));
      const totalLen = segLengths.reduce((a, b) => a + b, 0);

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = pulseSize * 2.5;

      for (let i = 0; i < pulseCount; i++) {
        const phase = (t * speed + i / pulseCount) % 1;
        let target = phase * totalLen;

        for (let j = 0; j < segLengths.length; j++) {
          if (target <= segLengths[j] || j === segLengths.length - 1) {
            const segT = segLengths[j] ? target / segLengths[j] : 0;
            const p1 = path[j];
            const p2 = path[j + 1];

            const px = lerp(p1.x * w, p2.x * w, segT);
            const py = lerp(p1.y * h, p2.y * h, segT);

            ctx.beginPath();
            ctx.arc(px, py, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          target -= segLengths[j];
        }
      }
      ctx.shadowBlur = 0; // Reset shadow
    };

    if (!animate) {
      draw(0);
      return;
    }

    const engine = startTickEngine(({ elapsed }) => draw(elapsed), tier);
    return () => engine.stop();
  }, [path, color, animate, tier, speed, pulseSize, lineWidth, pulseCount]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
