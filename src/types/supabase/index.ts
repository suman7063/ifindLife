
import { UserProfile, UserSettings, Transaction } from './userProfile';
import { ExpertProfile } from '../expert';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: any;
        Insert: any;
        Update: any;
      };
      expert_profiles: {
        Row: any;
        Insert: any;
        Update: any;
      };
      referral_settings: {
        Row: any;
        Insert: any;
        Update: any;
      };
      // Add other tables as needed
    };
  };
}

export interface ReferralSettings {
  id: string;
  bonus_amount: number;
  currency: string;
  min_transaction_amount: number;
  expires_in_days: number;
  active: boolean;
}

export interface Review {
  id: string;
  user_id: string;
  expert_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user_name?: string;
}

export type { UserProfile, UserSettings, Transaction, ExpertProfile };
