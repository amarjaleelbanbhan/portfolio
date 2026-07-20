'use client';

import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 90;
const MAX_CONNECT_DIST = 150;
const MOUSE_RADIUS = 140;
const PARALLAX_STRENGTH = 26; // px of drift at full depth

const COLORS = [
  [20, 184, 166],   // neon-cyan
  [34, 197, 94],    // neon-green
  [217, 70, 239],   // neon-magenta
  [20, 184, 166],   // cyan weighted higher
  [20, 184, 166],
];

class Particle {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.w;
    this.y = Math.random() * this.h;
    // Depth: 0 (far, small/slow) → 1 (near, large/fast). Drives size, speed, parallax.
    this.depth = Math.random();
    const speed = 0.18 + this.depth * 0.34;
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    this.baseR = 0.6 + this.depth * 1.9;
    this.r = this.baseR;
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.rgb = c;
    this.alpha = Math.random() * 0.45 + 0.25;
    this.twinkleSpeed = Math.random() * 0.012 + 0.004;
    this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
    // Organic drift phase
    this.phase = Math.random() * Math.PI * 2;
    this.driftAmp = 0.05 + Math.random() * 0.12;
    // Rendered (parallax-adjusted) coords
    this.rx = this.x;
    this.ry = this.y;
  }

  update(mouse, t, px, py) {
    // Gentle organic float layered on top of linear velocity
    this.x += this.vx + Math.sin(t * 0.4 + this.phase) * this.driftAmp;
    this.y += this.vy + Math.cos(t * 0.35 + this.phase) * this.driftAmp;

    if (this.x < 0) { this.x = 0; this.vx *= -1; }
    if (this.x > this.w) { this.x = this.w; this.vx *= -1; }
    if (this.y < 0) { this.y = 0; this.vy *= -1; }
    if (this.y > this.h) { this.y = this.h; this.vy *= -1; }

    // Twinkling
    this.alpha += this.twinkleSpeed * this.twinkleDir;
    if (this.alpha > 0.75) { this.alpha = 0.75; this.twinkleDir = -1; }
    if (this.alpha < 0.1)  { this.alpha = 0.1;  this.twinkleDir = 1;  }

    // Mouse interaction — gentle repulsion
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      const rr = MOUSE_RADIUS * MOUSE_RADIUS;
      if (d2 < rr && d2 > 0) {
        const d = Math.sqrt(d2);
        const force = ((MOUSE_RADIUS - d) / MOUSE_RADIUS) * 0.025;
        this.x += (dx / d) * force * MOUSE_RADIUS;
        this.y += (dy / d) * force * MOUSE_RADIUS;
      }
    }

    // Depth parallax (render-only offset; keeps sim stable)
    this.rx = this.x + px * this.depth;
    this.ry = this.y + py * this.depth;
  }

  draw(ctx) {
    const [r, g, b] = this.rgb;
    ctx.beginPath();
    ctx.arc(this.rx, this.ry, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
    ctx.fill();

    // Soft glow
    const grad = ctx.createRadialGradient(this.rx, this.ry, 0, this.rx, this.ry, this.r * 4);
    grad.addColorStop(0, `rgba(${r},${g},${b},${this.alpha * 0.4})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.rx, this.ry, this.r * 4, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

export default function ParticleNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId;
    let particles = [];
    let cssW = 0;
    let cssH = 0;
    let running = true;
    const mouse = { x: null, y: null };
    // Smoothed parallax offset (eased toward pointer)
    const par = { x: 0, y: 0, tx: 0, ty: 0 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(cssW, cssH));
    }

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Parallax target: pointer offset from viewport center, normalized
      par.tx = ((e.clientX / cssW) - 0.5) * -PARALLAX_STRENGTH;
      par.ty = ((e.clientY / cssH) - 0.5) * -PARALLAX_STRENGTH;
    }
    function onMouseLeave() {
      mouse.x = null;
      mouse.y = null;
      par.tx = 0;
      par.ty = 0;
    }

    // Debounced resize to avoid mobile URL-bar thrash
    let resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }

    resize();
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.rx - b.rx;
          const dy = a.ry - b.ry;
          const d2 = dx * dx + dy * dy;

          if (d2 < MAX_CONNECT_DIST * MAX_CONNECT_DIST) {
            const d = Math.sqrt(d2);
            const opacity = (1 - d / MAX_CONNECT_DIST) * 0.22;
            const [r, g, bb] = a.rgb;
            ctx.beginPath();
            ctx.moveTo(a.rx, a.ry);
            ctx.lineTo(b.rx, b.ry);
            ctx.strokeStyle = `rgba(${r},${g},${bb},${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    // Mouse-to-nearby particle connections
    function drawMouseConnections() {
      if (mouse.x === null) return;
      for (const p of particles) {
        const dx = p.rx - mouse.x;
        const dy = p.ry - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_RADIUS) {
          const opacity = (1 - d / MOUSE_RADIUS) * 0.5;
          const [r, g, b] = p.rgb;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.rx, p.ry);
          ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    function renderFrame(t) {
      // Ease parallax toward target for buttery motion
      par.x += (par.tx - par.x) * 0.06;
      par.y += (par.ty - par.y) * 0.06;
      ctx.clearRect(0, 0, cssW, cssH);
      for (const p of particles) { p.update(mouse, t, par.x, par.y); p.draw(ctx); }
      drawConnections();
      drawMouseConnections();
    }

    function animate(now) {
      const t = now / 1000;
      renderFrame(t);
      animId = requestAnimationFrame(animate);
    }

    if (reduceMotion) {
      // Single static frame — no animation loop, no motion.
      for (const p of particles) { p.rx = p.x; p.ry = p.y; }
      renderFrame(0);
    } else {
      animId = requestAnimationFrame(animate);
    }

    // Pause the loop when the tab is hidden (saves battery/CPU)
    function onVisibility() {
      if (document.hidden) {
        if (running && !reduceMotion) { cancelAnimationFrame(animId); running = false; }
      } else if (!running && !reduceMotion) {
        running = true;
        animId = requestAnimationFrame(animate);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
