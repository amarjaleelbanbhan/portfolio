"use client";

/**
 * A faint concentric ring marking a conceptual layer of the universe.
 * Visualizes the layered architecture of CS (foundation → physical → ... → future)
 * so the map reads as a diagram, not a random galaxy.
 */
export default function RealmOrbit({ radius }: { radius: number }) {
  return (
    <mesh>
      <ringGeometry args={[radius - 0.015, radius + 0.015, 96]} />
      <meshBasicMaterial color="#243044" transparent opacity={0.45} side={2} />
    </mesh>
  );
}
