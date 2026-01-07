import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Lightweight Three.js cube for a subtle rotating accent
export default function SkillCube() {
  const containerRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const width = containerRef.current?.clientWidth || 280;
    const height = 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
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

    containerRef.current?.appendChild(renderer.domElement);

    const animate = () => {
      cube.rotation.x += 0.0035;
      cube.rotation.y += 0.005;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      geometry.dispose();
      materials.forEach((mat) => mat.dispose());
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-inner shadow-black/30">
      <div ref={containerRef} className="w-full" aria-label="3D rotating skill cube" />
      <p className="text-center text-sm text-slate-300 mt-3">Creative tech stack in motion</p>
    </div>
  );
}
