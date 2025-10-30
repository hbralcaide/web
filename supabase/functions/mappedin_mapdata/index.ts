// supabase/functions/mappedin_mapdata/index.ts
// Deno edge function — returns { mapData } (preferred) or { mvfBase64 } (fallback).
// Usage: POST { "mapId": "<map id>" } (mapId optional — will use env var fallback).
// Requires these secrets in the function's environment:
//   MAPPEDIN_CLIENT_ID  (or VITE_MAPPEDIN_API_KEY)
//   MAPPEDIN_CLIENT_SECRET (or VITE_MAPPEDIN_SECRET)
//   MAPPEDIN_MAP_ID (or VITE_MAPPEDIN_MAP_ID)

const MAPPEDIN_CLIENT_ID =
  Deno.env.get("MAPPEDIN_CLIENT_ID") ?? Deno.env.get("VITE_MAPPEDIN_API_KEY");
const MAPPEDIN_CLIENT_SECRET =
  Deno.env.get("MAPPEDIN_CLIENT_SECRET") ?? Deno.env.get("VITE_MAPPEDIN_SECRET");
const DEFAULT_MAPPEDIN_MAP_ID =
  Deno.env.get("MAPPEDIN_MAP_ID") ?? Deno.env.get("VITE_MAPPEDIN_MAP_ID");

const MAPPEDIN_AUTH_URLS = [
  // OAuth (preferred)
  "https://account.mappedin.com/oauth/token",
  // Legacy
  "https://app.mappedin.com/api/v1/api-key/token",
];

console.log("Mappedin function startup. Using map id (env):", DEFAULT_MAPPEDIN_MAP_ID);
console.log("Mappedin client id present:", !!MAPPEDIN_CLIENT_ID);
console.log("Mappedin client secret present:", !!MAPPEDIN_CLIENT_SECRET);

// small helper
async function fetchWithRetry(url: string, options: RequestInit = {}, attempts = 3, delayMs = 700) {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url, options);
      return r;
    } catch (err) {
      lastErr = err;
      console.warn(`fetch attempt ${i + 1} failed for ${url}:`, err);
      if (i < attempts - 1) await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw lastErr;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = origin || "*";
  const allowCredentials = origin ? "true" : "false";

  // handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": allowCredentials,
      },
    });
  }

  try {
    // parse body if present
    let bodyMapId: string | undefined = undefined;
    if (req.method === "POST") {
      try {
        const j = await req.json().catch(() => null);
        if (j && typeof j === "object" && j.mapId) bodyMapId = String((j as any).mapId);
      } catch (e) {
        // ignore
      }
    } else {
      // also allow GET? check query param
      const url = new URL(req.url);
      bodyMapId = url.searchParams.get("mapId") ?? undefined;
    }

    const mapId = bodyMapId ?? DEFAULT_MAPPEDIN_MAP_ID;
    if (!mapId) {
      return new Response(JSON.stringify({ error: "Missing mapId (no body param and no env fallback)" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }

    if (!MAPPEDIN_CLIENT_ID || !MAPPEDIN_CLIENT_SECRET) {
      console.error("Missing mappedin credentials in env");
      return new Response(JSON.stringify({ error: "Missing mappedin credentials in env" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }

    // 1) Exchange client id/secret for token (try both payload shapes)
    console.log("Requesting mappedin token...");
    const authPayloads: Array<{ url: string; body: any }> = [
      { url: MAPPEDIN_AUTH_URLS[0], body: { client_id: MAPPEDIN_CLIENT_ID, client_secret: MAPPEDIN_CLIENT_SECRET, audience: "https://api.mappedin.com", grant_type: "client_credentials" } },
      { url: MAPPEDIN_AUTH_URLS[1], body: { key: MAPPEDIN_CLIENT_ID, secret: MAPPEDIN_CLIENT_SECRET } },
      { url: MAPPEDIN_AUTH_URLS[1], body: { client_id: MAPPEDIN_CLIENT_ID, client_secret: MAPPEDIN_CLIENT_SECRET, grant_type: "client_credentials" } },
    ];

    let token: string | null = null;
    let lastAuthRespText = "";
    for (const p of authPayloads) {
      try {
        const authRes = await fetchWithRetry(p.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p.body),
        }, 3, 500);
        lastAuthRespText = await authRes.text().catch(() => "");
        console.log("Mappedin auth status:", authRes.status);
        if (authRes.ok) {
          try {
            const j = JSON.parse(lastAuthRespText);
            token =
              j.outdoorViewToken ??
              j.access_token ??
              j.token ??
              j.data?.access_token ??
              j.accessToken ??
              null;
            if (!token && typeof j === "string") token = j;
          } catch (err) {
            // not json
            console.warn("Auth response not JSON:", lastAuthRespText);
          }
          if (token) break;
        } else {
          console.warn("Mappedin auth payload returned non-ok:", authRes.status, lastAuthRespText);
        }
      } catch (err) {
        console.warn("Mappedin auth attempt failed:", err);
      }
    }

    if (!token) {
      // If we couldn't get token, return auth diagnostics
      return new Response(JSON.stringify({ error: "Failed to obtain mappedin token", detail: lastAuthRespText }), {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }

    console.log("Obtained mappedin token (first 60 chars):", token.slice(0, 60));

    // 2) Try to fetch map JSON from several likely endpoints (order matters)
    // Note: Mappedin's public API shape can vary by account; we attempt multiple possible endpoints.
    const candidateEndpoints = [
      // Modern API candidates
      `https://api.mappedin.com/venues/${mapId}/mvf`,
      `https://api.mappedin.com/venue/${mapId}/mvf`,
      `https://api.mappedin.com/venues/${mapId}/map`,
      `https://api.mappedin.com/maps/${mapId}/mvf`,
      // Legacy API candidates
      `https://app.mappedin.com/api/v1/maps/${mapId}/mvf`,
      `https://app.mappedin.com/api/v1/maps/${mapId}/mvf/download`,
      `https://app.mappedin.com/api/v1/maps/${mapId}/map`,
      `https://app.mappedin.com/api/v1/maps/${mapId}/mapdata`,
      `https://app.mappedin.com/api/v1/maps/${mapId}`,
    ];

    // Also include the token-bearing query param form as fallback used by some APIs
    const tokenQuerySuffix = `?token=${encodeURIComponent(token)}`;

    let finalJson: any = null;
    let finalMvfBase64: string | null = null;
    let lastFetchDiagnostics: any = { tried: [] };

    for (const endpoint of candidateEndpoints) {
      const triedUrls = [
        endpoint,
        // try token as Bearer header first (preferred), and if that fails, try token as query param
        `${endpoint}${tokenQuerySuffix}`,
      ];

      for (const url of triedUrls) {
        try {
          console.log("Attempting to GET map endpoint:", url);
          // use Bearer header where possible
          const r = await fetchWithRetry(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }, 2, 500);

          const contentType = r.headers.get("content-type") ?? "";
          const status = r.status;
          lastFetchDiagnostics.tried.push({ url, status, contentType });

          if (!r.ok) {
            console.warn("Non-OK from map endpoint:", url, status);
            // if 401/403/4xx, record and continue
            const txt = await r.text().catch(() => "");
            lastFetchDiagnostics.lastText = txt;
            continue;
          }

          // If JSON, parse and return as mapData object
          if (contentType.includes("application/json") || contentType.includes("application/vnd.api+json")) {
            const j = await r.json().catch((e) => {
              console.warn("Failed to parse JSON from", url, e);
              return null;
            });
            if (j) {
              // Heuristic: if response contains "mapData" or floors/layers, return as mapData
              finalJson = j.mapData ?? j;
              console.log("Successfully fetched JSON mapData from", url);
              break;
            }
          }

          // If content-type looks like binary (mvf), read as arrayBuffer and base64 it
          if (contentType.includes("application/octet-stream") || contentType.includes("application/x-mvf") || contentType.includes("binary") || contentType.includes("application/zip")) {
            const ab = await r.arrayBuffer();
            // base64 encode
            const bytes = new Uint8Array(ab);
            // fast base64 via from
            let binary = "";
            const chunkSize = 0x8000;
            for (let i = 0; i < bytes.length; i += chunkSize) {
              binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
            }
            const mvfBase64 = btoa(binary);
            finalMvfBase64 = mvfBase64;
            console.log("Successfully fetched MVF binary from", url);
            break;
          }

          // If content-type is text (maybe compressed JSON or wrapper), try to read text and attempt JSON parse
          const txt = await r.text().catch(() => "");
          if (txt) {
            try {
              const parsed = JSON.parse(txt);
              finalJson = parsed.mapData ?? parsed;
              console.log("Parsed JSON from text at", url);
              break;
            } catch (e) {
              console.warn("Text response not JSON at", url);
              // maybe it's an MVF base64 already? If text is long binary-looking, try to detect MVF signature
              // fallback: if the response starts with "PK" (zip) or non-printable, treat as binary -> base64
              if (/[\x00-\x08]/.test(txt)) {
                // contains control chars -> likely binary disguised as text; produce base64 from raw text via encode
                const encoder = new TextEncoder();
                const arr = encoder.encode(txt);
                let binary = "";
                for (let i = 0; i < arr.length; i += 0x8000) {
                  binary += String.fromCharCode.apply(null, Array.from(arr.subarray(i, i + 0x8000)));
                }
                finalMvfBase64 = btoa(binary);
                console.log("Treated text response as binary and base64-encoded from", url);
                break;
              }
            }
          }

          // Not JSON and not recognized binary: continue to next attempt
        } catch (err) {
          console.warn("Error fetching map endpoint", url, err);
          lastFetchDiagnostics.tried.push({ url, error: String(err) });
        }
      }

      if (finalJson || finalMvfBase64) break;
    }

    // If we found JSON mapData, return it
    if (finalJson) {
      return new Response(JSON.stringify({ mapData: finalJson, tokenUsed: token.slice(0, 60) }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }

    // If we found an MVF binary, return base64 so client can parse
    if (finalMvfBase64) {
      return new Response(JSON.stringify({ mvfBase64: finalMvfBase64, tokenUsed: token.slice(0, 60) }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }

    // Nothing usable found — return diagnostics
    return new Response(
      JSON.stringify({
        error: "Failed to fetch map data from Mappedin (no JSON or MVF found).",
        diagnostics: lastFetchDiagnostics,
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      }
    );
  } catch (err) {
    console.error("Function top-level error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Credentials": allowCredentials,
      },
    });
  }
});
