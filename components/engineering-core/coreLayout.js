/**
 * Shared geometry for the Engineering Core.
 *
 * The 3D scene and the DOM ring both read these, so a node's mesh and its label
 * can never drift apart. Angles come from canonical content (content/domains.ts)
 * and are validated to be unique.
 */

/** Radius of the domain ring in world units. */
export const RING_RADIUS = 2.05;

/**
 * Degrees clockwise from top → a unit vector.
 *
 * Screen-space convention: 0deg is straight up, angles increase clockwise, which
 * is how the DOM ring reads. In world space Y is up, so the sine/cosine are
 * swapped relative to the usual maths convention.
 */
export function angleToUnit(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.sin(rad), y: Math.cos(rad) };
}

/** World-space position of a domain node, in the XY plane. */
export function nodePosition(angleDeg, radius = RING_RADIUS) {
  const { x, y } = angleToUnit(angleDeg);
  return [x * radius, y * radius, 0];
}

/**
 * CSS percentage position for the DOM ring.
 *
 * The DOM ring deliberately sits at a wider radius than the 3D nodes rather than
 * trying to sit exactly on top of them. Pinning HTML to projected 3D coordinates
 * would mean re-projecting every frame and would visibly drift the moment the
 * camera moves. Framing the constellation instead stays correct at any camera
 * position, and keeps the labels as ordinary accessible DOM.
 */
export function ringPercent(angleDeg, radiusPercent = 44) {
  const { x, y } = angleToUnit(angleDeg);
  return {
    left: `${50 + x * radiusPercent}%`,
    // CSS Y grows downward.
    top: `${50 - y * radiusPercent}%`,
  };
}
