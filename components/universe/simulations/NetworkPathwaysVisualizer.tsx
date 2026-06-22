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

export default function NetworkPathwaysVisualizer({
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
        case "create":
          drawCreate(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "dns-query":
          drawDns(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "encapsulate":
          drawHandshake(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "route":
          drawRouting(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "firewall":
          drawFirewall(ctx, w, h, t, color, colorSecondary, animate);
          break;
        case "reassemble":
          drawReconstruct(ctx, w, h, t, color, colorSecondary, animate);
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

// ── Step 1: CREATE & ENCAPSULATION ELEVATOR ──
function drawCreate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cycle = 6.0;
  const progress = animate ? (t % cycle) : 0;

  // Draw TCP/IP Layer Elevator bands
  const layers = [
    { name: "Application", y: h * 0.15 },
    { name: "Transport", y: h * 0.4 },
    { name: "Internet", y: h * 0.65 },
    { name: "Physical", y: h * 0.9 },
  ];

  layers.forEach((layer) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, layer.y);
    ctx.lineTo(w, layer.y);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "600 9px var(--font-mono, monospace)";
    ctx.textAlign = "left";
    ctx.fillText(layer.name.toUpperCase(), 10, layer.y - 4);
  });

  const charX = [w * 0.2, w * 0.35, w * 0.5, w * 0.65, w * 0.8];
  const chars = ["H", "E", "L", "L", "O"];

  chars.forEach((char, idx) => {
    let py = layers[0].y;
    let desc = "Payload";
    let isHeader = false;

    if (progress > 1.5 && progress <= 3.0) {
      // Transport Layer: TCP headers added
      py = layers[1].y;
      desc = "TCP Src:443";
      isHeader = true;
    } else if (progress > 3.0 && progress <= 4.5) {
      // Internet Layer: IP headers added
      py = layers[2].y;
      desc = "IP: 93.184.216.34";
      isHeader = true;
    } else if (progress > 4.5) {
      // Physical Layer: converted to signal
      py = layers[3].y;
      desc = "Signal";
    }

    const cx = charX[idx];

    // Draw Packet box
    ctx.fillStyle = isHeader ? colorMix(color, 0.15) : "rgba(255, 255, 255, 0.03)";
    ctx.strokeStyle = isHeader ? color : "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(cx - 30, py - 18, 60, 30);
    ctx.fill();
    ctx.stroke();

    // Data character
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 13px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText(char, cx, py - 4);

    // Envelope header tag details
    ctx.fillStyle = isHeader ? color : "rgba(255, 255, 255, 0.4)";
    ctx.font = "500 8px var(--font-mono, monospace)";
    ctx.fillText(desc, cx, py + 8);
  });
}

// ── Step 2: DNS RECURSIVE DISCOVERY ──
function drawDns(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.15, cy = h * 0.5;
  const rx = w * 0.85;
  const rootY = h * 0.2, tldY = h * 0.5, authY = h * 0.8;

  // Draw Client Node
  ctx.fillStyle = colorMix(color, 0.12);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 10px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText("CLIENT", cx, cy + 4);

  // Draw Hierarchy servers
  const servers = [
    { y: rootY, label: "Root Server (.)" },
    { y: tldY, label: "TLD Server (.com)" },
    { y: authY, label: "Auth Server (example.com)" },
  ];

  servers.forEach((srv) => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.rect(rx - 80, srv.y - 15, 160, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 9px var(--font-mono, monospace)";
    ctx.fillText(srv.label, rx, srv.y + 4);
  });

  if (!animate) return;

  const cycle = 5.0;
  const progress = t % cycle;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  let pulseX = cx;
  let pulseY = cy;
  let labelText = "Querying IP...";

  if (progress < 1.0) {
    // Phase 1: Query Root
    const sub = progress;
    pulseX = lerp(cx, rx - 80, sub);
    pulseY = lerp(cy, rootY, sub);
    labelText = "Root lookup...";
  } else if (progress < 2.0) {
    // Return from Root
    const sub = progress - 1.0;
    pulseX = lerp(rx - 80, cx, sub);
    pulseY = lerp(rootY, cy, sub);
    labelText = "Referral to TLD";
  } else if (progress < 3.0) {
    // Phase 2: Query TLD
    const sub = progress - 2.0;
    pulseX = lerp(cx, rx - 80, sub);
    pulseY = lerp(cy, tldY, sub);
    labelText = "TLD lookup...";
  } else if (progress < 4.0) {
    // Phase 3: Query Auth
    const sub = progress - 3.0;
    pulseX = lerp(cx, rx - 80, sub);
    pulseY = lerp(cy, authY, sub);
    labelText = "Authoritative lookup...";
  } else {
    // Return IP to client
    const sub = progress - 4.0;
    pulseX = lerp(rx - 80, cx, sub);
    pulseY = lerp(authY, cy, sub);
    labelText = "IP Found: 93.184.216.34";
  }

  // Draw query line trace
  ctx.strokeStyle = "rgba(0, 245, 255, 0.2)";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(pulseX, pulseY);
  ctx.stroke();

  // Draw pulse dot
  ctx.fillStyle = "#00F5FF";
  ctx.beginPath();
  ctx.arc(pulseX, pulseY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.font = "600 11px var(--font-mono, monospace)";
  ctx.fillText(labelText, w / 2, h * 0.95);
}

// ── Step 3: THREE-WAY TCP HANDSHAKE ──
function drawHandshake(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.2, rx = w * 0.8, cy = h * 0.5;

  // Draw Client and Server nodes
  const nodes: [number, string][] = [[cx, "CLIENT"], [rx, "SERVER"]];
  nodes.forEach(([x, label]) => {
    ctx.fillStyle = colorMix(color, 0.12);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, cy, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 10px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText(label, x, cy + 4);
  });

  const cycle = 3.0;
  const progress = animate ? (t % cycle) : 0;
  let signalText = "ESTABLISHED";
  let pulseX = cx;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + 24, cy);
  ctx.lineTo(rx - 24, cy);
  ctx.stroke();

  if (progress < 1.0) {
    // SYN: Client -> Server
    pulseX = lerp(cx + 24, rx - 24, progress);
    signalText = "SYN → (Establishing)";
  } else if (progress < 2.0) {
    // SYN-ACK: Server -> Client
    pulseX = lerp(rx - 24, cx + 24, progress - 1.0);
    signalText = "← SYN-ACK (Acknowledging)";
  } else {
    // ACK: Client -> Server
    pulseX = lerp(cx + 24, rx - 24, progress - 2.0);
    signalText = "ACK → (Connected)";
  }

  // Draw packet pulse
  ctx.fillStyle = "#00F5FF";
  ctx.beginPath();
  ctx.arc(pulseX, cy, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.font = "700 12px var(--font-mono, monospace)";
  ctx.fillText(signalText, w / 2, h * 0.85);
}

// ── Step 4: ROUTER PATH DECISION MESH ──
function drawRouting(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const startX = w * 0.1, endX = w * 0.9, cy = h * 0.5;
  const ry1 = h * 0.22, ry2 = h * 0.5, ry3 = h * 0.78;
  const rMidX = w * 0.5;

  // Draw Paths with status tags
  const paths = [
    { name: "Path A (Blocked)", y: ry1, color: "#EF4444", desc: "BLOCKED (Congested Link)" },
    { name: "Path B (Congested)", y: ry2, color: "#F59E0B", desc: "CONGESTED (Packet Delay)" },
    { name: "Path C (Selected)", y: ry3, color: "#22C55E", desc: "SELECTED (Lowest Cost)" },
  ];

  paths.forEach((p) => {
    // draw line
    ctx.strokeStyle = p.color + "30";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, cy);
    ctx.lineTo(rMidX, p.y);
    ctx.lineTo(endX, cy);
    ctx.stroke();

    // label
    ctx.fillStyle = p.color;
    ctx.font = "600 8px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText(p.desc, rMidX, p.y - 8);

    // Node
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.strokeStyle = p.color;
    ctx.beginPath();
    ctx.arc(rMidX, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Client & Server points
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(startX, cy, 12, 0, Math.PI * 2);
  ctx.arc(endX, cy, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (!animate) return;

  // Animate packet along Path C (Selected path at ry3)
  const progress = (t * 0.55) % 1.0;
  let px = startX;
  let py = cy;

  if (progress < 0.5) {
    const local = progress / 0.5;
    px = lerp(startX, rMidX, local);
    py = lerp(cy, ry3, local);
  } else {
    const local = (progress - 0.5) / 0.5;
    px = lerp(rMidX, endX, local);
    py = lerp(ry3, cy, local);
  }

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#22C55E";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(px, py, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

// ── Step 5: FIREWALL SCAN & ACCESS CONTROL ──
function drawFirewall(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cx = w * 0.2, rx = w * 0.8, cy = h * 0.5;
  const firewallX = w * 0.5;

  // Draw Client and Server
  ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.beginPath();
  ctx.arc(cx, cy, 15, 0, Math.PI * 2);
  ctx.arc(rx, cy, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Draw Firewall Scanner line
  ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(firewallX, h * 0.1);
  ctx.lineTo(firewallX, h * 0.9);
  ctx.stroke();

  if (!animate) return;

  const cycle = 4.0;
  const progress = t % cycle;

  let px = cx;
  let statusText = "Scanning Packet...";
  let isScanning = false;
  let activeLaserY = h * 0.1;

  if (progress < 1.2) {
    // Travel to firewall
    const local = progress / 1.2;
    px = lerp(cx, firewallX, local);
    statusText = "Packet approaching...";
  } else if (progress < 2.6) {
    // Pause & scan
    px = firewallX;
    isScanning = true;
    const localScan = (progress - 1.2) / 1.4;
    activeLaserY = lerp(h * 0.15, h * 0.85, Math.abs(Math.sin(localScan * Math.PI * 2)));
    statusText = "INSPECTING HEADERS...";
  } else if (progress < 3.2) {
    // Verifying state
    px = firewallX;
    statusText = "SIGNATURES OK -> ALLOWED";
  } else {
    // Pass to server
    const local = (progress - 3.2) / 0.8;
    px = lerp(firewallX, rx, local);
    statusText = "Packet entering Server Core";
  }

  // Draw packet
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(px, cy, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw laser scan line
  if (isScanning) {
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#EF4444";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(firewallX - 15, activeLaserY);
    ctx.lineTo(firewallX + 15, activeLaserY);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = color;
  ctx.font = "600 11px var(--font-mono, monospace)";
  ctx.textAlign = "center";
  ctx.fillText(statusText, w / 2, h * 0.92);
}

// ── Step 6: SERVER BYTE STREAM RECONSTRUCTION ──
function drawReconstruct(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
  secondary: string,
  animate: boolean
) {
  const cy = h * 0.4;
  const boxesX = [w * 0.22, w * 0.36, w * 0.5, w * 0.64, w * 0.78];
  
  // Unordered characters
  const rawData = ["L", "O", "H", "L", "E"];
  const correctData = ["H", "E", "L", "L", "O"];

  const cycle = 5.0;
  const progress = animate ? (t % cycle) : 0;

  if (progress < 2.5) {
    // Stage 1: Arrive unordered
    rawData.forEach((char, idx) => {
      const cx = boxesX[idx];
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.rect(cx - 20, cy - 20, 40, 40);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 16px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText(char, cx, cy + 6);
    });

    ctx.fillStyle = secondary;
    ctx.font = "600 11px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText("PACKETS ARRIVED UNORDERED (SEQ ENVELOPES)", w / 2, h * 0.85);
  } else if (progress < 4.0) {
    // Stage 2: Reassemble order
    correctData.forEach((char, idx) => {
      const cx = boxesX[idx];
      ctx.fillStyle = colorMix(color, 0.1);
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.rect(cx - 20, cy - 20, 40, 40);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 16px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText(char, cx, cy + 6);
    });

    ctx.fillStyle = color;
    ctx.font = "600 11px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText("TCP BUFFER SORTING BY SEQ ID -> RECONSTRUCTED", w / 2, h * 0.85);
  } else {
    // Stage 3: HTTP 200 OK
    correctData.forEach((char, idx) => {
      const cx = boxesX[idx];
      ctx.fillStyle = "rgba(34, 197, 94, 0.15)";
      ctx.strokeStyle = "#22C55E";
      ctx.beginPath();
      ctx.rect(cx - 20, cy - 20, 40, 40);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 16px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText(char, cx, cy + 6);
    });

    ctx.fillStyle = "#22C55E";
    ctx.font = "700 14px var(--font-mono, monospace)";
    ctx.textAlign = "center";
    ctx.fillText("HTTP 200 OK — CONNECTION COMPLETED", w / 2, h * 0.85);
  }
}
