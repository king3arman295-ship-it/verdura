// Non-Supabase env constants live here, separate from lib/supabase.ts.
// Components that only need these (e.g. WhatsApp buttons on the homepage
// or product cards) should import from this file instead of lib/supabase.ts,
// so they don't drag the entire @supabase/supabase-js client into their
// route chunk just to read a phone number.

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '1234567890'
