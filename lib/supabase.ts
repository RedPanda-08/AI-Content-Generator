import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

// This is a client-side supabase client
export const supabase = createPagesBrowserClient()