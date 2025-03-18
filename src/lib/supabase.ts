
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nmcqyudqvbldxwzhyzma.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tY3F5dWRxdmJsZHh3emh5em1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDg3NzQsImV4cCI6MjA1Nzc4NDc3NH0.xV1bMMoTHuglbW72yoT2Hnh-pqkSWKHTE-mOsOQoC8g";

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function with proper typing
export function from<T extends keyof Database['public']['Tables']>(
  table: T
) {
  return supabase.from(table);
}
