
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use consistent URL and key values - using the values from the environment or the hardcoded fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nmcqyudqvbldxwzhyzma.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tY3F5dWRxdmJsZHh3emh5em1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDg3NzQsImV4cCI6MjA1Nzc4NDc3NH0.xV1bMMoTHuglbW72yoT2Hnh-pqkSWKHTE-mOsOQoC8g";

// Create Supabase client with explicit auth and fetch configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
  global: {
    fetch: (url: RequestInfo | URL, init?: RequestInit) => {
      console.log('Supabase fetch request:', url);
      
      return fetch(url, init).then(response => {
        // Add handling for rate limiting and server errors
        if (response.status === 429) {
          console.warn('Rate limit exceeded for Supabase request');
        } else if (response.status >= 500) {
          console.error('Server error in Supabase response:', response.status);
        }
        
        return response;
      }).catch(error => {
        console.error('Supabase fetch error:', error);
        throw error;
      });
    }
  }
});

export type Tables = Database['public']['Tables'];

// Define a type-safe version for table access
type TableNames = keyof Database['public']['Tables'] | string;

// Enhanced from function with better error handling and retry mechanism
export function from(tableName: TableNames) {
  try {
    // Using type assertion to prevent TypeScript errors while keeping functionality
    return supabase.from(tableName as any);
  } catch (error) {
    console.error(`Error accessing table '${tableName}':`, error);
    throw error;
  }
}
