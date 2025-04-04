
// Define all the tables in Supabase for type safety
export interface CustomTable {
  user_profiles: any;
  expert_accounts: any;
  referrals: any;
  referral_settings: any;
  user_favorites: any;
  user_reviews: any;
  user_reports: any;
  user_transactions: any;
  admin_users: any;
  appointments: any;
  experts: any;
  services: any;
  expert_time_slots: any;
  contact_submissions: any;
  expert_availabilities: any;
  expert_reports: any;
  moderation_actions: any;
  programs: any;
  program_categories: any;
  sessions: any;
  testimonials: any;
  user_courses: any;
  wallets: any;
}

// Contact submission model
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: 'new' | 'read' | 'replied' | 'archived';
}

export type { Expert } from '../expert';
export type { UserTransaction } from './index';
