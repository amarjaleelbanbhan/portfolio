"use client";

import { Stars } from "@react-three/drei";

/** The cosmic backdrop. Count + twinkle scale with device tier / reduced-motion. */
export default function StarField({
  count,
  twinkle,
}: {
  count: number;
  twinkle: boolean;
}) {
  return (
    <Stars
      radius={60}
      depth={40}
      count={count}
      factor={4}
      saturation={0}
      fade
      speed={twinkle ? 0.5 : 0}
    />
  );
}
