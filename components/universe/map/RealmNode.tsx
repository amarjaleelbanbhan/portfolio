"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { RealmPlacement } from "./realmLayout";

/**
 * RealmNode — renders a specialized digital planet / energy core for each realm type:
 *   - Architect's Core: Pulsing energy sun with a soft halo.
 *   - Silicon Foundry: Metallic core surrounded by active spinning circuit rings.
 *   - Neural Nebula: Glow core with an outer wireframe shell pulsing in scale.
 *   - The Citadel: Faceted icosahedron surrounded by orbiting protective shield plates.
 *   - Data Archives: Nest of three rotated semi-transparent database cubes.
 *   - Code Helix: Double-helix inspired vertical column with moving rings.
 *   - Generic: Clean energy core that adopts the realm's primary color.
 */
export default function RealmNode({
  placement,
  appearDelay,
  reduced,
  active,
  onHover,
  onSelect,
}: {
  placement: RealmPlacement;
  appearDelay: number;
  reduced: boolean;
  active: boolean;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}) {
  const grp = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const t = useRef(0);

  // References for specialized sub-meshes
  const subGroup1 = useRef<THREE.Group>(null);
  const subGroup2 = useRef<THREE.Group>(null);
  const subMesh1 = useRef<THREE.Mesh>(null);
  const subMesh2 = useRef<THREE.Mesh>(null);

  const { slug } = placement;
  const isCore = slug === "architect-core";
  const isFoundry = slug === "silicon-foundry";
  const isFoundations = slug === "the-foundations";
  const isHelix = slug === "code-helix";
  const isNebula = slug === "neural-nebula";
  const isCitadel = slug === "the-citadel";
  const isArchives = slug === "data-archives";

  // Size hierarchy based on realm category
  const baseScale = isCore ? 1.45 : isFoundry || isNebula || isCitadel || isHelix || isArchives ? 0.85 : 0.65;
  const color = placement.realm.colors.primary;
  const [bx, by, bz] = placement.position;

  useFrame((_, delta) => {
    t.current += delta;
    const g = grp.current;
    if (!g) return;

    // Staggered arrival scale-in
    const appear = reduced
      ? 1
      : THREE.MathUtils.clamp((t.current - appearDelay) / 0.6, 0, 1);
    const ease = 1 - Math.pow(1 - appear, 3);
    const hover = active ? 1.35 : 1;
    g.scale.setScalar(baseScale * ease * hover);

    // Gentler bobbing offset
    g.position.set(
      bx,
      reduced ? by : by + Math.sin(t.current * 0.75 + appearDelay * 4.5) * 0.08,
      bz
    );

    if (mat.current) {
      const target = active ? 1.8 : isCore ? 1.1 : 0.6;
      mat.current.emissiveIntensity += (target - mat.current.emissiveIntensity) * 0.15;
    }

    // Animate specialized meshes
    if (reduced) return;

    if (isFoundry) {
      // Rotate motherboard circuit rings
      if (subMesh1.current) subMesh1.current.rotation.x += delta * 0.6;
      if (subMesh2.current) subMesh2.current.rotation.y += delta * 0.4;
    } else if (isNebula) {
      // Pulse neural wireframe and rotate
      if (subGroup1.current) {
        subGroup1.current.rotation.y += delta * 0.35;
        const pulse = 1.25 + Math.sin(t.current * 2.5) * 0.06;
        subGroup1.current.scale.setScalar(pulse);
      }
    } else if (isCitadel) {
      // Rotate protective shield panels
      if (subGroup1.current) {
        subGroup1.current.rotation.y += delta * 0.5;
        subGroup1.current.rotation.x += delta * 0.25;
      }
    } else if (isArchives) {
      // Counter-rotate the nested cubes
      if (subMesh1.current) {
        subMesh1.current.rotation.y += delta * 0.3;
        subMesh1.current.rotation.x += delta * 0.15;
      }
      if (subMesh2.current) {
        subMesh2.current.rotation.y -= delta * 0.25;
        subMesh2.current.rotation.z += delta * 0.2;
      }
    } else if (isHelix) {
      // Slide helical rings up and down the tower
      if (subGroup1.current) subGroup1.current.rotation.y += delta * 0.5;
      if (subMesh1.current) subMesh1.current.position.y = Math.sin(t.current * 2) * 0.6;
      if (subMesh2.current) subMesh2.current.position.y = -Math.sin(t.current * 2) * 0.6;
    } else {
      // Slow orbital rotate for generic energy cores
      if (subGroup1.current) subGroup1.current.rotation.y += delta * 0.2;
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(placement.slug);
    document.body.style.cursor = "pointer";
  };
  const out = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(null);
    document.body.style.cursor = "auto";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(placement.slug);
  };

  const renderVisualNode = () => {
    if (isCore) {
      return (
        <group>
          {/* Central sun core */}
          <mesh>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial
              ref={mat}
              color={color}
              emissive={color}
              emissiveIntensity={1.0}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          {/* Star flare halo */}
          <mesh scale={1.38}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={active ? 0.35 : 0.15}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      );
    }

    if (isFoundry) {
      return (
        <group>
          {/* Mechanical base planet */}
          <mesh>
            <icosahedronGeometry args={[0.7, 1]} />
            <meshStandardMaterial
              ref={mat}
              color="#2a302e"
              emissive={color}
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
          {/* Inner glowing core */}
          <mesh scale={0.4}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial color={color} />
          </mesh>
          {/* Circuit Ring A */}
          <mesh ref={subMesh1} rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.15, 0.024, 6, 24]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>
          {/* Circuit Ring B */}
          <mesh ref={subMesh2} rotation={[0, Math.PI / 4, Math.PI / 2]}>
            <torusGeometry args={[1.4, 0.016, 6, 24]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} />
          </mesh>
        </group>
      );
    }

    if (isNebula) {
      return (
        <group>
          {/* Internal energy center */}
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
              ref={mat}
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              roughness={0.4}
            />
          </mesh>
          {/* Orbiting neural wireframe net */}
          <group ref={subGroup1}>
            <mesh>
              <sphereGeometry args={[0.9, 12, 12]} />
              <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
            </mesh>
          </group>
        </group>
      );
    }

    if (isCitadel) {
      return (
        <group>
          {/* Faceted core */}
          <mesh>
            <icosahedronGeometry args={[0.75, 1]} />
            <meshStandardMaterial
              ref={mat}
              color="#1B221E"
              emissive={color}
              emissiveIntensity={0.5}
              roughness={0.15}
              metalness={0.8}
            />
          </mesh>
          {/* Orbiting protective shield panel group */}
          <group ref={subGroup1}>
            <mesh position={[1.1, 0, 0]}>
              <boxGeometry args={[0.08, 0.4, 0.25]} />
              <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>
            <mesh position={[-1.1, 0, 0]}>
              <boxGeometry args={[0.08, 0.4, 0.25]} />
              <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, 0, 1.1]}>
              <boxGeometry args={[0.25, 0.4, 0.08]} />
              <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>
          </group>
        </group>
      );
    }

    if (isArchives) {
      return (
        <group>
          {/* Outer database cube 1 */}
          <mesh ref={subMesh1}>
            <boxGeometry args={[0.85, 0.85, 0.85]} />
            <meshStandardMaterial
              ref={mat}
              color={color}
              roughness={0.3}
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
          {/* Inner database cube 2 */}
          <mesh ref={subMesh2}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              roughness={0.2}
              transparent
              opacity={0.6}
            />
          </mesh>
          {/* Glowing central core unit */}
          <mesh scale={0.25}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      );
    }

    if (isHelix) {
      return (
        <group ref={subGroup1}>
          {/* Core code spires */}
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 1.6, 6]} />
            <meshStandardMaterial
              ref={mat}
              color="#13101E"
              emissive={color}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
          {/* Moving code-ring A */}
          <mesh ref={subMesh1}>
            <torusGeometry args={[0.6, 0.03, 4, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
          </mesh>
          {/* Moving code-ring B */}
          <mesh ref={subMesh2}>
            <torusGeometry args={[0.5, 0.03, 4, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        </group>
      );
    }

    // Generic standard core (For remaining connective/structural realms)
    return (
      <group ref={subGroup1}>
        <mesh>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial
            ref={mat}
            color={color}
            emissive={color}
            emissiveIntensity={0.55}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
        <mesh scale={1.22}>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={active ? 0.22 : 0.08}
            depthWrite={false}
          />
        </mesh>
      </group>
    );
  };

  return (
    <group
      ref={grp}
      position={placement.position}
      onPointerOver={over}
      onPointerOut={out}
      onClick={click}
    >
      {renderVisualNode()}
    </group>
  );
}
