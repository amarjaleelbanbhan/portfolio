"use client";

import { useEffect, useRef, useState } from "react";
import { getRealmKnowledge } from "@/lib/environments/registry";
import { useUniverseStore } from "@/store/universeStore";
import type { DeviceTier } from "@/lib/deviceTier";
import { startTickEngine } from "@/lib/simulations/engine";
import styles from "../EnvironmentLayer.module.css";

interface NetworkPathways2DProps {
  tier: DeviceTier;
  reduced: boolean;
}

export default function NetworkPathways2D({
  tier,
  reduced,
}: NetworkPathways2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const activeLandmark = useUniverseStore((s) => s.activeLandmark);
  const selectLandmark = useUniverseStore((s) => s.selectLandmark);
  const activeSimStep = useUniverseStore((s) => s.activeSimStep);

  const knowledge = getRealmKnowledge("network-pathways");
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

      // Substrate
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(13, 148, 136, 0.03)";
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

      // Draw fiber wires connecting landmarks sequentially
      ctx.strokeStyle = "rgba(13, 148, 136, 0.12)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      landmarks.forEach((lm, idx) => {
        const px = lm.pos2D.x * w;
        const py = lm.pos2D.y * h;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Animate active steps packet routing
      if (!reduced) {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#38BDF8";
        ctx.shadowBlur = 10;

        const getCoord = (id: string) => {
          const lm = landmarks.find((l) => l.id === id);
          return lm ? { x: lm.pos2D.x * w, y: lm.pos2D.y * h } : { x: 0, y: 0 };
        };

        const client = getCoord("client-terminal");
        const dns = getCoord("dns-beacon");
        const router = getCoord("router-network");
        const firewall = getCoord("firewall-gate");
        const server = getCoord("server-core");

        if (activeSimStep === 1) {
          // Client <-> DNS query
          const progress = (t * 0.8) % 1.0;
          const target =
            progress < 0.5
              ? {
                  x: client.x + (dns.x - client.x) * (progress / 0.5),
                  y: client.y + (dns.y - client.y) * (progress / 0.5),
                }
              : {
                  x: dns.x + (client.x - dns.x) * ((progress - 0.5) / 0.5),
                  y: dns.y + (client.y - dns.y) * ((progress - 0.5) / 0.5),
                };
          ctx.beginPath();
          ctx.arc(target.x, target.y, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeSimStep === 3) {
          // Client -> Router -> Firewall
          const progress = (t * 0.6) % 1.0;
          let target = { x: client.x, y: client.y };
          if (progress < 0.5) {
            const local = progress / 0.5;
            target = {
              x: client.x + (router.x - client.x) * local,
              y: client.y + (router.y - client.y) * local,
            };
          } else {
            const local = (progress - 0.5) / 0.5;
            target = {
              x: router.x + (firewall.x - router.x) * local,
              y: router.y + (firewall.y - router.y) * local,
            };
          }
          ctx.beginPath();
          ctx.arc(target.x, target.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeSimStep === 4) {
          // Pause at firewall scanner
          const progress = (t * 0.5) % 1.0;
          let target = { x: firewall.x, y: firewall.y };
          if (progress < 0.4) {
            target = {
              x: router.x + (firewall.x - router.x) * (progress / 0.4),
              y: router.y + (firewall.y - router.y) * (progress / 0.4),
            };
          } else if (progress >= 0.7) {
            target = {
              x: firewall.x + (server.x - firewall.x) * ((progress - 0.7) / 0.3),
              y: firewall.y + (server.y - firewall.y) * ((progress - 0.7) / 0.3),
            };
          }
          ctx.beginPath();
          ctx.arc(target.x, target.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0; // Reset shadow
      }

      // Draw nodes
      landmarks.forEach((lm) => {
        const px = lm.pos2D.x * w;
        const py = lm.pos2D.y * h;
        const isHovered = hoveredId === lm.id;
        const isActive = activeLandmark === lm.id;

        if (isHovered || isActive) {
          ctx.fillStyle = "rgba(13, 148, 136, 0.15)";
          ctx.beginPath();
          ctx.arc(px, py, 22, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isActive
          ? "#ffffff"
          : isHovered
          ? "#E0F2FE"
          : "#0D9488";
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#0D9488";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
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
