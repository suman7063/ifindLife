
// This file defines the database table interfaces

export interface CustomTable {
  experts: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    specialization?: string;
    experience?: string;
    bio?: string;
    certificate_urls?: string[];
    profile_picture?: string;
    selected_services?: number[];
    created_at?: string;
    rating?: number;
  };
  expert_reports: {
    id: string;
    expert_id?: string;
    user_id?: string;
    user_name?: string;
    reason?: string;
    details?: string;
    date?: string;
    status?: string;
  };
  users: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    city?: string;
    currency?: string;
    profile_picture?: string;
    wallet_balance?: number;
    created_at?: string;
    referral_code?: string;
    referred_by?: string;
    referral_link?: string;
  };
  user_favorites: {
    id: string;
    user_id?: string;
    expert_id: number;
  };
  user_transactions: {
    id: string;
    user_id?: string;
    date: string;
    type: string;
    amount: number;
    currency: string;
    description?: string;
  };
  user_reviews: {
    id: string;
    user_id?: string;
    expert_id: number;
    rating: number;
    comment?: string;
    date: string;
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
  user_courses: {
    id: string;
    user_id?: string;
    title: string;
    expert_id: number;
    expert_name: string;
    enrollment_date: string;
    progress?: number;
    completed?: boolean;
  };
  services: {
    id: number;
    name: string;
    description?: string;
    rate_usd: number;
    rate_inr: number;
  };
  referral_settings: {
    id: string;
    referrer_reward: number;
    referred_reward: number;
    active: boolean;
    description?: string;
    updated_at?: string;
  };
  referrals: {
    id: string;
    referrer_id: string;
    referred_id: string;
    referral_code: string;
    status: string;
    reward_claimed: boolean;
    created_at?: string;
    completed_at?: string;
  };
  programs: {
    id: number;
    title: string;
    description: string;
    duration: string;
    sessions: number;
    price: number;
    image: string;
    category: string;
    created_at: string;
    enrollments?: number;
  };
  user_favorite_programs: {
    id: string;
    user_id: string;
    program_id: number;
    created_at: string;
  };
  program_enrollments: {
    id: string;
    program_id: number;
    user_id: string;
    enrollment_date: string;
    payment_status: string;
    payment_method: string;
    amount_paid: number;
    transaction_id?: string;
  };
  profiles: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    city?: string;
    currency?: string;
    profile_picture?: string;
    wallet_balance?: number;
    created_at?: string;
    updated_at?: string;
  };
}

// Direct type definitions from database tables
export type Expert = CustomTable['experts'];
export type User = CustomTable['users'];
export type UserTransaction = CustomTable['user_transactions'];
export type ReferralSettings = CustomTable['referral_settings'];
export type Program = CustomTable['programs'];
export type UserFavoriteProgram = CustomTable['user_favorite_programs'];
export type ProgramEnrollment = CustomTable['program_enrollments'];
export type Profile = CustomTable['profiles'];
