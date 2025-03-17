
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These values should be replaced with your actual Supabase URL and anon key
// after connecting to Supabase in Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please connect your Supabase project in Lovable.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
