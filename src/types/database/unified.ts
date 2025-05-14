
/**
 * Unified type definitions for database schemas
 * This file contains all the type definitions for the database schemas
 * to ensure consistent typing across the application
 */

// User profile type definition
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  wallet_balance?: number;
  currency?: string;
  profile_picture?: string;
  referral_code?: string;
  created_at?: string;
  referred_by?: string;
  referral_link?: string;
}

// Expert profile type definition
export interface ExpertProfile {
  id: string;
  auth_id?: string;
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
  selected_services?: number[];
  certificate_urls?: string[];
  profile_picture?: string;
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: string;
  created_at?: string;
}

// Program type definition
export interface Program {
  id: number;
  title: string;
  description: string;
  duration: string;
  sessions: number;
  price: number;
  image: string;
  category: string;
  programType: string;
  enrollments?: number;
  created_at?: string;
}

// Service type definition
export interface Service {
  id: number;
  name: string;
  description?: string;
  rate_usd: number;
  rate_inr: number;
}

// Appointment type definition
export interface Appointment {
  id: string;
  user_id: string;
  expert_id: string;
  duration: number;
  service_id?: number;
  uid?: number;
  start_time?: string;
  end_time?: string;
  time_slot_id?: string;
  expert_name: string;
  appointment_date: string;
  status: string;
  notes?: string;
  channel_name?: string;
  token?: string;
  google_calendar_event_id?: string;
  user_calendar_event_id?: string;
  created_at: string;
}

// Review type definition
export interface Review {
  id: string;
  user_id?: string;
  expert_id: number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

// Testimonial type definition
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  date: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Referral Settings type definition
export interface ReferralSettings {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  active: boolean;
  description?: string;
  updated_at?: string;
}
