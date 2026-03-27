"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Mount MapContainer only after the first client effect so the initial render
 * (and SSR) never touches Leaflet.
 *
 * Important: do NOT set ready back to false in this effect's cleanup. In React 18
 * Strict Mode, dev runs mount → effect → effect cleanup → effect again. A cleanup
 * that unmounts the map between those runs races with Leaflet and surfaces as errors
 * inside commitDoubleInvokeEffectsInDEV. Parent unmount still tears down the map.
 */
export function LeafletStrictModeGate({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div
        className={className}
        style={{ height: "100%", width: "100%", ...style }}
        aria-hidden
      />
    );
  }

  return <>{children}</>;
}
