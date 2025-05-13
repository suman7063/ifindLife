
import { supabase } from '@/lib/supabase';

/**
 * Helper function to query Supabase tables
 * This replaces the missing `from` export in the Supabase client
 */
export const from = <T = any>(table: string) => {
  return supabase.from<T>(table);
};
