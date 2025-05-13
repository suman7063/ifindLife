
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  type: string;
  currency: string;
  description?: string;
  // Add these for backward compatibility with existing code
  transaction_type?: string;
  created_at?: string;
}

export interface NewReview {
  expert_id: number;
  rating: number;
  comment?: string;
}

export interface NewReport {
  expert_id: number;
  reason: string;
  details?: string;
}

export interface UserReview {
  id: string;
  user_id: string;
  expert_id: number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface Report {
  id: string;
  expert_id: number;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment: string;
  date: string;
}
