// supabase/functions/sync_mappedin_stalls/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { unzipSync } from "https://esm.sh/fflate@0.7.4";

const PROJECT_URL = Deno.env.get("PROJECT_URL") || Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const MAPPEDIN_CLIENT_ID = Deno.env.get("MAPPEDIN_CLIENT_ID");
const MAPPEDIN_CLIENT_SECRET = Deno.env.get("MAPPEDIN_CLIENT_SECRET");
const MAPPEDIN_MAP_ID = Deno.env.get("MAPPEDIN_MAP_ID");

if (!PROJECT_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing PROJECT_URL / SERVICE_ROLE_KEY env");
  Deno.exit(1);
}
const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

async function getMappedinToken() {
  if (!MAPPEDIN_CLIENT_ID) throw new Error("MAPPEDIN_CLIENT_ID missing");
  if (!MAPPEDIN_CLIENT_SECRET) throw new Error("MAPPEDIN_CLIENT_SECRET missing");
  const resp = await fetch("https://app.mappedin.com/api/v1/api-key/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: MAPPEDIN_CLIENT_ID, secret: MAPPEDIN_CLIENT_SECRET }),
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(`Mappedin auth failed: ${resp.status} ${txt}`);
  }
  const json = await resp.json();
  return json.access_token ?? json.token ?? json.data?.access_token;
}

async function getMvfSignedUrl(token: string) {
  if (!MAPPEDIN_MAP_ID) throw new Error("MAPPEDIN_MAP_ID missing");
  const url = `https://app.mappedin.com/api/venue/${MAPPEDIN_MAP_ID}/mvf`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`Mappedin MVF endpoint failed: ${r.status} ${txt}`);
  }
  const body = await r.json().catch(() => null);
  if (!body?.url) throw new Error("MVF endpoint returned no `url`");
  return body.url;
}

/** Helpers: normalize and digits */
const normalizeAlphaNum = (v: any) =>
  v == null ? null : String(v).toLowerCase().replace(/[^a-z0-9]/g, "");
const normalizeDigits = (v: any) =>
  v == null ? null : String(v).replace(/\D/g, "");

/** Geo helpers to compute centroid for Polygon / MultiPolygon / Point. */
function centroidFromCoordinates(geom: any) {
  if (!geom || !geom.type || !geom.coordinates) return null;
  const type = geom.type;
  // coordinates follow GeoJSON: [lon, lat]
  if (type === "Point") {
    const [lon, lat] = geom.coordinates;
    return { lat: lat ?? null, lng: lon ?? null };
  }
  // For Polygon and MultiPolygon: compute simple average of all vertices (not the true polygon centroid but good enough)
  const collectPoints: number[][] = [];
  if (type === "Polygon") {
    for (const ring of geom.coordinates) {
      for (const pt of ring) collectPoints.push(pt);
    }
  } else if (type === "MultiPolygon") {
    for (const poly of geom.coordinates) {
      for (const ring of poly) {
        for (const pt of ring) collectPoints.push(pt);
      }
    }
  } else if (type === "LineString") {
    for (const pt of geom.coordinates) collectPoints.push(pt);
  }

  if (collectPoints.length === 0) return null;
  let sumLon = 0,
    sumLat = 0;
  for (const [lon, lat] of collectPoints) {
    sumLon += Number(lon ?? 0);
    sumLat += Number(lat ?? 0);
  }
  return { lat: sumLat / collectPoints.length, lng: sumLon / collectPoints.length };
}

/** Try to find coords for a mappedin location using its raw data or the "spaces" geojson in the zip */
function extractLatLngFromLoc(loc: any, spaceGeomIndex: Record<string, { lat: number; lng: number }>) {
  // 1) anchor / position / anchor.coordinates
  const lat =
    loc.anchor?.coordinates?.lat ??
    loc.anchor?.lat ??
    loc.position?.lat ??
    loc._extractedLat ??
    null;
  const lng =
    loc.anchor?.coordinates?.lon ??
    loc.anchor?.lng ??
    loc.position?.lng ??
    loc._extractedLng ??
    null;
  if (lat != null && lng != null) return { lat: Number(lat), lng: Number(lng) };

  // 2) if loc.spaces exists (array of {id: 's_x'}), check spaceGeomIndex
  if (Array.isArray(loc.spaces) && loc.spaces.length > 0) {
    for (const sp of loc.spaces) {
      const sid = sp?.id;
      if (sid && spaceGeomIndex[sid]) return spaceGeomIndex[sid];
    }
  }

  // 3) sometimes loc has 'spaces' as simple ids inside 'spaces' property (string array)
  if (Array.isArray(loc.spaces)) {
    for (const spId of loc.spaces) {
      if (typeof spId === "string" && spaceGeomIndex[spId]) return spaceGeomIndex[spId];
    }
  }

  // 4) check loc.externalId linking to stall id or similar - not used here
  return null;
}

/**
 * Build an index of space geometries found in the zip files:
 * - looks for geojson files (or files that parse to GeoJSON features)
 * - within them, find features with id that starts with 's_' (space id)
 * - compute centroid and store into index: spaceId => {lat,lng}
 */
function buildSpaceIndexFromFiles(files: Record<string, Uint8Array>) {
  const idx: Record<string, { lat: number; lng: number }> = {};
  for (const filename of Object.keys(files)) {
    try {
      const lower = filename.toLowerCase();
      // Only attempt on likely geojson/json files
      if (!lower.endsWith(".json") && !lower.endsWith(".geojson")) continue;
      const bytes = files[filename];
      const text = new TextDecoder().decode(bytes);
      const parsed = JSON.parse(text);

      // two common shapes:
      //  - a FeatureCollection with .features
      //  - an array of features
      //  - some Mappedin files are object maps where features live under other keys
      let features: any[] = [];
      if (Array.isArray(parsed)) features = parsed;
      else if (parsed.type === "FeatureCollection" && Array.isArray(parsed.features)) features = parsed.features;
      else {
        // find nested features arrays
        for (const k of Object.keys(parsed)) {
          if (Array.isArray(parsed[k])) {
            const sample = parsed[k][0];
            if (sample && (sample.type === "Feature" || sample.geometry)) {
              features = parsed[k];
              break;
            }
          }
        }
        // fallback: if parsed has a geometry property (single feature-like)
        if (parsed.type === "Feature" && parsed.geometry) features = [parsed];
      }

      for (const feat of features) {
        // feature might either have .id or .properties.id or .properties.externalId
        const fid = feat.id ?? feat.properties?.id ?? feat.properties?.externalId ?? null;
        const featureId = fid ?? feat.properties?.id ?? feat.properties?.externalId ?? null;
        // mappedin spaces often appear as features with id 's_xxx' or properties.externalId containing s_x...
        let spaceId: string | null = null;
        if (featureId && typeof featureId === "string" && featureId.startsWith("s_")) {
          spaceId = featureId;
        } else if (feat.properties && feat.properties.id && typeof feat.properties.id === "string" && feat.properties.id.startsWith("s_")) {
          spaceId = feat.properties.id;
        } else if (feat.properties && feat.properties.externalId && typeof feat.properties.externalId === "string" && feat.properties.externalId.startsWith("s_")) {
          spaceId = feat.properties.externalId;
        }

        // Also some features include "id": "s_..." under top-level 'id'
        if (!spaceId && typeof feat.id === "string" && feat.id.startsWith("s_")) spaceId = feat.id;

        // If we still don't have s_ but the feature has properties.externalId that is s_..., accept it.
        if (!spaceId && feat.properties && typeof feat.properties.externalId === "string" && feat.properties.externalId.startsWith("s_")) {
          spaceId = feat.properties.externalId;
        }

        if (!spaceId) continue;

        // geometry may be under feat.geometry or feat (for raw GeoJSON)
        const geometry = feat.geometry ?? feat;
        const ct = centroidFromCoordinates(geometry);
        if (ct && ct.lat != null && ct.lng != null) {
          idx[spaceId] = { lat: ct.lat, lng: ct.lng };
        }
      }
    } catch (e) {
      // ignore single-file parse errors
      console.log(`skip geojson file ${filename}: ${String(e)}`);
      continue;
    }
  }
  return idx;
}

/** Extract location candidates from a parsed JSON file in the MVF zip */
function extractLocationsFromJsonObj(obj: any) {
  const candidates: any[] = [];
  if (!obj) return candidates;
  if (Array.isArray(obj)) {
    // sometimes the file is just an array of locations
    candidates.push(...obj);
  } else {
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (Array.isArray(v) && v.length > 0) {
        const looksLikeLocations = v.some((it: any) =>
          typeof it === "object" && (it.name || it.title || it.anchor || it.locationId || it.id)
        );
        if (looksLikeLocations) candidates.push(...v);
      }
    }
  }
  return candidates;
}

Deno.serve(async (req) => {
  try {
    const token = await getMappedinToken();
    const signedUrl = await getMvfSignedUrl(token);

    const zipResp = await fetch(signedUrl);
    if (!zipResp.ok) {
      const txt = await zipResp.text().catch(() => "");
      throw new Error(`Failed to fetch MVF zip: ${zipResp.status} ${txt}`);
    }

    const arrBuf = await zipResp.arrayBuffer();
    const uint8 = new Uint8Array(arrBuf);

    let files: Record<string, Uint8Array>;
    try {
      files = unzipSync(uint8);
    } catch (e) {
      throw new Error("Failed to unzip MVF zip: " + String(e));
    }

    // Build space geometry index from geojson files inside the zip (helps find lat/lng)
    const spaceGeomIndex = buildSpaceIndexFromFiles(files);

    const parsedLocations: any[] = [];
    for (const filename of Object.keys(files)) {
      try {
        if (!filename.toLowerCase().endsWith(".json") && !filename.toLowerCase().endsWith(".geojson")) continue;
        const bytes = files[filename];
        const text = new TextDecoder().decode(bytes);
        const parsed = JSON.parse(text);
        const found = extractLocationsFromJsonObj(parsed);
        if (found.length) parsedLocations.push(...found);
      } catch (e) {
        console.log(`skip file ${filename}: ${String(e)}`);
      }
    }

    // fallback: scan files for text that contains keys we care about
    if (parsedLocations.length === 0) {
      for (const filename of Object.keys(files)) {
        try {
          const bytes = files[filename];
          const text = new TextDecoder().decode(bytes);
          if (text.includes('"locations"') || text.includes('"anchor"') || text.includes('"position"') || text.includes('"spaces"')) {
            const parsed = JSON.parse(text);
            const found = extractLocationsFromJsonObj(parsed);
            if (found.length) parsedLocations.push(...found);
          }
        } catch {
          continue;
        }
      }
    }

    // --- load stalls (in-memory index) ---
    const { data: allStalls, error: stallsError } = await supabase
      .from("stalls")
      .select("id, stall_number");

    if (stallsError) {
      console.error("Failed to load stalls for matching:", stallsError);
      // return the full error so you can inspect during debugging
      return new Response(JSON.stringify({ error: "Failed to load stalls for matching", debug_stallsError: stallsError }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    type StallRow = { id: string; stall_number: string };
    const stallIndex: Record<string, StallRow[]> = {};

    // index stalls by normalized name and by digits
    for (const s of allStalls ?? []) {
      const norm = normalizeAlphaNum(s.stall_number);
      const digits = normalizeDigits(s.stall_number);

      if (norm) {
        stallIndex[norm] ??= [];
        stallIndex[norm].push(s);
      }
      if (digits) {
        stallIndex[`digits:${digits}`] ??= [];
        stallIndex[`digits:${digits}`].push(s);
      }
    }

    // iterate parsedLocations and upsert/attempt matches using multiple strategies
    const updated: string[] = [];
    let insertedCount = 0;

    for (const loc of parsedLocations) {
      try {
        const id = loc.id ?? loc.locationId ?? loc._id ?? null;
        const name = loc.name ?? loc.title ?? loc.label ?? null;

        // extract coordinates (anchor/position or from space geom index)
        const coordsFromLoc = extractLatLngFromLoc(loc, spaceGeomIndex);
        const lat = coordsFromLoc?.lat ?? null;
        const lng = coordsFromLoc?.lng ?? null;

        const norm = normalizeAlphaNum(name);
        const digits = normalizeDigits(name);

        await supabase.from("mappedin_locations").upsert({
          id: id ?? Math.random().toString(36).slice(2, 10),
          name,
          normalized_name: norm,
          lat,
          lng,
          raw: loc
        });

        insertedCount++;

        // Try to match stalls: first by exact normalized name, then by digits fallback
        let matchedStalls: StallRow[] | undefined = undefined;
        if (norm && stallIndex[norm]) matchedStalls = stallIndex[norm];
        else if (digits && stallIndex[`digits:${digits}`]) matchedStalls = stallIndex[`digits:${digits}`];

        if (matchedStalls && matchedStalls.length > 0) {
          for (const s of matchedStalls) {
            const { error: updateErr } = await supabase
              .from("stalls")
              .update({
                geom: (lat != null && lng != null) ? `SRID=4326;POINT(${Number(lng)} ${Number(lat)})` : null,
                mappedin_zone_id: id ?? null
              })
              .eq("id", s.id);

            if (!updateErr) updated.push(s.stall_number);
            else console.error("Failed updating stall", s.stall_number, updateErr);
          }
        }
      } catch (e) {
        console.log("failed processing location", e);
        continue;
      }
    }

    // Return summary
    return new Response(JSON.stringify({
      message: `Processed ${Object.keys(files).length} files, found ${parsedLocations.length} locations, persisted ${insertedCount} mappedin_locations, synced ${updated.length} stalls`,
      updated_stalls: updated
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { headers: { "Content-Type": "application/json" }, status: 500 });
  }
});
