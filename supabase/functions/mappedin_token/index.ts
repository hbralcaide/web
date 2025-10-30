// supabase/functions/mappedin_token/index.ts
// Deno edge function — exchange server-stored Mappedin credentials for an SDK token.
// - Reads server secrets (MAPPEDIN_*, SUPABASE_ANON_KEY).
// - Accepts POST body { mapId?: string } to override the map id (optional, for dev).
// - Validates incoming Authorization header against the anon key (browser-safe).
// - Returns { outdoorViewToken, mapIdUsed } on success for easy verification.

const MAPPEDIN_CLIENT_ID =
  Deno.env.get("MAPPEDIN_CLIENT_ID") ?? Deno.env.get("VITE_MAPPEDIN_API_KEY");
const MAPPEDIN_CLIENT_SECRET =
  Deno.env.get("MAPPEDIN_CLIENT_SECRET") ?? Deno.env.get("VITE_MAPPEDIN_SECRET");
const MAPPEDIN_MAP_ID =
  Deno.env.get("MAPPEDIN_MAP_ID") ?? Deno.env.get("VITE_MAPPEDIN_MAP_ID");

const SUPABASE_ANON_KEY =
  Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("VITE_SUPABASE_ANON_KEY");

// Prefer OAuth client credentials flow
const MAPPEDIN_AUTH_URL_OAUTH = "https://account.mappedin.com/oauth/token";

console.log("Mappedin function startup. Env presence:");
console.log(" - MAPPEDIN_CLIENT_ID present:", !!MAPPEDIN_CLIENT_ID);
console.log(" - MAPPEDIN_CLIENT_SECRET present:", !!MAPPEDIN_CLIENT_SECRET);
console.log(" - MAPPEDIN_MAP_ID present:", !!MAPPEDIN_MAP_ID);
console.log(" - SUPABASE_ANON_KEY present:", !!SUPABASE_ANON_KEY);

// simple retry helper
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delayMs = 1000) {
  let lastErr: any = null;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      lastErr = err;
      console.warn(`fetch attempt ${i + 1} failed for ${url}:`, err);
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = origin || "*";
  const allowCredentials = origin ? "true" : "false";

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": allowCredentials,
      },
    });
  }

  // Basic auth header check (compare with anon key if available)
  const authHeader = req.headers.get("authorization") ?? "";
  if (SUPABASE_ANON_KEY) {
    const expected = `Bearer ${SUPABASE_ANON_KEY}`;
    if (!authHeader || authHeader !== expected) {
      console.warn("Unauthorized request to mappedin_token - missing/invalid Authorization header");
      return new Response(JSON.stringify({ code: 401, message: "Missing or invalid authorization header" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }
  }

  try {
    if (!MAPPEDIN_CLIENT_ID || !MAPPEDIN_CLIENT_SECRET) {
      console.error("Missing Mappedin client credentials in function env");
      return new Response(JSON.stringify({ error: "Missing mappedin env vars" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }

    // parse optional body for mapId override
    let requestedMapId: string | undefined = undefined;
    if (req.method === "POST") {
      try {
        const body = await req.json().catch(() => ({}));
        if (body && typeof body.mapId === "string" && body.mapId.trim().length > 0) {
          requestedMapId = body.mapId.trim();
        }
      } catch {
        requestedMapId = undefined;
      }
    }

    const mapIdUsed = requestedMapId ?? MAPPEDIN_MAP_ID;
    console.log("Mappedin token request. mapIdUsed:", mapIdUsed);

    // Build candidate payloads/endpoints:
    // 1) OAuth client_credentials (preferred)
    // 2) Legacy key/secret JSON (fallback)
    const payloads: Array<{ url: string; body: any; headers?: Record<string,string> }> = [
      {
        url: MAPPEDIN_AUTH_URL_OAUTH,
        body: {
          client_id: MAPPEDIN_CLIENT_ID,
          client_secret: MAPPEDIN_CLIENT_SECRET,
          audience: "https://api.mappedin.com",
          grant_type: "client_credentials",
        },
        headers: { "Content-Type": "application/json" },
      },
      {
        url: "https://app.mappedin.com/api/v1/api-key/token",
        body: { key: MAPPEDIN_CLIENT_ID, secret: MAPPEDIN_CLIENT_SECRET, mapId: mapIdUsed },
        headers: { "Content-Type": "application/json" },
      },
      {
        url: "https://app.mappedin.com/api/v1/api-key/token",
        body: { client_id: MAPPEDIN_CLIENT_ID, client_secret: MAPPEDIN_CLIENT_SECRET, grant_type: "client_credentials", mapId: mapIdUsed },
        headers: { "Content-Type": "application/json" },
      },
    ];

    let lastResp: Response | null = null;
    let lastText = "";

    for (const p of payloads) {
      try {
        console.log("Attempting Mappedin auth via:", p.url, " keys:", Object.keys(p.body).join(","));
        const resp = await fetchWithRetry(p.url, {
          method: "POST",
          headers: p.headers ?? { "Content-Type": "application/json" },
          body: JSON.stringify(p.body),
        });
        lastResp = resp;
        lastText = await resp.text().catch(() => "");
        console.log("Mappedin response status:", resp.status);
        if (resp.ok) break;
        console.warn("Mappedin returned non-OK status:", resp.status, lastText);
      } catch (err) {
        console.error("Network/fetch error calling Mappedin auth:", err);
        lastText = String(err);
      }
    }

    if (!lastResp) {
      console.error("No response from Mappedin after attempts");
      return new Response(JSON.stringify({ error: "No response from Mappedin", detail: lastText }), {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }

    if (!lastResp.ok) {
      let parsed: any = lastText;
      try { parsed = JSON.parse(lastText); } catch (_) { /* raw text */ }
      console.error("Mappedin auth failed:", lastResp.status, parsed);
      return new Response(JSON.stringify({ error: "mappedin auth failed", status: lastResp.status, body: parsed }), {
        status: lastResp.status >= 400 && lastResp.status < 600 ? lastResp.status : 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }

    // parse success response
    let json: any;
    try {
      json = JSON.parse(lastText);
    } catch (err) {
      json = { raw: lastText };
    }

    // Common token keys (Mappedin may return outdoorViewToken)
    const token =
      json.outdoorViewToken ??
      json.access_token ??
      json.token ??
      json.data?.access_token ??
      json.accessToken ??
      null;

    if (!token) {
      console.warn("Mappedin auth succeeded but no token key recognized. Returning raw response and mapIdUsed.", json);
      return new Response(JSON.stringify({ raw: json, mapIdUsed }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Credentials": allowCredentials,
        },
      });
    }

    // success: return normalized shape and map id used (helpful for client verification)
    return new Response(JSON.stringify({ outdoorViewToken: token, mapIdUsed }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Credentials": allowCredentials,
      },
    });
  } catch (err) {
    console.error("Function error:", err);
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
