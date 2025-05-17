
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://nmcqyudqvbldxwzhyzma.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tY3F5dWRxdmJsZHh3emh5em1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDg3NzQsImV4cCI6MjA1Nzc4NDc3NH0.xV1bMMoTHuglbW72yoT2Hnh-pqkSWKHTE-mOsOQoC8g'
);

// Add 'from' helper for compatibility with some components
export const from = (table: string) => supabase.from(table);
