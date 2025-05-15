
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  transaction_type?: string;
  date: string;
  currency: string;
  description?: string;
}

export interface NewReview {
  expertId: string | number;
  rating: number;
  comment?: string;
}

export interface UserReview {
  id: string;
  user_id: string;
  expert_id: string | number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  user_name?: string;
  expert_name?: string;
}

export interface NewReport {
  expertId: string | number;
  reason: string;
  details?: string;
}

export interface Review {
  id: string;
  user_id: string;
  expert_id: string | number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  user_name?: string;
  expert_name?: string;
}

export interface Report {
  id: string;
  user_id: string;
  expert_id: string | number;
  reason: string;
  details?: string;
  date: string;
  status: string;
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
