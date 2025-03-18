
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create a type-safe helper for dynamic table access
export function getTable<T = any>(tableName: string) {
  return supabase.from(tableName as any) as any;
}

// For strongly typed table access, use these functions:
export const tables = {
  experts: () => supabase.from('experts'),
  appointments: () => supabase.from('appointments'),
  profiles: () => supabase.from('profiles'),
  users: () => supabase.from('users'),
  user_reviews: () => supabase.from('user_reviews'),
  expert_availability: () => supabase.from('expert_availability'),
  // Add other tables as needed
};

export default supabase;
