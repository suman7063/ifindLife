
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { CustomTable } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nmcqyudqvbldxwzhyzma.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tY3F5dWRxdmJsZHh3emh5em1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDg3NzQsImV4cCI6MjA1Nzc4NDc3NH0.xV1bMMoTHuglbW72yoT2Hnh-pqkSWKHTE-mOsOQoC8g";

// Create a type that combines the Database type and CustomTable type
type SupabaseSchema = Database['public']['Tables'] & { [K in keyof CustomTable]: { Row: CustomTable[K] } };

// Extend the PostgrestQueryBuilder to include our custom tables
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to perform type-safe queries on custom tables
export const from = <T extends keyof CustomTable>(table: T) => {
  return supabase.from(table as string) as unknown as ReturnType<typeof supabase.from<CustomTable[T]>>;
};
