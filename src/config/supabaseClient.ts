// import { createClient } from '@supabase/supabase-js';
// import type { Database } from '../types/supabase';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

// export const supabase = (() => {
//   if (!supabaseInstance) {
//     supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey);
//   }
//   return supabaseInstance;
// })();




// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

declare global {
  // survive HMR in dev
  // eslint-disable-next-line no-var
  var __supabase_client__: ReturnType<typeof createClient<Database>> | undefined;
}

function makeClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase =
  globalThis.__supabase_client__ ?? (globalThis.__supabase_client__ = makeClient());
