// supabase/functions/mappedin_mvf_local/index.ts
// Fetches MVF v3 from Supabase Storage and returns it as base64
// This allows the client to use locally hosted MVF files

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const MVF_BUCKET = 'mappedin-files';
const MVF_FILE_PATH = 'davao-city.mvf.zip';

console.log('MVF Local function startup.');
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('Service role key present:', !!SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') ?? '';
  const allowOrigin = origin || '*';
  const allowCredentials = origin ? 'true' : 'false';

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': allowCredentials,
      },
    });
  }

  try {
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Downloading MVF file from Supabase Storage:', MVF_BUCKET, MVF_FILE_PATH);

    // Download the MVF file from storage
    const { data, error } = await supabase.storage
      .from(MVF_BUCKET)
      .download(MVF_FILE_PATH);

    if (error) {
      console.error('Failed to download MVF from storage:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to download MVF file', detail: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowOrigin,
            'Access-Control-Allow-Credentials': allowCredentials,
          },
        }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: 'MVF file not found in storage' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowOrigin,
            'Access-Control-Allow-Credentials': allowCredentials,
          },
        }
      );
    }

    console.log('MVF file downloaded, size:', data.size, 'bytes');

    // Convert blob to ArrayBuffer then to base64
    const arrayBuffer = await data.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Convert to base64
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
    }
    const mvfBase64 = btoa(binary);

    console.log('MVF converted to base64, length:', mvfBase64.length);

    // Return the base64-encoded MVF
    return new Response(
      JSON.stringify({ 
        mvfBase64,
        source: 'supabase-storage',
        bucket: MVF_BUCKET,
        path: MVF_FILE_PATH,
        size: bytes.length
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Credentials': allowCredentials,
        },
      }
    );
  } catch (err) {
    console.error('Function error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowOrigin,
          'Access-Control-Allow-Credentials': allowCredentials,
        },
      }
    );
  }
});
