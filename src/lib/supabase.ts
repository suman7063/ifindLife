
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
  user_favorites: () => supabase.from('user_favorites'),
  referrals: () => supabase.from('referrals'),
  user_transactions: () => supabase.from('user_transactions'),
  user_reports: () => supabase.from('user_reports'),
  user_courses: () => supabase.from('user_courses'),
  services: () => supabase.from('services'),
  referral_settings: () => supabase.from('referral_settings'),
  moderation_reports: () => supabase.from('moderation_reports'),
  moderation_actions: () => supabase.from('moderation_actions'),
  // Add other tables as needed
};

export default supabase;
