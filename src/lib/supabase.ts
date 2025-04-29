
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nmcqyudqvbldxwzhyzma.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tY3F5dWRxdmJsZHh3emh5em1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDg3NzQsImV4cCI6MjA1Nzc4NDc3NH0.xV1bMMoTHuglbW72yoT2Hnh-pqkSWKHTE-mOsOQoC8g";

// Create Supabase client with explicit auth configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  }
});

export type Tables = Database['public']['Tables'];

// Define a type-safe version for table access
type TableNames = keyof Database['public']['Tables'] | string;

// Define a simplified version for table access
export function from(tableName: TableNames) {
  // Using type assertion to prevent TypeScript errors while keeping functionality
  return supabase.from(tableName as any);
}
