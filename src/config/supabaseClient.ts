import { supabase } from '../lib/supabase';
export { supabase };

// Re-export for backwards compatibility
export function getSupabaseClient() {
  return supabase;
}
