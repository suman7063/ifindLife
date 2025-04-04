
import { Expert } from '../expert';
import { UserProfile } from './userProfile';
import { UserFavorite, UserFavoriteWithExpert } from './userFavorites';
import { Program } from '../programs';
import { UserTransaction } from './transactions';
import { Referral, ReferralSettings } from './referral';

// Define the structure of custom tables for type-safe database access
export interface CustomTable {
  experts: Expert;
  users: UserProfile;
  user_transactions: UserTransaction;
  referral_settings: ReferralSettings;
  programs: Program;
  user_favorite_programs: { id: string; user_id: string; program_id: number };
  program_enrollments: { 
    id: string; 
    user_id: string; 
    program_id: number; 
    enrollment_date: string;
    payment_status: string;
    payment_method: string;
    amount_paid: number;
    transaction_id?: string;
  };
  profiles: UserProfile;
  contact_submissions: {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at?: string;
    is_read?: boolean;
  };
  admin_users: {
    id: string;
    role: string;
    created_at: string;
  };
  expert_accounts: Expert;
  expert_availabilities: {
    id: string;
    expert_id: string;
    availability_type: string;
    start_date: string;
    end_date: string;
    created_at?: string;
  };
  expert_time_slots: {
    id: string;
    availability_id: string;
    start_time: string;
    end_time: string;
    day_of_week?: number;
    specific_date?: string;
    is_booked?: boolean;
    created_at?: string;
  };
  appointments: {
    id: string;
    user_id: string;
    expert_id: string;
    expert_name: string;
    service_id?: number;
    appointment_date: string;
    start_time?: string;
    end_time?: string;
    duration: number;
    status: string;
    notes?: string;
    uid?: number;
    time_slot_id?: string;
    google_calendar_event_id?: string;
    user_calendar_event_id?: string;
    token?: string;
    channel_name?: string;
    created_at: string;
  };
  user_reviews: {
    id: string;
    user_id?: string;
    expert_id: number;
    rating: number;
    comment?: string;
    date: string;
    verified?: boolean;
  };
  user_reports: {
    id: string;
    user_id?: string;
    expert_id: number;
    reason: string;
    details?: string;
    date: string;
    status: string;
  };
  user_favorites: UserFavorite;
}
