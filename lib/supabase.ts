import { createClient, SupabaseClientOptions } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eoipvmwhbcchxibgkgjy.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaXB2bXdoYmNjaHhpYmdrZ2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjc0NzksImV4cCI6MjEwNjkwMzQ3OX0.O_OSmPlQKgfTneoZRCxP_VBXRL60H5vvJXyyf64C3Kc';

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
