'use client';

import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 90;
const MAX_CONNECT_DIST = 150;
const MOUSE_RADIUS = 140;

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
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.baseR = Math.random() * 1.8 + 0.6;
    this.r = this.baseR;
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.rgb = c;
    this.alpha = Math.random() * 0.45 + 0.25;
    this.twinkleSpeed = Math.random() * 0.012 + 0.004;
    this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
  }

  update(mouse) {
    this.x += this.vx;
    this.y += this.vy;

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
  }

  draw(ctx) {
    const [r, g, b] = this.rgb;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
    ctx.fill();

    // Soft glow
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 4);
    grad.addColorStop(0, `rgba(${r},${g},${b},${this.alpha * 0.4})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
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
    let animId;
    let particles = [];
    const mouse = { x: null, y: null };

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(canvas.width, canvas.height));
    }

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onMouseLeave() {
      mouse.x = null;
      mouse.y = null;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d2 = dx * dx + dy * dy;

          if (d2 < MAX_CONNECT_DIST * MAX_CONNECT_DIST) {
            const d = Math.sqrt(d2);
            const opacity = (1 - d / MAX_CONNECT_DIST) * 0.22;
            const [r, g, b] = particles[i].rgb;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
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
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_RADIUS) {
          const opacity = (1 - d / MOUSE_RADIUS) * 0.5;
          const [r, g, b] = p.rgb;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) { p.update(mouse); p.draw(ctx); }
      drawConnections();
      drawMouseConnections();
      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
