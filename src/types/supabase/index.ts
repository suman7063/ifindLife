
// This file is maintained for backward compatibility
// It re-exports all types from the modular structure

export * from './user';
export * from './appointments';
export * from './reviews';
export * from './referrals';
export * from './expertId';
export * from './moderation';
export * from './education';
export * from './tables';

// Re-export common types with UI-friendly naming
export type { UserProfile } from './user';
export type { Appointment, AppointmentStatus, TimeSlot } from './appointments';
export type { ReferralUI as Referral, ReferralSettingsUI as ReferralSettings } from './referrals';
export type { Review, Report } from './reviews';

// Define types for tables not already covered in specific files
export interface ExpertUI {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  specialties?: string[];
  experience: string | number;
  bio?: string;
  profilePicture?: string;
  averageRating?: number;
  reviewsCount?: number;
  selectedServices?: number[];
  certificateUrls?: string[];
  
  // DB format (snake_case)
  profile_picture?: string;
  average_rating?: number;
  reviews_count?: number;
  selected_services?: number[];
  certificate_urls?: string[];
}

export type Expert = ExpertUI;

export interface UserTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: string;
  date: string;
  description?: string;
  
  // DB format (snake_case)
  user_id?: string;
}

export interface Course {
  id: string;
  title: string;
  expertId: string;
  expertName: string;
  enrollmentDate: string;
  progress?: number;
  completed?: boolean;
}

export interface UserCourse {
  id: string;
  user_id?: string;
  title: string;
  expert_id?: number;
  expert_name?: string;
  enrollment_date?: string;
  progress?: number;
  completed?: boolean;
}

export interface UserReport {
  id: string;
  user_id?: string;
  expert_id: number;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface UserReview {
  id: string;
  user_id?: string;
  user_name?: string;
  expert_id: number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}
