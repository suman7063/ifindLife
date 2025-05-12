
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

          // Create a detailed error for 500 errors
          if (response.status === 500) {
            const urlString = url.toString();
            // Check if this is an expert_accounts query
            if (urlString.includes('expert_accounts')) {
              // Don't throw here, let the calling code handle the error
              console.error('Expert accounts database error - this may affect role determination');
            }
          }
        }
        
        return response;
      }).catch(error => {
        console.error('Supabase fetch error:', error);
        throw error;
      });
    }
  },
  // Add reasonable retry settings
  retryAttempts: {
    authRetryAttempts: 2,
    clientRetryAttempts: 3
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

// Helper function to safely query expert accounts
export async function fetchExpertProfile(authId: string) {
  try {
    const { data, error } = await supabase
      .from('expert_accounts')
      .select('*')
      .eq('auth_id', authId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching expert profile:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Exception when fetching expert profile:', error);
    return { data: null, error };
  }
}
