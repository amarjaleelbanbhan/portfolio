"use client";

import { useEffect, useRef, useState } from "react";
import { getRealmKnowledge } from "@/lib/environments/registry";
import { useUniverseStore } from "@/store/universeStore";
import type { DeviceTier } from "@/lib/deviceTier";
import { startTickEngine } from "@/lib/simulations/engine";
import styles from "../EnvironmentLayer.module.css";

interface NeuralNebula2DProps {
  tier: DeviceTier;
  reduced: boolean;
}

export default function NeuralNebula2D({
  tier,
  reduced,
}: NeuralNebula2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeSimStep = useUniverseStore((s) => s.activeSimStep);

  const knowledge = getRealmKnowledge("neural-nebula");
  const landmarks = knowledge?.landmarks || [];

  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      return dist < 25;
    });

    if (clicked) {
      selectLandmark(clicked.id);
    } else {
      selectLandmark(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

      // Background
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(6, 182, 212, 0.03)";
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

      // Draw dynamic synaptic highways
      ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      landmarks.forEach((lm, idx) => {
        const px = lm.pos2D.x * w;
        const py = lm.pos2D.y * h;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Signals between AI components based on step
      if (!reduced) {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#06B6D4";
        ctx.shadowBlur = 10;

        const getCoord = (id: string) => {
          const lm = landmarks.find((l) => l.id === id);
          return lm ? { x: lm.pos2D.x * w, y: lm.pos2D.y * h } : { x: 0, y: 0 };
        };

        const river = getCoord("dataset-river");
        const galaxy = getCoord("neural-galaxy");
        const chamber = getCoord("training-chamber");

        if (activeSimStep === 0) {
          // ingest data signal
          const progress = (t * 0.8) % 1.0;
          const tx = river.x + (galaxy.x - river.x) * progress;
          const ty = river.y + (galaxy.y - river.y) * progress;
          ctx.beginPath();
          ctx.arc(tx, ty, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeSimStep === 1) {
          // forward feed
          const progress = (t * 0.8) % 1.0;
          const tx = galaxy.x + (chamber.x - galaxy.x) * progress;
          const ty = galaxy.y + (chamber.y - galaxy.y) * progress;
          ctx.beginPath();
          ctx.arc(tx, ty, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
      }

      // Draw nodes
      landmarks.forEach((lm) => {
        const px = lm.pos2D.x * w;
        const py = lm.pos2D.y * h;
        const isHovered = hoveredId === lm.id;
        const isActive = activeLandmark === lm.id;

        if (isHovered || isActive) {
          ctx.fillStyle = "rgba(6, 182, 212, 0.15)";
          ctx.beginPath();
          ctx.arc(px, py, 22, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isActive ? "#ffffff" : isHovered ? "#E0F2FE" : "#06B6D4";
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#06B6D4";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "700 10px var(--font-mono, monospace)";
        ctx.textAlign = "center";
        ctx.fillText(lm.name.toUpperCase(), px, py - 20);
      });
    };

    if (reduced) {
      draw(0);
      return;
    }

    const engine = startTickEngine(({ elapsed }) => draw(elapsed / 1000), tier);
    return () => engine.stop();
  }, [tier, reduced, knowledge, landmarks, hoveredId, activeLandmark, activeSimStep]);

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
