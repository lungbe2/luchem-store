import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Admin client with service role (bypasses ALL RLS)
// Only create if we have the key, otherwise return null
export const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Fallback to regular supabase client if admin client not available
export const getAdminClient = () => {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }
  return null;
};
