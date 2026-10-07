import { createClient, SupabaseClientOptions } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eoipvmwhbcchxibgkgjy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_O7nLUYL5b9NBTUBlDmIupg_Q5g3qMxZ';

const options: SupabaseClientOptions<'public'> = {
  auth: {
    persistSession: typeof window !== 'undefined',
  },
};

if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require('ws');
    options.realtime = {
      transport: ws,
    };
  } catch {
    // ws is optional fallback
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);
