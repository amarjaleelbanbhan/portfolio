import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import useDeviceTier from '@/lib/useDeviceTier';
import useInViewport from '@/lib/useInViewport';

// Lightweight Three.js cube for a subtle rotating accent.
//
// Phase 3 wired this through the shared capability infrastructure without
// changing what it looks like on a capable device: the scene, materials,
// lighting and rotation speeds are untouched. What changed is that it no longer
// runs a render loop unconditionally — it pauses off-screen and on hidden tabs,
// caps pixel ratio on weaker hardware, and draws a single static frame when the
// visitor has asked for reduced motion.
export default function SkillCube() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const [viewportRef, inViewport] = useInViewport();
  const { tier, shouldAnimate } = useDeviceTier();

  // Read live values inside the animation loop without re-creating the scene
  // every time they change. Written in an effect, not during render, because a
  // ref is not render state.
  const stateRef = useRef({ inViewport: true, shouldAnimate: true });
  useEffect(() => {
    stateRef.current = { inViewport, shouldAnimate };
  }, [inViewport, shouldAnimate]);

  // Pixel ratio is the single biggest cost on high-DPR phones; uncapped it
  // renders 3-4x the pixels for no visible gain at this size.
  const maxDpr = tier >= 2 ? 2 : tier === 1 ? 1.5 : 1;

  useEffect(() => {
    // Capture the node now so cleanup detaches from the same element even if
    // the ref has already been cleared by the time it runs.
    const container = containerRef.current;
    const width = container?.clientWidth || 280;
    const height = 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    renderer.setClearColor(0x000000, 0);

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = [
      new THREE.MeshStandardMaterial({ color: '#14b8a6', roughness: 0.3, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.3, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: '#0ea5e9', roughness: 0.3, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: '#22d3ee', roughness: 0.3, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: '#2dd4bf', roughness: 0.3, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: '#06b6d4', roughness: 0.3, metalness: 0.1 }),
    ];
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    const light = new THREE.PointLight('#ffffff', 1.4);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight('#ffffff', 0.35);
    scene.add(ambient);

    renderer.domElement.style.maxWidth = '100%';
    container?.appendChild(renderer.domElement);

    const animate = () => {
      const { inViewport: visible, shouldAnimate: animating } = stateRef.current;
      // Keep the loop alive but skip the work: cheaper than tearing the RAF
      // down and rebuilding it every time the cube scrolls past.
      if (visible && animating && !document.hidden) {
        cube.rotation.x += 0.0035;
        cube.rotation.y += 0.005;
        renderer.render(scene, camera);
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    if (stateRef.current.shouldAnimate) {
      animate();
    } else {
      // Reduced motion or a minimal-tier device: one frame, no loop. The cube
      // is still visible and still 3D, it simply does not spin.
      renderer.render(scene, camera);
    }

    // The canvas was sized once at mount, so rotating a phone or opening a
    // desktop pane left it at its old width — wider than its container, which
    // pushed the page into horizontal overflow. Resize the renderer and fix the
    // camera aspect instead of letting CSS squash the projection.
    const onResize = () => {
      const nextWidth = container?.clientWidth;
      if (!nextWidth) return;
      camera.aspect = nextWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, height);
      if (!stateRef.current.shouldAnimate) renderer.render(scene, camera);
    };
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (container && observer) observer.observe(container);
    window.addEventListener('resize', onResize);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      observer?.disconnect();
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      materials.forEach((mat) => mat.dispose());
      container?.removeChild(renderer.domElement);
    };
  }, [maxDpr]);

  return (
    <div
      ref={viewportRef}
      // `overflow-hidden` is load-bearing. A grid or flex item's automatic
      // minimum size is its content, so the canvas — sized in pixels at mount —
      // stopped this box from ever shrinking, which meant the container never
      // got narrower, the resize observer never fired, and the page overflowed
      // sideways after a rotation. Anything other than `overflow: visible`
      // sets that automatic minimum to zero, so the box can shrink, which is
      // what lets the observer below do its job at all.
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-inner shadow-black/30 overflow-hidden"
    >
      <div ref={containerRef} className="w-full min-w-0" aria-hidden="true" />
      <p className="text-center text-sm text-slate-300 mt-3">Creative tech stack in motion</p>
    </div>
  );
}
