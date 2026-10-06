import { useEffect, useRef } from 'react';

// All artwork uses this coordinate system. Resize changes only the final camera matrix.
const W = 1280;
const H = 720;
const DESK_X = 700;
const HIP_Y = 570;
const SHOULDER = { x: DESK_X + 15, y: 360 };
const MONITOR = { x: 780, y: 174, w: 310, h: 294 };
const SCREEN = { x: 802, y: 199, w: 266, h: 226 };
const POWER = { x: 1053, y: 449 };
const ARM = { upper: 180, lower: 180 };
const BOOT_TEXT = [
  'AMAR JALEEL  /  PORTFOLIO',
  '> display: online',
  '> React: interface ready',
  '> Next.js: routes ready',
  '> Canvas: scene rendered',
  '> portfolio: open',
].join('\n');
const WALK_MS = 2200;
const REACH_MS = 850;
const BOOT_MS = 2050;
const ZOOM_MS = 1050;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

// Two-link inverse kinematics. The law of cosines determines the shoulder
// offset; the elbow bends upward and the final segment ends exactly at target.
function solveIK(root, target, upper, lower) {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const distance = Math.hypot(dx, dy);
  const d = clamp(distance, Math.abs(upper - lower) + 0.0001, upper + lower);
  const heading = Math.atan2(dy, dx);
  const offset = Math.acos(clamp((d * d + upper * upper - lower * lower) / (2 * d * upper), -1, 1));
  const elbow = { x: root.x + Math.cos(heading - offset) * upper,
    y: root.y + Math.sin(heading - offset) * upper };
  const hand = distance <= upper + lower ? target :
    { x: root.x + Math.cos(heading) * d, y: root.y + Math.sin(heading) * d };
  return { elbow, hand };
}

function line(ctx, points, width, color) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  ctx.stroke();
}
function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function ellipse(ctx, x, y, rx, ry, color) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
function polygon(ctx, points, color) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawRoom(ctx, t) {
  const wall = ctx.createLinearGradient(0, 0, W, H);
  wall.addColorStop(0, '#08152b'); wall.addColorStop(0.6, '#122c49'); wall.addColorStop(1, '#071423');
  rect(ctx, 0, 0, W, H, wall);
  polygon(ctx, [[0, 530], [W, 498], [W, H], [0, H]], '#102031');
  for (let x = 0; x < W; x += 86) line(ctx, [{ x, y: 520 }, { x: x * 1.2 - 100, y: H }], 1, '#34516a30');
  // Window and distant skyline stay fixed while the camera moves.
  rect(ctx, 62, 76, 395, 304, '#061425');
  rect(ctx, 78, 91, 363, 274, '#123753');
  rect(ctx, 250, 91, 8, 274, '#0a1828');
  rect(ctx, 78, 252, 363, 7, '#0a1828');
  for (let i = 0; i < 8; i++) rect(ctx, 84 + i * 46, 271 - (i % 3) * 25, 27, 94, '#0b2439');
  const glow = ctx.createRadialGradient(353, 183, 5, 353, 183, 340);
  glow.addColorStop(0, '#b9764e55'); glow.addColorStop(1, '#b9764e00');
  rect(ctx, 0, 0, 620, 540, glow);
  // Lamp and its warm pool of light.
  line(ctx, [{ x: 530, y: 463 }, { x: 541, y: 246 }, { x: 625, y: 177 }], 8, '#172236');
  polygon(ctx, [[575, 174], [677, 166], [704, 220], [568, 224]], '#ddab70');
  ellipse(ctx, 625, 221, 61, 9, '#ffd4a2');
  ellipse(ctx, 520, 471, 60, 9, '#1b2637');
  // A slow ambient pulse gives the static room life without timers.
  const ambient = 0.06 + 0.02 * Math.sin(t * 0.0012);
  rect(ctx, 0, 0, W, H, `rgba(51,172,192,${ambient})`);
}

function drawLegs(ctx, x, phase, walking) {
  for (let side = -1; side <= 1; side += 2) {
    const hip = { x: x + side * 18, y: HIP_Y };
    // Opposite sine phases make the legs alternate. Positive swing lifts a foot.
    const swing = walking ? Math.sin(phase + (side > 0 ? Math.PI : 0)) : 0;
    const foot = { x: hip.x + side * 15 + swing * 48,
      y: 678 - (walking ? Math.max(0, swing) * 27 : 0) };
    const knee = solveIK(hip, foot, 89, 91).elbow;
    line(ctx, [hip, knee, foot], 31, side < 0 ? '#142b50' : '#203d70');
    line(ctx, [foot, { x: foot.x + 25, y: foot.y + 1 }], 17, '#07101e');
  }
}

function drawPerson(ctx, x, phase, walking, reach) {
  const bob = walking ? Math.abs(Math.sin(phase)) * 6 : 0;
  const s = { x: x + 15, y: SHOULDER.y - bob };
  const rest = { x: s.x + 65, y: s.y + 155 };
  const target = { x: lerp(rest.x, POWER.x, smooth(reach)),
    y: lerp(rest.y, POWER.y, smooth(reach)) };
  const arm = solveIK(s, target, ARM.upper, ARM.lower);
  // Torso, collar and head are attached to one world-space root.
  polygon(ctx, [[x - 43, s.y + 8], [x + 40, s.y + 6], [x + 54, HIP_Y], [x - 56, HIP_Y]], '#193660');
  polygon(ctx, [[x - 10, s.y + 8], [x + 20, s.y + 8], [x + 11, s.y + 92], [x - 17, s.y + 91]], '#f3e9df');
  polygon(ctx, [[x - 39, s.y + 12], [x - 5, s.y + 62], [x - 18, s.y + 108]], '#315487');
  polygon(ctx, [[x + 37, s.y + 12], [x + 3, s.y + 62], [x + 16, s.y + 108]], '#274b7e');
  // Rear arm has a small walking swing; the front arm follows IK to the button.
  const rearSwing = walking ? Math.sin(phase) * 24 : 0;
  line(ctx, [{ x: x - 36, y: s.y + 15 }, { x: x - 49 + rearSwing, y: s.y + 103 },
    { x: x - 28 + rearSwing, y: s.y + 176 }], 27, '#112a50');
  ellipse(ctx, x - 28 + rearSwing, s.y + 180, 14, 19, '#d69a7c');
  line(ctx, [s, arm.elbow, arm.hand], 34, '#254878');
  line(ctx, [arm.elbow, arm.hand], 26, '#1b3b69');
  ellipse(ctx, arm.hand.x, arm.hand.y, 13, 12, '#e5a98b');
  if (reach > 0.98) line(ctx, [arm.hand, POWER], 5, '#f4c6a5');
  // Stylized likeness: swept dark hair, warm skin, and black glasses.
  ellipse(ctx, x + 3, s.y - 76, 41, 51, '#d9a083');
  ellipse(ctx, x + 9, s.y - 119, 44, 24, '#111723');
  for (let i = 0; i < 5; i++) line(ctx,
    [{ x: x - 26 + i * 13, y: s.y - 114 }, { x: x - 8 + i * 12, y: s.y - 136 - (i % 2) * 5 }],
    8, '#1b1b25');
  ctx.strokeStyle = '#121b2a'; ctx.lineWidth = 4;
  ctx.strokeRect(x - 29, s.y - 91, 28, 17);
  ctx.strokeRect(x + 5, s.y - 91, 28, 17);
  line(ctx, [{ x: x - 1, y: s.y - 84 }, { x: x + 5, y: s.y - 84 }], 3, '#121b2a');
  line(ctx, [{ x: x - 4, y: s.y - 57 }, { x: x + 17, y: s.y - 55 }], 2, '#8d5349');
  return arm.hand;
}

function drawDeskAndMonitor(ctx, powered, elapsed, timestamp) {
  polygon(ctx, [[626, 520], [W, 505], [W, 551], [626, 565]], '#b77848');
  polygon(ctx, [[626, 565], [W, 551], [W, 640], [626, 647]], '#563a33');
  line(ctx, [{ x: 700, y: 640 }, { x: 700, y: H }], 24, '#302c34');
  line(ctx, [{ x: 1190, y: 638 }, { x: 1190, y: H }], 24, '#302c34');
  // Fixed screen geometry is shared with the camera and the contact target.
  rect(ctx, MONITOR.x + 118, MONITOR.y + MONITOR.h, 49, 57, '#101b2c');
  ellipse(ctx, MONITOR.x + 145, MONITOR.y + MONITOR.h + 62, 109, 12, '#111c2c');
  rect(ctx, MONITOR.x, MONITOR.y, MONITOR.w, MONITOR.h, '#09111e');
  rect(ctx, MONITOR.x + 12, MONITOR.y + 12, MONITOR.w - 24, MONITOR.h - 24, '#26384a');
  rect(ctx, SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, powered ? '#061b22' : '#020812');
  if (powered) {
    const light = ctx.createRadialGradient(934, 308, 5, 934, 308, 190);
    light.addColorStop(0, '#174e47'); light.addColorStop(1, '#061b22');
    rect(ctx, SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, light);
    ctx.save();
    ctx.beginPath(); ctx.rect(SCREEN.x + 5, SCREEN.y + 5, SCREEN.w - 10, SCREEN.h - 10); ctx.clip();
    for (let y = SCREEN.y + 2; y < SCREEN.y + SCREEN.h; y += 5) {
      rect(ctx, SCREEN.x, y, SCREEN.w, 1, '#a3ffe014');
    }
    const count = clamp(Math.floor(elapsed * 0.075), 0, BOOT_TEXT.length);
    const lines = BOOT_TEXT.slice(0, count).split('\n');
    ctx.font = '14px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = '#8dffcd'; ctx.shadowColor = '#51ffc1'; ctx.shadowBlur = 10;
    for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], SCREEN.x + 14, SCREEN.y + 29 + i * 27);
    if (Math.floor(timestamp / 320) % 2 === 0) ctx.fillText('▮', SCREEN.x + 14 + ctx.measureText(lines.at(-1) || '').width, SCREEN.y + 29 + (lines.length - 1) * 27);
    ctx.restore();
  }
  rect(ctx, MONITOR.x + 10, MONITOR.y + MONITOR.h - 34, MONITOR.w - 20, 22, '#101b2a');
  ellipse(ctx, POWER.x, POWER.y, 10, 10, powered ? '#53efd2' : '#34495b');
  ellipse(ctx, POWER.x, POWER.y, 4, 4, powered ? '#e0fff4' : '#101923');
}

export default function LoadingScreen({ onComplete }) {
  const canvasRef = useRef(null);
  const skipRef = useRef(null);
  const callbackRef = useRef(onComplete);
  const finishedRef = useRef(false);
  const finishRef = useRef(() => {});
  useEffect(() => { callbackRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) {
      if (!finishedRef.current) { finishedRef.current = true; callbackRef.current(); }
      return undefined;
    }
    let frame = 0;
    let active = true;
    let state = 'WALKING';
    let stateStart = null;
    let origin = null;
    let sceneTime = 0;
    let metrics = null;
    const measure = () => {
      const width = window.innerWidth, height = window.innerHeight;
      // Limit the backing store to roughly eight million pixels on large screens.
      const dpr = Math.min(window.devicePixelRatio || 1, 2,
        Math.max(0.5, Math.sqrt(8_000_000 / (width * height))));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const portrait = width < 640 && height > width;
      const fit = portrait ? Math.max(width / 500, height / H * 0.82) : Math.min(width / W, height / H);
      metrics = { width, height, dpr, fit, portrait };
    };
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      active = false;
      cancelAnimationFrame(frame);
      callbackRef.current();
    };
    finishRef.current = finish;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return () => { active = false; };
    }
    measure();
    window.addEventListener('resize', measure, { passive: true });
    skipRef.current?.focus({ preventScroll: true });
    const onKey = (event) => {
      if (event.key === 'Escape') finish();
      if (event.key === 'Tab') { event.preventDefault(); skipRef.current?.focus({ preventScroll: true }); }
    };
    window.addEventListener('keydown', onKey);

    const render = (timestamp) => {
      if (!active) return;
      if (origin === null) origin = timestamp;
      if (stateStart === null) stateStart = timestamp;
      const elapsed = timestamp - stateStart;
      sceneTime = timestamp - origin;
      let walk = 1, reach = 0, bootElapsed = 0, zoom = 0;
      if (state === 'WALKING') {
        walk = clamp(elapsed / WALK_MS, 0, 1);
        // Reaching starts only when the root is at the desk's exact world x.
        if (walk === 1) { state = 'REACHING'; stateStart = timestamp; }
      } else if (state === 'REACHING') {
        reach = clamp(elapsed / REACH_MS, 0, 1);
        const target = { x: lerp(SHOULDER.x + 65, POWER.x, smooth(reach)),
          y: lerp(SHOULDER.y + 155, POWER.y, smooth(reach)) };
        const { hand } = solveIK(SHOULDER, target, ARM.upper, ARM.lower);
        // Contact is based on the rendered IK endpoint, not the desired target.
        if (Math.hypot(hand.x - POWER.x, hand.y - POWER.y) <= 0.000001) {
          state = 'BOOTING'; stateStart = timestamp;
        }
      } else if (state === 'BOOTING') {
        bootElapsed = elapsed;
        if (elapsed >= BOOT_MS) { state = 'ZOOMING'; stateStart = timestamp; }
      } else {
        zoom = clamp(elapsed / ZOOM_MS, 0, 1);
      }
      const { width, height, dpr, fit, portrait } = metrics;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rect(ctx, 0, 0, width, height, '#030914');
      const eased = smooth(zoom);
      // Camera target is the exact screen center. Scale until the screen rectangle
      // exceeds both viewport dimensions, then hand control to the real page.
      const screenCx = SCREEN.x + SCREEN.w / 2;
      const screenCy = SCREEN.y + SCREEN.h / 2;
      const fill = Math.max(width / (SCREEN.w * fit), height / (SCREEN.h * fit)) * 1.04;
      const scale = fit * lerp(1, fill, eased);
      const x = lerp(245, DESK_X, smooth(walk));
      // Portrait view follows the character; the desktop view keeps the entire set.
      const baseCx = portrait ? clamp(x + 150, 390, 860) : W / 2;
      const cx = lerp(baseCx, screenCx, eased);
      const cy = lerp(H / 2, screenCy, eased);
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-cx, -cy);
      drawRoom(ctx, sceneTime);
      const walking = state === 'WALKING';
      const phase = (sceneTime * 0.0023) * Math.PI * 2;
      drawLegs(ctx, x, phase, walking);
      drawDeskAndMonitor(ctx, state === 'BOOTING' || state === 'ZOOMING', state === 'ZOOMING' ? BOOT_MS : bootElapsed, sceneTime);
      // Render the arm over the bezel so the point of contact remains visible.
      drawPerson(ctx, x, phase, walking, state === 'REACHING' ? reach : state === 'WALKING' ? 0 : 1);
      if (state === 'ZOOMING' && zoom === 1) { finish(); return; }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div role="dialog" aria-modal="true" aria-label="Portfolio opening"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#030914', overflow: 'hidden' }}>
      <canvas ref={canvasRef} aria-hidden="true"
        style={{ display: 'block', width: '100%', height: '100%' }} />
      <button ref={skipRef} type="button" onClick={() => finishRef.current()}
        style={{ position: 'absolute', top: 20, right: 20, minHeight: 44, padding: '10px 18px',
          border: '1px solid #70dac4', borderRadius: 24, background: '#071a2c', color: '#eafff9',
          font: '600 14px system-ui, sans-serif', cursor: 'pointer' }}>
        Skip intro
      </button>
    </div>
  );
}
