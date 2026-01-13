import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client. Uses the Service Role key and must only run
// on the server (do NOT expose SUPABASE_SERVICE_ROLE_KEY to the browser).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || ''

if (!supabaseUrl) {
  console.warn('Supabase URL is not set (NEXT_PUBLIC_SUPABASE_URL)')
}

if (!supabaseServiceKey) {
  // We don't throw here to avoid crashing non-realtime environments, but
  // server functions that require Supabase should handle the missing key.
  console.warn('Supabase service key is not set (SUPABASE_SERVICE_ROLE_KEY)')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default supabase
