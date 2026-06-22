"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useUniverseStore } from "@/store/universeStore";
import {
  quickDeviceTier,
  supportsWebGL,
  prefersReducedMotion as detectReduced,
  type DeviceTier,
} from "@/lib/deviceTier";
import { PLACEMENT_BY_SLUG } from "./realmLayout";
import RealmInfoCard from "./RealmInfoCard";
import RealmIndex from "./RealmIndex";
import UniverseMap2D from "./UniverseMap2D";
import styles from "./UniverseMap.module.css";

// R3F cannot render on the server — load the 3D scene client-only.
const UniverseCanvas = dynamic(() => import("./UniverseCanvas"), {
  ssr: false,
  loading: () => <div className={styles.canvasSkeleton} aria-hidden="true" />,
});

/**
 * The Universe Map (canon doc 2 Act 3 / doc 4). Picks the 3D scene or the 2D
 * fallback by device tier / WebGL support, drives hover + travel-prep state,
 * and overlays the info card + accessible realm index. Phase 2 prepares the
 * travel state only — realm interiors arrive later.
 */
export default function UniverseMap({ onReplay }: { onReplay?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [tier, setTier] = useState<DeviceTier>(2);
  const [webgl, setWebgl] = useState(true);
  const [zoomingTo, setZoomingTo] = useState<string | null>(null);

  // hover lives in the store so NEXUS can react to it too
  const hovered = useUniverseStore((s) => s.hoveredRealm);
  const setHovered = useUniverseStore((s) => s.hoverRealm);
  const selected = useUniverseStore((s) => s.selectedRealm);
  const selectRealm = useUniverseStore((s) => s.selectRealm);
  const enterRealm = useUniverseStore((s) => s.enterRealm);
  const setDeviceProfile = useUniverseStore((s) => s.setDeviceProfile);

  useEffect(() => {
    const r = detectReduced();
    const t = quickDeviceTier();
    const gl = supportsWebGL();
    setReduced(r);
    setTier(t);
    setWebgl(gl);
    setDeviceProfile({ deviceTier: t, webglSupported: gl, prefersReducedMotion: r });
    setMounted(true);
  }, [setDeviceProfile]);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, background: "var(--void)" }}
      />
    );
  }

  const active = hovered ?? selected;
  const use3D = webgl && tier > 0;
  const selectedName = selected ? PLACEMENT_BY_SLUG[selected]?.realm.name : null;

  const handleEnterRealm = (slug: string) => {
    if (use3D && !reduced) {
      setZoomingTo(slug);
    } else {
      enterRealm(slug);
    }
  };

  return (
    <main
      className={`${styles.map} ${zoomingTo ? styles.zooming : ""}`}
      aria-label="CODEX INFINITUM universe map"
    >
      <div className={styles.scene}>
        {use3D ? (
          <div className={styles.canvasHolder} aria-hidden="true">
            <UniverseCanvas
              tier={tier}
              reduced={reduced}
              hovered={hovered}
              selected={selected}
              zoomingTo={zoomingTo}
              onHover={setHovered}
              onSelect={(slug) => selectRealm(slug)}
              onZoomComplete={() => enterRealm(zoomingTo!)}
            />
          </div>
        ) : (
          <UniverseMap2D
            active={active}
            onHover={setHovered}
            onSelect={(slug) => selectRealm(slug)}
          />
        )}
      </div>

      {/* Chrome */}
      <header className={styles.statusBar}>
        <span className={styles.brand}>CODEX INFINITUM</span>
        <span className={styles.sep}>·</span>
        <span className={styles.where}>UNIVERSE MAP</span>
        {onReplay && (
          <button type="button" className={styles.replay} onClick={onReplay}>
            ↻ replay boot
          </button>
        )}
      </header>

      <RealmIndex active={active} onHover={setHovered} onSelect={(slug) => selectRealm(slug)} />

      <RealmInfoCard slug={active} onEnter={handleEnterRealm} />

      <footer className={styles.hint} aria-live="polite">
        {selectedName ? (
          <>
            TRAVEL PREPARED → <strong>{selectedName}</strong> · select ENTER REALM to launch travel
          </>
        ) : (
          <>Hover or focus a realm to inspect · select to prepare travel</>
        )}
      </footer>
    </main>
  );
}
