
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  type: string;
  status: string;
  created_at: string;
  payment_id: string;
  payment_method: string;
  transaction_type: string;
}

export interface UserReview {
  id?: string;
  expert_id: number;
  user_id?: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface ContactSubmission {
  id: number; // ID is a number in the database schema
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string | null;
  is_read?: boolean | null;
}

// Add this utility type for Supabase insert operations
export type ContactSubmissionInsert = Omit<ContactSubmission, 'id'>;

// Full Report type from DB
export type Report = {
  id: string;
  expert_id: string | number; // Using expert_id to match database schema
  reason: string;
  details?: string;
  date: string;
  status: string;
};

// Input type for inserting a new report
export type NewReport = {
  expertId: string | number; // Keep as expertId for frontend consistency
  reason: string;
  details?: string;
};

// Full Review type
export type Review = {
  id: string;
  expert_id: string | number; // Using expert_id to match database schema
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
};

// Input type for inserting a new review
export type NewReview = {
  expertId: string | number; // Keep as expertId for frontend consistency
  rating: number;
  comment?: string;
};

// Testimonial type from DB schema
export interface DatabaseTestimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Referral Settings type
export interface ReferralSetting {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  active: boolean;
  description?: string;
  updated_at?: string;
}
