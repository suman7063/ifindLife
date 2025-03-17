
// This file defines custom table types for Supabase

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
}

// Additional interfaces used in the application
export type Expert = CustomTable['experts'];
export type ExpertProfile = CustomTable['experts']; // Alias for compatibility

// Extended UserProfile with additional properties needed by our UI
export interface UserProfile extends CustomTable['users'] {
  // For UI convenience, we add derived fields here
  profilePicture?: string; // maps to profile_picture
  walletBalance?: number;  // maps to wallet_balance
  favoriteExperts?: Expert[];
  enrolledCourses?: Course[];
  transactions?: UserTransaction[];
  reviews?: Review[];
  reports?: Report[];
}

export type User = CustomTable['users'];
export type Review = CustomTable['user_reviews'];
export type Report = CustomTable['user_reports'];
export type Course = CustomTable['user_courses'];
export type UserTransaction = CustomTable['user_transactions'];
