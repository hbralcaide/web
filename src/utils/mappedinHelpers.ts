// src/utils/mappedinHelpers.ts
export type MappedinServerResponse =
  | { outdoorViewToken: string }
  | { mapData: any } // mapData can be MVF-parsed JSON or an object accepted by show3dMap
  | any;

// Normalize the Supabase Functions base URL so we never accidentally nest a function name
// Acceptable forms:
//  - https://<ref>.functions.supabase.co
//  - https://<ref>.supabase.co/functions/v1
// We will trim any trailing path like /sync_mappedin_stalls if it was mistakenly included.
function normalizeFunctionsBase(raw?: string): string {
  const DEFAULTS = [
    "https://udxoepcssfhljwqbvhbd.functions.supabase.co",
    "https://udxoepcssfhljwqbvhbd.supabase.co/functions/v1",
  ];
  let url = (raw || "").trim();
  if (!url) return DEFAULTS[0];

  // Remove query/hash
  url = url.split("?")[0].split("#")[0];
  // Trim trailing slashes
  url = url.replace(/\/+$/, "");

  // If it's the functions domain, drop any path after the domain
  const fnDomainMatch = url.match(/^(https?:\/\/[^\/]*\.functions\.supabase\.co)(?:\/.*)?$/i);
  if (fnDomainMatch) return fnDomainMatch[1];

  // If it's the supabase.co domain with /functions/v1, keep up to that prefix
  const v1Match = url.match(/^(https?:\/\/[^\/]*\.supabase\.co)\/functions\/v1(?:\/.*)?$/i);
  if (v1Match) return `${v1Match[1]}/functions/v1`;

  // If it contains /functions but not /v1, add /v1
  const fnMatch = url.match(/^(https?:\/\/[^\/]*\.supabase\.co)\/functions(?:\/.*)?$/i);
  if (fnMatch) return `${fnMatch[1]}/functions/v1`;

  // Fallback to defaults
  return DEFAULTS[0];
}

const NORMALIZED_BASE = normalizeFunctionsBase(import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string | undefined);
const tokenUrl = `${NORMALIZED_BASE}/mappedin_token`;
const mapDataUrl = `${NORMALIZED_BASE}/mappedin_mapdata`;
const mvfLocalUrl = `${NORMALIZED_BASE}/mappedin_mvf_local`;

// Add retry functionality
async function fetchWithRetry(url: string, init?: RequestInit, retries = 3) {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...init?.headers,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        return { res: response, body: await response.json() };
      } else {
        return { res: response, body: await response.text() };
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // exponential backoff
      }
    }
  }
  
  throw lastError;
}

async function doFetch(url: string, init?: RequestInit) {
  return fetchWithRetry(url, init);
}

/**
 * Fetch MVF v3 file from Supabase Storage via edge function
 */
export async function fetchMappedinMVFLocal(): Promise<{ mvfBase64: string } | null> {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!anonKey) {
    console.warn("VITE_SUPABASE_ANON_KEY missing; cannot call function.");
    return null;
  }

  try {
    console.log("🗺️ Fetching MVF from local Supabase Storage via function...");
    const { res, body } = await doFetch(mvfLocalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      console.warn("fetchMappedinMVFLocal returned non-ok:", res.status, body);
      return null;
    }

    console.log("🗺️ Successfully fetched MVF from local storage, size:", body.size);
    return body;
  } catch (err) {
    console.warn("fetchMappedinMVFLocal failed:", err);
    return null;
  }
}

/**
 * Try to fetch full mapData from server (preferred).
 * Server endpoint: mappedin_mapdata should accept POST { mapId } and return:
 *  - { mapData: {...} }  OR
 *  - { mvfUrl: "https://..." } OR
 *  - { outdoorViewToken: "..." } as fallback
 */
export async function fetchMappedinMapData(mapId?: string): Promise<MappedinServerResponse | null> {
  // Allow disabling this path to avoid noisy console errors if your account/API does not serve map JSON
  if ((import.meta.env.VITE_MAPPEDIN_SKIP_MAPDATA as any) === 'true') {
    return null;
  }
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!anonKey) {
    console.warn("VITE_SUPABASE_ANON_KEY missing in client env; cannot call functions securely.");
  }

  try {
    const { res, body } = await doFetch(mapDataUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(anonKey ? { Authorization: `Bearer ${anonKey}` } : {}),
      },
      body: JSON.stringify({ mapId }),
    });

    if (!res.ok) {
      console.warn("fetchMappedinMapData server returned non-ok:", res.status, body);
      return null;
    }

    // If server returned mapData or mvfUrl or token, just pass it back
    return body;
  } catch (err) {
    console.warn("fetchMappedinMapData failed:", err);
    return null;
  }
}

/**
 * Existing function: ask server for token-only (mappedin_token)
 */
export async function getMappedinTokenFromServer(): Promise<{ outdoorViewToken: string } | any> {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!anonKey) throw new Error("Missing client anon key: VITE_SUPABASE_ANON_KEY");

  // Try call to token endpoint (POST {} or with mapId blank)
  const { res, body } = await doFetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    throw new Error(`Failed to get mappedin token: ${res.status} ${JSON.stringify(body)}`);
  }

  // Normalize shapes
  const candidate =
    body?.outdoorViewToken ??
    body?.token ??
    body?.access_token ??
    body?.data?.access_token ??
    (typeof body === "string" ? body : undefined);

  if (!candidate) return body;
  return { outdoorViewToken: candidate };
}

/**
 * Single helper used by client to get either mapData or a token.
 * Priority:
 *  1) server mappedin_mapdata -> returns {mapData} OR {mvfUrl} OR {outdoorViewToken}
 *  2) fallback to mappedin_token -> returns {outdoorViewToken}
 */
export async function getMappedinMapDataOrToken(mapId?: string) {
  // 1) try mapData endpoint
  const mapResp = await fetchMappedinMapData(mapId);
  if (mapResp) {
    // prefer mapData
    if (mapResp.mapData || mapResp.mvfUrl) return mapResp;
    if (mapResp.outdoorViewToken || mapResp.token || mapResp.access_token) {
      const token = mapResp.outdoorViewToken ?? mapResp.token ?? mapResp.access_token;
      return { outdoorViewToken: token };
    }
  }

  // 2) fallback to token endpoint
  return await getMappedinTokenFromServer();
}
