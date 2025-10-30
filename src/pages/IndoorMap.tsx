// src/pages/IndoorMap.tsx
import React, { useEffect, useState } from "react";
import MappedinMap from "../components/MappedinMap";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/supabase";

type Stall = Database["public"]["Tables"]["stalls"]["Row"];

interface IndoorMarketMapProps {
  // optional callback when map is ready
  onMapReady?: (mapInstance: any) => void;
}

const IndoorMarketMap: React.FC<IndoorMarketMapProps> = ({ onMapReady }) => {
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loadingStalls, setLoadingStalls] = useState(true);

  // prefer map id from env; leave undefined if not present
  const mapId = import.meta.env.VITE_MAPPEDIN_MAP_ID ?? undefined;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingStalls(true);
        const { data, error } = await supabase.from("stalls").select("*");
        if (error) throw error;
        if (active) setStalls(data || []);
      } catch (err: any) {
        setMapError(err.message ?? String(err));
      } finally {
        if (active) setLoadingStalls(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Toril Public Market — Indoor Map</h1>
      </header>

      <main style={styles.main}>
        {mapError ? (
          <div style={styles.centerBox}>
            <p style={{ color: "crimson" }}>Map error: {mapError}</p>
            <p>Check the browser console and the mappedin token endpoint logs.</p>
          </div>
        ) : (
          <div style={styles.mapWrapper}>
            <MappedinMap
              // pass the mapId (your Mappedin map identifier) — MappedinMap handles token fetching
              mapId={mapId}
              stalls={stalls}
              onMapReady={(instance) => {
                console.log("Mappedin map ready:", instance);
                // expose for console inspection
                try { (window as any).mappedinMap = instance; } catch {}
                setMapReady(true);
                if (onMapReady) onMapReady(instance);
              }}
              className="mappedin-full"
            />
            {(!mapReady || loadingStalls) && (
              <div style={styles.loadingOverlay}>
                <div>{loadingStalls ? "Loading stalls…" : "Loading map…"}</div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <small>Powered by Mappedin • Toril Public Market</small>
      </footer>
    </div>
  );
};

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    background: "#fafafa",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "#ffffff",
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 12,
    boxSizing: "border-box",
  },
  mapWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: 1400,
    height: "calc(100vh - 120px)", // keep header/footer space
    background: "#000", // a background while the SDK mounts (map will cover it)
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    zIndex: 30,
    pointerEvents: "none",
    fontWeight: 600,
  },
  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: 20,
  },
  footer: {
    padding: "8px 16px",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center",
    background: "#fff",
  },
};

export default IndoorMarketMap;
