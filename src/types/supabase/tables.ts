
// Main database table types

export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdrawal' | 'program_purchase' | 'session_payment' | 'refund' | 'referral_reward' | 'other';
  description?: string;
  date: string;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id?: string;
  payment_method?: 'wallet' | 'card' | 'bank' | 'upi' | 'other';
  created_at?: string;
  updated_at?: string;
}

export interface UserReview {
  id: string;
  user_id: string;
  expert_id: string;
  rating: number;
  comment: string;
  date: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Report {
  id: string;
  expertId: string;
  reason: string;
  details?: string;
  date: string;
  status: string;
}
