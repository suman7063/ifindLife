
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  currency: string | null;
  profilePicture: string | null;
  walletBalance: number | null;
  favoriteExperts: Expert[];
  enrolledCourses: Course[];
  transactions: UserTransaction[];
  reviews: Review[];
  reports: Report[];
};

export type User = UserProfile; // Adding alias for compatibility

export type UserTransaction = {
  id: string;
  date: string;
  type: 'recharge' | 'payment';
  amount: number;
  currency: string;
  description: string;
};

export type Expert = {
  id: number;
  name: string;
  specialization: string;
  image?: string;
  rating?: number;
};

export type Review = {
  id: string;
  expertId: number;
  rating: number;
  comment: string;
  date: string;
};

export type Report = {
  id: string;
  expertId: number;
  reason: string;
  details: string;
  date: string;
  status: 'pending' | 'reviewed' | 'resolved';
};

export type Course = {
  id: string;
  title: string;
  expertId: number;
  expertName: string;
  enrollmentDate: string;
  progress: number;
  completed: boolean;
};

// Add Expert type for the Supabase database
export type ExpertProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  specialization: string;
  experience: string;
  bio: string;
  certificate_urls: string[];
  profile_picture: string;
  selected_services: number[];
  password?: string; // Note: This should be handled securely
  created_at: string;
};

// Add this helper type to allow type-safe access to tables not defined in the Database type
export type CustomTable = {
  experts: ExpertProfile;
  expert_reports: {
    id: string;
    expert_id: string;
    user_id: string;
    user_name: string;
    reason: string;
    details: string;
    date: string;
    status: string;
  };
  users: {
    id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    currency: string;
    profile_picture: string;
    wallet_balance: number;
    created_at: string;
  };
  user_favorites: {
    id: string;
    user_id: string;
    expert_id: number;
  };
  user_transactions: {
    id: string;
    user_id: string;
    date: string;
    type: string;
    amount: number;
    currency: string;
    description: string;
  };
  user_reviews: {
    id: string;
    user_id: string;
    expert_id: number;
    rating: number;
    comment: string;
    date: string;
  };
  user_reports: {
    id: string;
    user_id: string;
    expert_id: number;
    reason: string;
    details: string;
    date: string;
    status: string;
  };
  user_courses: {
    id: string;
    user_id: string;
    title: string;
    expert_id: number;
    expert_name: string;
    enrollment_date: string;
    progress: number;
    completed: boolean;
  };
  services: {
    id: number;
    name: string;
    description: string;
    rate_usd: number;
    rate_inr: number;
  };
};
