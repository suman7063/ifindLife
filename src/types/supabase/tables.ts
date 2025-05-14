
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit' | string;
  currency: string;
  description?: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

export interface UserReview {
  id: string;
  user_id?: string;
  expert_id: number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  user_name?: string;
}

export interface NewReview {
  expertId: number;
  rating: number;
  comment?: string;
}

export interface Report {
  id: string;
  expertId: number | string;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface Review {
  id: string;
  expertId: number | string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface NewReport {
  expertId: number;
  reason: string;
  details?: string;
}
