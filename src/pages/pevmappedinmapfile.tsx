// src/components/MappedinMap.tsx
import { useEffect, useRef, useState } from "react";
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
  colorMode?: 'simple' | 'category'; // 'simple' = green/grey only, 'category' = category colors
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
  clientSecret = (import.meta.env.VITE_MAPPEDIN_CLIENT_SECRET as string) ?? null, // TEMPORARY: Exposed for getVenue()
  stalls,
  onStallClick,
  colorMode = 'category', // Default to category colors for backward compatibility
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [map, setMap] = useState<any>(null);
  const [mapDataState, setMapDataState] = useState<any>(null);

  const normalize = (s: any) =>
    String(s ?? "")
      .trim()
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

            // NEW: Check if this is MVF v3 format by trying to detect it
            if (isZipByMagic || isZipByCT) {
              try {
                console.log("🗺️ MappedinMap: Attempting to parse as MVF v3 format...");
                const JSZip = (await import('jszip')).default;
                const zip = await JSZip.loadAsync(bytes);
                
                // Check for MVF v3 structure (manifest.geojson, floors.geojson, locations.json)
                const hasManifest = zip.file("manifest.geojson") !== null;
                const hasFloors = zip.file("floors.geojson") !== null;
                const hasLocations = zip.file("locations.json") !== null;
                
                if (hasManifest && hasFloors) {
                  console.log("🗺️ MappedinMap: Detected MVF v3 format! Parsing GeoJSON files...");
                  
                  // Parse MVF v3 structure
                  const manifestText = await zip.file("manifest.geojson")!.async("text");
                  const floorsText = await zip.file("floors.geojson")!.async("text");
                  const locationsText = hasLocations ? await zip.file("locations.json")!.async("text") : "[]";
                  
                  const manifest = JSON.parse(manifestText);
                  const floors = JSON.parse(floorsText);
                  const locations = JSON.parse(locationsText);
                  
                  console.log("🗺️ MVF v3 manifest:", manifest);
                  console.log("🗺️ MVF v3 floors:", floors);
                  console.log("🗺️ MVF v3 locations count:", locations.length || locations?.features?.length || 0);
                  
                  // For MVF v3, we need to use the API key/secret approach or get proper mapData
                  // Try using client key if available
                  if (clientKey && typeof (mod as any).getMapData === "function") {
                    console.log("🗺️ MappedinMap: Attempting to fetch map data from Mappedin API using client key...");
                    try {
                      // Use the API to get the proper map data structure
                      const mapData = await (mod as any).getMapData({
                        key: clientKey,
                        secret: clientSecret || undefined,
                        mapId: effectiveMapId,
                      });
                      
                      if (mapData) {
                        console.log("🗺️ MappedinMap: Successfully fetched map data from API, initializing map...");
                        const mapInstance = await mod.show3dMap(containerRef.current!, mapData);
                        instanceRef.current = mapInstance;
                        setMap(mapInstance);
                        
                        // Store MVF v3 data for overlay matching
                        try {
                          (mapInstance as any).__mvfV3 = { manifest, floors, locations };
                          (mapInstance as any).__mapData = mapData;
                        } catch {}
                        setMapDataState(mapData);
                        
                        if (onMapReady) onMapReady(mapInstance);
                        return;
                      }
                    } catch (apiError) {
                      console.warn("🗺️ MappedinMap: API fetch failed:", apiError);
                    }
                  }
                  
                  // If no client key/secret, we can't render MVF v3 directly
                  // The SDK needs either API credentials or server-side mapData
                  console.warn("🗺️ MappedinMap: MVF v3 requires API key/secret or server-provided mapData.");
                  throw new Error("MVF v3 detected but cannot initialize: SDK requires API credentials (key/secret) or server-fetched mapData. Local MVF v3 files cannot be rendered directly without API access.");
                }
              } catch (mvfV3Error) {
                console.warn("🗺️ MappedinMap: MVF v3 parsing failed, trying v2 parsers:", mvfV3Error);
              }
            }

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
        // Load SDK first
        const mod = await import("@mappedin/mappedin-js/lib/esm/index.js");
        console.log("MappedinMap: mappedin module loaded. keys:", Object.keys(mod));
        
        // Try using getMapData() - CORRECT Web SDK v6 method (returns MapData with spaces)
        if (clientKey && clientSecret && typeof (mod as any).getMapData === "function") {
          try {
            console.log("🗺️ MappedinMap: Fetching mapData using getMapData() (Web SDK v6 pattern)...");
            const mapData = await (mod as any).getMapData({
              key: clientKey,
              secret: clientSecret,
              mapId: effectiveMapId,
            });
            
            if (mapData) {
              console.log("🗺️ MappedinMap: Successfully fetched mapData, initializing...");
              console.log("🗺️ MappedinMap: mapData has getByType?", typeof mapData.getByType === 'function');
              
              // Get spaces using mapData.getByType('space') - the CORRECT way
              const spaces = mapData.getByType ? mapData.getByType('space') : [];
              console.log("🗺️ MappedinMap: spaces count:", spaces.length);
              if (spaces.length > 0) {
                console.log("🗺️ MappedinMap: First 3 spaces:", spaces.slice(0, 3).map((s: any) => ({ name: s.name, id: s.id })));
              }
              
              const mapInstance = await mod.show3dMap(containerRef.current, mapData);
              instanceRef.current = mapInstance;
              setMap(mapInstance);
              try { 
                (mapInstance as any).__mapData = mapData;
              } catch {}
              setMapDataState(mapData);
              if (onMapReady) onMapReady(mapInstance);
              return;
            }
          } catch (mapDataErr) {
            console.warn("🗺️ MappedinMap: getMapData() failed:", mapDataErr);
          }
        }
        
        // Fallback: Try using API key directly to fetch map data (older approach)
        if (clientKey && typeof (mod as any).getMapData === "function") {
          try {
            console.log("🗺️ MappedinMap: Fetching map data from Mappedin API using client key...");
            const mapData = await (mod as any).getMapData({
              key: clientKey,
              secret: clientSecret || undefined,
              mapId: effectiveMapId,
            });
            
            if (mapData) {
              console.log("🗺️ MappedinMap: Successfully fetched map data, initializing...");
              const mapInstance = await mod.show3dMap(containerRef.current, mapData);
              instanceRef.current = mapInstance;
              setMap(mapInstance);
              try { (mapInstance as any).__mapData = mapData; } catch {}
              setMapDataState(mapData);
              if (onMapReady) onMapReady(mapInstance);
              return;
            }
          } catch (apiErr) {
            console.warn("🗺️ MappedinMap: API fetch failed:", apiErr);
          }
        }
        
        // Fallback: try server function
        try {
          mapDataResponse = await fetchMappedinMapData(effectiveMapId);
          console.log("MappedinMap: fetched mapDataResponse from server:", mapDataResponse);
        } catch (err) {
          console.warn("MappedinMap: fetchMappedinMapData failed, falling back to token-only:", err);
        }

        // If server returned mapData, use it directly with show3dMap
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

    // Category colors for 'category' mode (IndoorMap.tsx)
    const sectionColors: { [key: string]: string } = {
      'E-': '#FF6B6B',      // Eatery - Red
      'FV-': '#4CAF50',     // Fruits & Vegetables - Green
      'DF-': '#FF9800',     // Dried Fish - Orange
      'G-': '#2196F3',      // Grocery - Blue
      'RG-': '#FFC107',     // Rice & Grains - Amber
      'V-': '#9C27B0',      // Variety - Purple
      'F-': '#00BCD4',      // Fish - Cyan
      'M-': '#F44336',      // Meat - Deep Red
    };

    const stallMap = new Map(stalls.map((stall) => [stall.stall_number, stall]));

    try {
      const m: any = map;

      // Get mapData - MUST use mapData.getByType('space') for Web SDK v6
      const mapData = (m as any).__mapData ?? mapDataState;
      
      if (!mapData || typeof mapData.getByType !== 'function') {
        console.warn("MappedinMap: mapData not available or missing getByType method");
        return;
      }
      
      // Web SDK v6: Use mapData.getByType('space') to get all spaces
      const spaces = mapData.getByType('space');
      
      console.log("MappedinMap: spaces count:", spaces.length);
      if (spaces.length > 0) {
        console.log("MappedinMap: first 3 spaces:", spaces.slice(0, 3).map((s: any) => ({ name: s.name, id: s.id })));
      }
      
      if (spaces.length === 0) {
        console.warn("MappedinMap: no spaces found in mapData");
        return;
      }

      // Color and make stalls interactive based on vacancy status
      let vacantCount = 0;
      let occupiedCount = 0;
      let unmatchedCount = 0;
      
      spaces.forEach((space: any) => {
        const stallNumber = space?.name; // Match by space.name === stall_number
        const stall = stallMap.get(stallNumber);
        
        if (stall) {
          // Check if stall is vacant/available
          const isVacant = stall.status === 'vacant' || stall.status === 'available';
          
          let color: string;
          let hoverColor: string;
          let interactive: boolean;
          
          if (colorMode === 'simple') {
            // SIMPLE MODE (PublicHome.tsx): GREEN for vacant, GREY for occupied
            if (isVacant) {
              color = '#10B981'; // Emerald green
              hoverColor = '#059669'; // Darker green on hover
              interactive = !!onStallClick;
              vacantCount++;
              console.log(`✅ VACANT stall ${stallNumber} - GREEN & CLICKABLE`);
            } else {
              color = '#9CA3AF'; // Grey for occupied
              hoverColor = '#9CA3AF';
              interactive = false;
              occupiedCount++;
              console.log(`🔒 OCCUPIED stall ${stallNumber} - GREY (not clickable)`);
            }
          } else {
            // CATEGORY MODE (IndoorMap.tsx): Show category colors
            if (isVacant) {
              // Vacant stalls still shown in green for visibility
              color = '#10B981';
              hoverColor = '#059669';
              interactive = !!onStallClick;
              vacantCount++;
              console.log(`✅ VACANT stall ${stallNumber} - GREEN & CLICKABLE`);
            } else {
              // Occupied stalls show their category color
              const prefix = stallNumber.match(/^[A-Z]+-/)?.[0] || '';
              color = sectionColors[prefix] || '#9E9E9E';
              hoverColor = color;
              interactive = false;
              occupiedCount++;
              console.log(`🔒 OCCUPIED stall ${stallNumber} - ${color} (${prefix})`);
            }
          }
          
          // Apply color and interactivity
          try {
            m.updateState(space, {
              color: color,
              hoverColor: hoverColor,
              interactive: interactive,
            });
          } catch (err) {
            console.warn("Failed to color space:", space?.name, err);
          }
        } else {
          // Unmatched spaces (no stall data) - light gray, not interactive
          try {
            m.updateState(space, {
              color: '#e5e7eb',
              hoverColor: '#e5e7eb',
              interactive: false,
            });
            unmatchedCount++;
          } catch {}
        }
      });
      
      console.log(`MappedinMap: Coloring complete! (mode: ${colorMode})`);
      console.log(`  ✅ ${vacantCount} VACANT stalls (green, clickable)`);
      console.log(`  🔒 ${occupiedCount} OCCUPIED stalls (${colorMode === 'simple' ? 'grey' : 'category colors'}, not clickable)`);
      console.log(`  ⚪ ${unmatchedCount} unmatched spaces (gray)`);

      // Hover handler - Show tooltip for vacant stalls
      const handleHover = (event: any) => {
        const space = event?.spaces?.[0];
        if (!space) return;
        
        const stallNumber = space?.name;
        const stall = stallMap.get(stallNumber);
        
        if (stall && (stall.status === 'vacant' || stall.status === 'available')) {
          // Show tooltip for vacant stalls
          const tooltip = `
            <div style="padding: 12px; min-width: 200px;">
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #10B981;">
                ${stall.stall_number}
              </div>
              <div style="font-size: 14px; margin-bottom: 4px;">
                <strong>Status:</strong> <span style="color: #10B981; font-weight: 600;">AVAILABLE</span>
              </div>
              ${stall.location_desc ? `<div style="font-size: 14px; margin-bottom: 4px;"><strong>Location:</strong> ${stall.location_desc}</div>` : ''}
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #059669;">
                🖱️ Click to apply for this stall
              </div>
            </div>
          `;
          
          try {
            m.Tooltip?.show(space, tooltip);
          } catch (err) {
            console.warn("Failed to show tooltip:", err);
          }
        }
      };
      
      const handleHoverOff = () => {
        try {
          m.Tooltip?.hide();
        } catch {}
      };

      // Click handler - ONLY triggers for vacant/available stalls (interactive=true)
      const handleClick = (event: any) => {
        if (!onStallClick) return;
        
        console.log("🖱️ Map clicked, event:", event);
        
        // Web SDK click event has spaces array
        const space = event?.spaces?.[0] || event?.space || event;
        const stallNumber = space?.name;
        const stall = stallMap.get(stallNumber);
        
        if (stall) {
          // Double-check: Only allow clicks on vacant/available stalls
          const isVacant = stall.status === 'vacant' || stall.status === 'available';
          
          if (isVacant) {
            console.log(`✅ Clicked VACANT stall: ${stallNumber} - Status: ${stall.status}`);
            
            // Highlight selected stall with purple-blue (matching React Native)
            try {
              m.updateState(space, {
                color: '#667eea',
                hoverColor: '#764ba2',
              });
            } catch {}
            
            onStallClick(stall, space);
          } else {
            console.log(`🔒 Clicked OCCUPIED stall: ${stallNumber} - Status: ${stall.status} (no action)`);
            // Don't trigger callback for occupied stalls
          }
        }
      };

      let off: (() => void) | undefined;
      let offHover: (() => void) | undefined;
      let offHoverOff: (() => void) | undefined;
      
      try {
        if (typeof m.on === "function") {
          // Register click event
          m.on("click", handleClick);
          off = () => { try { m.off?.("click", handleClick); } catch {} };
          
          // Register hover events
          m.on("mouseover", handleHover);
          offHover = () => { try { m.off?.("mouseover", handleHover); } catch {} };
          
          m.on("mouseout", handleHoverOff);
          offHoverOff = () => { try { m.off?.("mouseout", handleHoverOff); } catch {} };
        }
      } catch {}

      return () => { 
        try { 
          off?.(); 
          offHover?.();
          offHoverOff?.();
        } catch {} 
      };
    } catch (err) {
      console.warn("MappedinMap: error applying stall overlays:", err);
    }
  }, [map, stalls, onStallClick, mapDataState, colorMode]);

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