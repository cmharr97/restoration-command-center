// This file wires up the Supabase client.
//
// When live Supabase credentials are configured (VITE_SUPABASE_URL and
// VITE_SUPABASE_PUBLISHABLE_KEY), it creates the real Supabase client and the
// app behaves exactly as in production — real authentication and live data.
//
// When those credentials are missing, it falls back to a safe, local
// "Demo Preview Mode" client that serves realistic sample data from memory and
// never touches a live Supabase project. See src/lib/demo/.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { IS_DEMO_MODE } from '@/lib/demo/isDemoMode';
import { demoSupabase } from '@/lib/demo/demoClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = IS_DEMO_MODE
  ? (demoSupabase as ReturnType<typeof createClient<Database>>)
  : createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
