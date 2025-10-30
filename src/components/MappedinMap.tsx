// src/components/MappedinMap.tsx
import React, { useEffect, useRef, useState } from "react";
import { getMappedinTokenFromServer, fetchMappedinMapData } from "../utils/mappedinHelpers";
import type { Database } from "../types/supabase";

type Stall = Database["public"]["Tables"]["stalls"]["Row"];

interface Props {
  venueId?: string; // Mappedin venue id (a.k.a. "venue" or "mapId" depending on API)
  mapId?: string | number; // optional map id (preferred)
  onMapReady?: (mappedinMap: any) => void;
  className?: string;
  // Optional client-side key/secret (NOT recommended in production)
  clientKey?: string | null;
  clientSecret?: string | null;
  stalls?: Stall[];
  onStallClick?: (stall: Stall, polygon: any) => void;
}

function base64ToUint8Array(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export default function MappedinMap({
  venueId,
  mapId,
  onMapReady,
  className,
  clientKey = (import.meta.env.VITE_MAPPEDIN_API_KEY as string) ?? null,
  clientSecret = null, // REMOVED: Secret should never be exposed to browser
  stalls,
  onStallClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [map, setMap] = useState<any>(null);
  const [mapDataState, setMapDataState] = useState<any>(null);

  const normalize = (s: any) =>
    String(s ?? "")
      .normalize?.("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "")
      .replace(/[-_]+/g, "")
      .toUpperCase();

  useEffect(() => {
    async function init() {
      setErrorMessage(null);
      try {
        // Process shim for some bundles that expect process.env
        if (typeof (window as any).process === "undefined") {
          try {
            (window as any).process = { env: {} };
            (globalThis as any).process = (window as any).process;
            console.log("MappedinMap: applied process shim for browser.");
          } catch (shimErr) {
            console.warn("MappedinMap: process shim failed", shimErr);
          }
        }

        // load CSS (try esm then fallback)
        try {
          await import("@mappedin/mappedin-js/lib/esm/index.css");
          console.log("MappedinMap: loaded @mappedin css from lib/esm/index.css");
        } catch (e) {
          try {
            await import("@mappedin/mappedin-js/lib/index.css");
            console.log("MappedinMap: loaded @mappedin css from lib/index.css");
          } catch (e2) {
            console.warn("MappedinMap: could not auto-load Mappedin CSS, continuing", e2);
          }
        }

        // determine effective mapId
        const envMapId = (import.meta.env.VITE_MAPPEDIN_MAP_ID as string) ?? undefined;
        const effectiveMapId = (mapId ?? venueId ?? envMapId) as string | undefined;
        console.log("MappedinMap: mapId from props:", mapId, " venueId:", venueId, " env mapId:", envMapId);
        if (!effectiveMapId) {
          throw new Error("No mapId found. Provide mapId prop or set VITE_MAPPEDIN_MAP_ID.");
        }
        console.log("MappedinMap: effectiveMapId to attempt:", effectiveMapId);

        if (!containerRef.current) throw new Error("MappedinMap: container not available");

        // If an MVF URL is provided via env, try that first (most reliable with current SDK build)
        const mvfUrl = (import.meta.env.VITE_MAPPEDIN_MVF_URL as string | undefined) ?? undefined;
        let mapDataResponse: any = null;
        if (mvfUrl) {
          try {
            console.log("MappedinMap: attempting to fetch MVF from VITE_MAPPEDIN_MVF_URL:", mvfUrl);
            const mvfRes = await fetch(mvfUrl);
            if (!mvfRes.ok) throw new Error(`Failed to fetch MVF URL: ${mvfRes.status}`);
            const contentType = mvfRes.headers.get("content-type") || "";
            const ab = await mvfRes.arrayBuffer();
            const mod = await import("@mappedin/mappedin-js/lib/esm/index.js");
            const bytes = new Uint8Array(ab);

            // Helper to detect zip by magic number "PK\x03\x04"
            const isZipByMagic = bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
            const isZipByCT = /zip|octet-stream/i.test(contentType);
            const isJsonCT = /json|text\/(plain|json)/i.test(contentType);

            if (isJsonCT && bytes.length > 0 && bytes[0] !== 0x50) {
              // Try plain JSON MVF (some portals export uncompressed JSON)
              try {
                const text = new TextDecoder().decode(bytes);
                const json = JSON.parse(text);
                if (typeof (mod as any).parseMVF === "function") {
                  const parsed = await (mod as any).parseMVF(json);
                  const mapInstance = await mod.show3dMap(containerRef.current!, parsed);
                  instanceRef.current = mapInstance;
                  setMap(mapInstance);
                  try { (mapInstance as any).__mapData = parsed; } catch {}
                  setMapDataState(parsed);
                  if (onMapReady) onMapReady(mapInstance);
                  return;
                } else {
                  // Some SDK builds accept MVF mapData-like JSON directly
                  const mapInstance = await mod.show3dMap(containerRef.current!, json as any);
                  instanceRef.current = mapInstance;
                  setMap(mapInstance);
                  try { (mapInstance as any).__mapData = json; } catch {}
                  setMapDataState(json);
                  if (onMapReady) onMapReady(mapInstance);
                  return;
                }
              } catch (jsonErr) {
                console.warn("MappedinMap: MVF JSON path failed, will try zip-based parsers:", jsonErr);
              }
            }

            // Try zip-based flows
            if (isZipByMagic || isZipByCT) {
              try {
                if (typeof (mod as any).unzipAndParseMVFv2 === "function") {
                  const parsed = await (mod as any).unzipAndParseMVFv2(bytes);
                  const mapInstance = await mod.show3dMap(containerRef.current!, parsed);
                  instanceRef.current = mapInstance;
                  setMap(mapInstance);
                  try { (mapInstance as any).__mapData = parsed; } catch {}
                  setMapDataState(parsed);
                  if (onMapReady) onMapReady(mapInstance);
                  return;
                }
              } catch (e1) {
                console.warn("MappedinMap: unzipAndParseMVFv2 failed, trying unzipMVF+parseMVF:", e1);
              }
              try {
                if (typeof (mod as any).unzipMVF === "function" && typeof (mod as any).parseMVF === "function") {
                  const unzipped = await (mod as any).unzipMVF(bytes);
                  const parsed = await (mod as any).parseMVF(unzipped);
                  const mapInstance = await mod.show3dMap(containerRef.current!, parsed);
                  instanceRef.current = mapInstance;
                  setMap(mapInstance);
                  try { (mapInstance as any).__mapData = parsed; } catch {}
                  setMapDataState(parsed);
                  if (onMapReady) onMapReady(mapInstance);
                  return;
                }
              } catch (e2) {
                console.warn("MappedinMap: unzipMVF+parseMVF failed:", e2);
              }
              // New: try hydrateMapDataFromMVF directly with the raw zip bytes
              try {
                if (typeof (mod as any).hydrateMapDataFromMVF === "function") {
                  console.log("MappedinMap: attempting hydrateMapDataFromMVF on MVF bytes...");
                  const mapData = await (mod as any).hydrateMapDataFromMVF(bytes);
                  const mapInstance = await mod.show3dMap(containerRef.current!, mapData);
                  instanceRef.current = mapInstance;
                  setMap(mapInstance);
                  try { (mapInstance as any).__mapData = mapData; } catch {}
                  setMapDataState(mapData);
                  if (onMapReady) onMapReady(mapInstance);
                  return;
                }
              } catch (e3) {
                console.warn("MappedinMap: hydrateMapDataFromMVF failed:", e3);
              }
            } else {
              console.warn("MappedinMap: MVF content-type/magic suggests non-zip, non-JSON; skipping zip parsers. content-type:", contentType);
            }
          } catch (e) {
            console.warn("MappedinMap: MVF env URL flow failed, continuing with server/token strategies:", e);
          }
        }

        // Ask the server for the best payload (mapData, mvfBase64, or outdoorViewToken).
        try {
          mapDataResponse = await fetchMappedinMapData(effectiveMapId);
          console.log("MappedinMap: fetched mapDataResponse from server:", mapDataResponse);
        } catch (err) {
          console.warn("MappedinMap: fetchMappedinMapData failed, falling back to token-only:", err);
        }

        // If server returned mapData, use it directly with show3dMap
        // Load SDK first
        const mod = await import("@mappedin/mappedin-js/lib/esm/index.js");
        console.log("MappedinMap: mappedin module loaded. keys:", Object.keys(mod));

        if (mapDataResponse?.mapData) {
          try {
            console.log("MappedinMap: initializing show3dMap with server-provided mapData...");
            const mapInstance = await mod.show3dMap(containerRef.current, mapDataResponse.mapData);
            console.log("MappedinMap: show3dMap succeeded using server mapData:", mapInstance);
            instanceRef.current = mapInstance;
            setMap(mapInstance); // Set map instance to state
            try { (mapInstance as any).__mapData = mapDataResponse.mapData; } catch {}
            setMapDataState(mapDataResponse.mapData);
            if (onMapReady) onMapReady(mapInstance);
            return;
          } catch (err) {
            console.warn("MappedinMap: show3dMap with server mapData failed:", err);
          }
        }

        // If server returned an MVF (base64), try to parse/unzip then initialize
        if (mapDataResponse?.mvfBase64) {
          try {
            console.log("MappedinMap: server returned mvfBase64 - attempting to parse and initialize.");
            const bytes = base64ToUint8Array(mapDataResponse.mvfBase64);
            // prefer SDK helper names if present
            if (typeof mod.unzipAndParseMVFv2 === "function") {
              const parsed = await mod.unzipAndParseMVFv2(bytes);
              console.log("MappedinMap: unzipAndParseMVFv2 returned:", !!parsed);
              const mapInstance = await mod.show3dMap(containerRef.current, parsed);
              instanceRef.current = mapInstance;
              setMap(mapInstance); // Set map instance to state
              try { (mapInstance as any).__mapData = parsed; } catch {}
              setMapDataState(parsed);
              if (onMapReady) onMapReady(mapInstance);
              return;
            } else if (typeof mod.unzipMVF === "function" && typeof mod.parseMVF === "function") {
              const unzipped = await mod.unzipMVF(bytes);
              const parsed = await mod.parseMVF(unzipped);
              const mapInstance = await mod.show3dMap(containerRef.current, parsed);
              instanceRef.current = mapInstance;
              setMap(mapInstance); // Set map instance to state
              try { (mapInstance as any).__mapData = parsed; } catch {}
              setMapDataState(parsed);
              if (onMapReady) onMapReady(mapInstance);
              return;
            } else if (typeof mod.hydrateMapDataFromMVF === "function") {
              // some SDKs provide a direct hydrator
              const mapData = await mod.hydrateMapDataFromMVF(bytes);
              const mapInstance = await mod.show3dMap(containerRef.current, mapData);
              instanceRef.current = mapInstance;
              setMap(mapInstance); // Set map instance to state
              try { (mapInstance as any).__mapData = mapData; } catch {}
              setMapDataState(mapData);
              if (onMapReady) onMapReady(mapInstance);
              return;
            } else {
              console.warn("MappedinMap: SDK has no known MVF parsing helpers (unzipAndParseMVFv2/unzipMVF/parseMVF/hydrateMapDataFromMVF).");
            }
          } catch (err) {
            console.warn("MappedinMap: failed to parse/display MVF from server:", err);
          }
        }

        // If server returned a token only OR server call failed above, fall back to token-only strategies:
        let tokenObj: any = null;
        try {
          tokenObj = await getMappedinTokenFromServer();
          console.log("MappedinMap: tokenObj:", tokenObj);
        } catch (err) {
          console.warn("MappedinMap: getMappedinTokenFromServer failed:", err);
        }

        const outdoorViewToken = tokenObj?.outdoorViewToken ?? tokenObj?.access_token ?? tokenObj?.token;
        if (!outdoorViewToken) {
          console.warn("MappedinMap: no outdoorViewToken available from server; continuing to attempt other strategies.");
        } else {
          console.log("MappedinMap: using outdoorViewToken (first 60 chars):", String(outdoorViewToken).slice(0, 60));
        }

        // Try token + mapId with show3dMap
        if (outdoorViewToken) {
          try {
            console.log("MappedinMap: Attempting show3dMap with outdoorViewToken + mapId...");
            const mapInstance = await mod.show3dMap(containerRef.current, {
              outdoorViewToken,
              mapId: effectiveMapId,
            } as any);
            console.log("MappedinMap: show3dMap succeeded:", mapInstance);
            instanceRef.current = mapInstance;
            setMap(mapInstance); // Set map instance to state
            if (onMapReady) onMapReady(mapInstance);
            return;
          } catch (err) {
            console.warn("MappedinMap: show3dMap with token+mapId failed:", err);
          }

          try {
            console.log("MappedinMap: Attempting show3dMap with outdoorViewToken + venue fallback...");
            const mapInstance = await mod.show3dMap(containerRef.current, {
              outdoorViewToken,
              venue: effectiveMapId,
            } as any);
            console.log("MappedinMap: show3dMap (venue) succeeded:", mapInstance);
            instanceRef.current = mapInstance;
            setMap(mapInstance); // Set map instance to state
            if (onMapReady) onMapReady(mapInstance);
            return;
          } catch (err) {
            console.warn("MappedinMap: show3dMap venue fallback failed:", err);
          }

          try {
            console.log("MappedinMap: Attempting show3dMapGeojson with outdoorViewToken...");
            const mapInstance = await mod.show3dMapGeojson(containerRef.current, {
              outdoorViewToken,
              venue: effectiveMapId,
            } as any);
            console.log("MappedinMap: show3dMapGeojson succeeded:", mapInstance);
            instanceRef.current = mapInstance;
            setMap(mapInstance); // Set map instance to state
            if (onMapReady) onMapReady(mapInstance);
            return;
          } catch (err) {
            console.warn("MappedinMap: show3dMapGeojson failed:", err);
          }

          // Try SDK getMapData(token) -> show3dMap(mapData)
          try {
            if (typeof mod.getMapData === "function") {
              console.log("MappedinMap: Attempting mod.getMapData({ mapId, outdoorViewToken }) ...");
              const mapData = await mod.getMapData({ mapId: effectiveMapId, outdoorViewToken } as any);
              if (mapData) {
                console.log("MappedinMap: getMapData returned mapData. Calling show3dMap with mapData...");
                const mapInstance = await mod.show3dMap(containerRef.current, mapData);
                instanceRef.current = mapInstance;
                setMap(mapInstance); // Set map instance to state
                try { (mapInstance as any).__mapData = mapData; } catch {}
                setMapDataState(mapData);
                if (onMapReady) onMapReady(mapInstance);
                return;
              } else {
                console.warn("MappedinMap: mod.getMapData returned falsy value");
              }
            } else {
              console.log("MappedinMap: mod.getMapData is not available on this SDK build.");
            }
          } catch (err) {
            console.warn("MappedinMap: getMapData({mapId, outdoorViewToken}) failed:", err);
          }
        }

        // LAST RESORT A: Enterprise API path with key+secret (if available in env)
        if (clientKey && clientSecret) {
          try {
            if (typeof (mod as any).setUseEnterpriseAPI === "function") {
              (mod as any).setUseEnterpriseAPI(true);
            }
            if (typeof (mod as any).getMapDataEnterprise === "function") {
              console.log("MappedinMap: Attempting getMapDataEnterprise({ venue/mapId, key, secret })...");
              const entMapData = await (mod as any).getMapDataEnterprise({
                venue: effectiveMapId,
                mapId: effectiveMapId,
                key: clientKey,
                secret: clientSecret,
              } as any);
              if (entMapData) {
                console.log("MappedinMap: getMapDataEnterprise returned data. Initializing show3dMap...");
                const mapInstance = await (mod as any).show3dMap(containerRef.current, entMapData);
                instanceRef.current = mapInstance;
                setMap(mapInstance);
                try { (mapInstance as any).__mapData = entMapData; } catch {}
                setMapDataState(entMapData);
                if (onMapReady) onMapReady(mapInstance);
                return;
              }
            }
          } catch (err) {
            console.warn("MappedinMap: getMapDataEnterprise failed:", err);
          }

          // LAST RESORT B: use getMapData with key+secret (only if provided explicitly)
          try {
            console.log("MappedinMap: Attempting mod.getMapData({ mapId, key, secret }) using provided clientKey/clientSecret (NOT recommended in browser)");
            const mapData = await mod.getMapData({ mapId: effectiveMapId, key: clientKey, secret: clientSecret } as any);
            if (mapData) {
              const mapInstance = await mod.show3dMap(containerRef.current, mapData);
              instanceRef.current = mapInstance;
              setMap(mapInstance); // Set map instance to state
              try { (mapInstance as any).__mapData = mapData; } catch {}
              setMapDataState(mapData);
              if (onMapReady) onMapReady(mapInstance);
              return;
            }
          } catch (err) {
            console.warn("MappedinMap: getMapData with key/secret failed:", err);
          }
        }

        // If we reach here nothing worked
        const msg =
          "All mappedin initialization strategies failed. Console shows detailed errors above. " +
          "Common causes: token-only server response (token alone cannot produce mapData for this SDK build) or the SDK expects map-data/MVF that your server must fetch and deliver. " +
          "Recommended fix: modify your mappedin_mapdata / mappedin_token server function to return parsed mapData or MVF (mvfBase64) and ensure client calls show3dMap(mapElement, mapData). " +
          "If you're hosting an MVF ZIP, ensure it's an MVF v2 export without an extra top-level folder; the archive root should contain MVF manifest files (not a nested directory).";
        console.error("MappedinMap:", msg);
        setErrorMessage(msg);
      } catch (err) {
        console.error("MappedinMap: Unexpected error initializing mappedin map:", err);
        setErrorMessage(String(err));
      }
    }

    init();

    return () => {
      if (instanceRef.current?.destroy) {
        try {
          instanceRef.current.destroy();
        } catch (e) {
          console.warn("MappedinMap: error destroying instance", e);
        }
      }
    };
  }, [venueId, mapId, onMapReady, clientKey, clientSecret]);

  useEffect(() => {
    if (!map || !stalls) return;

    const stallMap = new Map(stalls.map((stall) => [normalize(stall.stall_number), stall]));

    const debugOnceKey = "__mappedin_debugged__";
    try {
      const m: any = map;

      // Introspection and tolerant accessors across SDK variants
      const protoKeys = (() => {
        try { return Object.getOwnPropertyNames(Object.getPrototypeOf(m)); } catch { return []; }
      })();
      if (!m[debugOnceKey]) {
        m[debugOnceKey] = true;
        console.log("MappedinMap: map instance keys:", Object.keys(m));
        console.log("MappedinMap: prototype keys:", protoKeys);
        try { console.log("MappedinMap: Style keys:", Object.keys(m?.Style || {})); } catch {}
        try { console.log("MappedinMap: Shapes keys:", Object.keys(m?.Shapes || {})); } catch {}
        try {
          const md = (m as any).__mapData ?? mapDataState;
          if (md) {
            const mdKeys = Object.keys(md);
            console.log("MappedinMap: attached mapData keys:", mdKeys);
            try {
              const locs = (md as any).locations || (md as any).polygons || [];
              console.log("MappedinMap: mapData locations length:", Array.isArray(locs) ? locs.length : typeof locs);
              console.log("MappedinMap: sample mapData locations:", (Array.isArray(locs) ? locs.slice(0, 5) : []));
            } catch {}
          }
        } catch {}
      }

      // Candidate ways to list polygons/locations depending on SDK build
      const tryGetLocations = () => {
        try {
          if (m?.locations?.list) return m.locations.list();
        } catch {}
        try {
          if (typeof m?.getLocations === "function") return m.getLocations();
        } catch {}
        try {
          if (m?.polygons?.list) return m.polygons.list();
        } catch {}
        try {
          if (typeof m?.getPolygons === "function") return m.getPolygons();
        } catch {}
        try {
          // sometimes nested under mapView or scene
          if (m?.mapView?.locations?.list) return m.mapView.locations.list();
        } catch {}
        try {
          if (m?.mapView?.getLocations) return m.mapView.getLocations();
        } catch {}
        return [] as any[];
      };

      const locations: any[] = tryGetLocations() || [];
      console.log("MappedinMap: locations count:", Array.isArray(locations) ? locations.length : typeof locations);
      try {
        const sample = (Array.isArray(locations) ? locations : []).slice(0, 10).map((p: any) => ({
          name: p?.name,
          id: p?.id,
          slug: p?.slug,
          externalId: p?.externalId,
          keys: Object.keys(p || {}),
        }));
        console.log("MappedinMap: sample locations (first 10):", sample);
      } catch {}
      if (!Array.isArray(locations) || locations.length === 0) {
        console.warn("MappedinMap: no locations array found on this SDK build yet; overlays cannot be applied.");
        // Attach raw click logger to inspect event payloads
        const rawClick = (evt: any) => {
          try {
            const ek = evt ? Object.keys(evt) : [];
            console.log("MappedinMap: raw click event keys:", ek, "evt:", evt);
          } catch {}
        };
        try { m.on?.("click", rawClick); } catch {}
        // Also expose a shallow tree walker to find arrays with name fields
        try {
          (window as any).dumpMappedinTree = () => {
            const visited = new Set<any>();
            const results: any[] = [];
            const maxDepth = 3;
            const walk = (obj: any, path: string, depth: number) => {
              if (!obj || typeof obj !== "object") return;
              if (visited.has(obj) || depth > maxDepth) return;
              visited.add(obj);
              try {
                if (Array.isArray(obj) && obj.length && typeof obj[0] === "object") {
                  const n = obj.slice(0, 3).some((it) => !!(it && (it.name || it.id || it.slug || it.externalId)));
                  if (n) {
                    results.push({ path, length: obj.length, sample: obj.slice(0, 3).map((it) => ({ name: it.name, id: it.id, slug: it.slug, externalId: it.externalId, keys: Object.keys(it || {}) })) });
                  }
                }
              } catch {}
              const keys = Object.keys(obj);
              for (const k of keys) {
                const v: any = (obj as any)[k];
                if (!v || typeof v !== "object") continue;
                if (v === obj) continue;
                walk(v, path ? `${path}.${k}` : k, depth + 1);
              }
            };
            walk(m, "map", 0);
            try { console.log("dumpMappedinTree: found arrays:", results); } catch {}
            return results;
          };
          console.log("MappedinMap: dumpMappedinTree() is available on window for deeper inspection.");
        } catch {}
        return;
      }

      const colorPolygon = (poly: any, color: string) => {
        try {
          if (typeof m.setPolygonColor === "function") return m.setPolygonColor(poly, color);
        } catch {}
        try {
          if (typeof m.setLocationColor === "function") return m.setLocationColor(poly, color);
        } catch {}
        try {
          if (typeof poly?.setColor === "function") return poly.setColor(color);
        } catch {}
      };

      const addInteractive = (poly: any) => {
        try {
          if (typeof m.addInteractivePolygon === "function") return m.addInteractivePolygon(poly);
        } catch {}
        try {
          if (typeof m.addInteractiveLocation === "function") return m.addInteractiveLocation(poly);
        } catch {}
      };

      let matched = 0;
      let unmatched = 0;
      locations.forEach((polygon: any) => {
        const key = normalize(polygon?.name ?? polygon?.id ?? polygon?.slug ?? polygon?.externalId);
        const stall = stallMap.get(key);
        if (stall) {
          const isAvailable = stall.status === "vacant" || stall.status === "available";
          const color = isAvailable ? "#4ade80" : "#f87171";
          colorPolygon(polygon, color);
          if (isAvailable && onStallClick) addInteractive(polygon);
          matched++;
        } else {
          colorPolygon(polygon, "#e5e7eb");
          unmatched++;
        }
      });
      console.log(`MappedinMap: overlay coloring done. matched=${matched} unmatched=${unmatched}`);

      // Generic click hookup
      const handleClick = (polygon: any) => {
        if (!onStallClick) return;
        const key = normalize(polygon?.name ?? polygon?.id ?? polygon?.slug ?? polygon?.externalId);
        const stall = stallMap.get(key);
        if (stall) onStallClick(stall, polygon);
      };

      let off: (() => void) | undefined;
      try {
        if (typeof m.on === "function") {
          m.on("click", handleClick);
          off = () => { try { m.off?.("click", handleClick); } catch {} };
        }
      } catch {}

      // Expose a small debug helper to list all location names in console
      try {
        (window as any).dumpMappedinLocations = () => {
          try {
            const arr = tryGetLocations() || [];
            console.log("dumpMappedinLocations count=", arr?.length || 0);
            (arr || []).forEach((p: any, i: number) => {
              const key = normalize(p?.name ?? p?.id ?? p?.slug ?? p?.externalId);
              console.log(i, p?.name, { id: p?.id, slug: p?.slug, externalId: p?.externalId, key });
            });
          } catch (e) {
            console.warn("dumpMappedinLocations failed:", e);
          }
        };
      } catch {}

      return () => { try { off?.(); } catch {} };
    } catch (err) {
      console.warn("MappedinMap: error applying stall overlays:", err);
    }
  }, [map, stalls, onStallClick, mapDataState]);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: 600 }}>
      <div
        ref={containerRef}
        className={className ?? "mappedin-map-container"}
        style={{ width: "100%", height: 600, position: "relative", background: "#000" }}
        aria-label="Indoor map"
      />
      {errorMessage && (
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: 20,
            background: "rgba(255,255,255,0.95)",
            color: "#111",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            zIndex: 9999,
            maxHeight: "70vh",
            overflow: "auto",
          }}
        >
          <strong>Map failed to initialize</strong>
          <div style={{ marginTop: 8, whiteSpace: "pre-wrap", fontSize: 13 }}>{errorMessage}</div>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <strong>Next steps</strong>
            <ol>
              <li>
                Ensure your server function (mappedin_mapdata or mappedin_token) returns <code>mapData</code> or <code>mvfBase64</code> (preferred) or at least an <code>outdoorViewToken</code>.
              </li>
              <li>Server should use MAPPEDIN_CLIENT_ID / MAPPEDIN_CLIENT_SECRET to fetch MVF or map data from Mappedin REST API and return it to the client (or host it publicly).</li>
              <li>Alternatively, provide server endpoint that returns the full <code>mapData</code> directly and the client will call <code>show3dMap(mapElement, mapData)</code>.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
