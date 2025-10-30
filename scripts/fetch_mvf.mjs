// Fetch Mappedin MVF zip using your Supabase Edge Function token and save under public/mappedin/market.mvf.zip
// Usage: node scripts/fetch_mvf.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const envPath = path.join(repoRoot, '.env');

function loadDotEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // Remove optional surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

async function getOutdoorToken(functionsUrl, anonKey, mapId) {
  const url = `${functionsUrl.replace(/\/?$/, '')}/mappedin_token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ mapId }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Token request failed: ${res.status} ${res.statusText} ${txt}`);
  }
  const json = await res.json();
  if (!json || !json.outdoorViewToken) {
    throw new Error(`Token missing in response: ${JSON.stringify(json)}`);
  }
  return json.outdoorViewToken;
}

async function tryFetch(url, token) {
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const ct = res.headers.get('content-type') || '';
  if (!res.ok) {
    return { ok: false, status: res.status, statusText: res.statusText, ct };
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return { ok: true, buf, ct, status: res.status };
}

async function main() {
  const env = loadDotEnv(envPath);
  const FUNCTIONS_URL = env.VITE_SUPABASE_FUNCTIONS_URL;
  const ANON = env.VITE_SUPABASE_ANON_KEY;
  const MAP_ID = env.VITE_MAPPEDIN_MAP_ID;
  if (!FUNCTIONS_URL || !ANON || !MAP_ID) {
    console.error('Missing env: ensure VITE_SUPABASE_FUNCTIONS_URL, VITE_SUPABASE_ANON_KEY, and VITE_MAPPEDIN_MAP_ID are set in .env');
    process.exit(1);
  }

  console.log('Requesting Mappedin outdoor token via Edge Function...');
  const token = await getOutdoorToken(FUNCTIONS_URL, ANON, MAP_ID);
  console.log(`Token acquired (first 12): ${token.slice(0, 12)}...`);

  const candidates = [
    `https://api.mappedin.com/venues/${MAP_ID}/mvf?format=zip`,
    `https://api.mappedin.com/venues/${MAP_ID}/mvf`,
    `https://app.mappedin.com/api/print/v2/venues/${MAP_ID}/mvf`,
    `https://app.mappedin.com/print/v2/venues/${MAP_ID}/mvf`,
    `https://account.mappedin.com/api/venues/${MAP_ID}/mvf`,
  ];

  let success = null;
  for (const url of candidates) {
    process.stdout.write(`Trying ${url} ... `);
    try {
      const res = await tryFetch(url, token);
      if (res.ok && (res.ct.includes('zip') || res.ct.includes('octet-stream'))) {
        console.log(`OK (${res.status}, ${res.ct})`);
        success = res.buf;
        break;
      } else {
        console.log(`FAILED (${res.status} ${res.ct})`);
      }
    } catch (e) {
      console.log(`ERROR (${e.message})`);
    }
  }

  if (!success) {
    console.error('Could not download MVF from known endpoints. Please contact support or try again later.');
    process.exit(2);
  }

  const outDir = path.join(repoRoot, 'public', 'mappedin');
  const outFile = path.join(outDir, 'market.mvf.zip');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, success);
  console.log(`Saved MVF zip to ${path.relative(repoRoot, outFile)}`);

  // Update .env with VITE_MAPPEDIN_MVF_URL
  const devUrl = 'http://localhost:3001/mappedin/market.mvf.zip';
  const existing = fs.readFileSync(envPath, 'utf8');
  let next = '';
  if (existing.match(/^VITE_MAPPEDIN_MVF_URL=.*$/m)) {
    next = existing.replace(/^VITE_MAPPEDIN_MVF_URL=.*$/m, `VITE_MAPPEDIN_MVF_URL=${devUrl}`);
  } else {
    next = existing.trimEnd() + `\nVITE_MAPPEDIN_MVF_URL=${devUrl}\n`;
  }
  fs.writeFileSync(envPath, next);
  console.log(`Updated .env VITE_MAPPEDIN_MVF_URL=${devUrl}`);

  console.log('Done. Restart your dev server to pick up the new .env and MVF.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
