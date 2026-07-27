import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true },
})

// Re-exported for backward compatibility — prefer importing WHATSAPP_NUMBER
// directly from lib/env.ts in components that don't otherwise need the
// Supabase client, so their bundle chunk stays small.
export { WHATSAPP_NUMBER } from './env'
