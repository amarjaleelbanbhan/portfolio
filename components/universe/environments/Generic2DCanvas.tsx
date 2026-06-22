"use client";

import { useEffect, useRef, useState } from "react";
import { getRealmKnowledge } from "@/lib/environments/registry";
import { useUniverseStore } from "@/store/universeStore";
import type { DeviceTier } from "@/lib/deviceTier";
import { startTickEngine } from "@/lib/simulations/engine";
import styles from "./EnvironmentLayer.module.css";

interface Generic2DCanvasProps {
  slug: string;
  tier: DeviceTier;
  reduced: boolean;
}

export default function Generic2DCanvas({
  slug,
  tier,
  reduced,
}: Generic2DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);

  const knowledge = getRealmKnowledge(slug);
  const landmarks = knowledge?.landmarks || [];

  // Manage hover states and mouse coordinate tracking
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

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

  // Click detection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = landmarks.find((lm) => {
      const px = lm.pos2D.x * rect.width;
      const py = lm.pos2D.y * rect.height;
      const dist = Math.hypot(x - px, y - py);
      return dist < 25; // Hit radius
    });

    if (clicked) {
      selectLandmark(clicked.id);
    } else {
      selectLandmark(null);
    }
  };

  // Mouse move for hover detection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y };

    const hovered = landmarks.find((lm) => {
      const px = lm.pos2D.x * rect.width;
      const py = lm.pos2D.y * rect.height;
      const dist = Math.hypot(x - px, y - py);
      return dist < 25;
    });

    if (hovered) {
      setHoveredId(hovered.id);
      canvas.style.cursor = "pointer";
    } else {
      setHoveredId(null);
      canvas.style.cursor = "auto";
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !knowledge) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (t: number) => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;

      ctx.clearRect(0, 0, w, h);

      // Deep substrate background
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, w, h);

      // Draw grid lines
      ctx.strokeStyle = "rgba(0, 245, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 45;
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

      // Draw connection lines
      ctx.strokeStyle = "rgba(0, 245, 255, 0.1)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      landmarks.forEach((lm, idx) => {
        const px = lm.pos2D.x * w;
        const py = lm.pos2D.y * h;
        if (idx === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      });
      ctx.stroke();

      // Draw landmarks
      landmarks.forEach((lm) => {
        const px = lm.pos2D.x * w;
        const py = lm.pos2D.y * h;
        const isHovered = hoveredId === lm.id;
        const isActive = activeLandmark === lm.id;

        // Draw node pulse
        if (isHovered || isActive) {
          const pulse = 1.0 + Math.sin(t * 4) * 0.15;
          ctx.fillStyle = "rgba(0, 245, 255, 0.1)";
          ctx.beginPath();
          ctx.arc(px, py, 24 * pulse, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw node base
        ctx.fillStyle = isActive
          ? "#ffffff"
          : isHovered
          ? "var(--realm-accent, #FFF7E6)"
          : "var(--realm-primary, #00F5FF)";
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "var(--realm-primary, #00F5FF)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 15, 0, Math.PI * 2);
        ctx.stroke();

        // Draw label text
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "600 11px var(--font-mono, monospace)";
        ctx.textAlign = "center";
        ctx.fillText(lm.name.toUpperCase(), px, py - 22);
      });
    };

    if (reduced) {
      draw(0);
      return;
    }

    const engine = startTickEngine(({ elapsed }) => draw(elapsed / 1000), tier);
    return () => engine.stop();
  }, [tier, reduced, knowledge, landmarks, hoveredId, activeLandmark]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      aria-hidden="true"
    />
  );
}
