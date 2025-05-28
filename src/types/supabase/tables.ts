
// Types for Supabase table operations
export interface NewReview {
  user_id: string;
  expert_id: number | string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface NewReport {
  user_id: string;
  expert_id: number | string;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface NewTransaction {
  user_id: string;
  amount: number;
  date: string;
  type: string;
  currency: string;
  description?: string;
}

// Add the missing exported types that components expect
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  type: string;
  currency: string;
  description?: string;
  created_at?: string;
  status?: string;
  payment_id?: string;
  payment_method?: string;
  transaction_type?: string;
}

export interface UserReview {
  id: string;
  user_id?: string;
  expert_id: number | string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  user_name?: string;
  expert_name?: string;
  review_id?: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read?: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  user_id?: string;
  expert_id: number | string;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface Review {
  id: string;
  user_id?: string;
  expert_id: number | string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  user_name?: string;
  expert_name?: string;
}
