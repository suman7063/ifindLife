
// Define basic types for database tables

export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  type: string;
  currency: string;
  description?: string;
}

export interface UserReview {
  id: string;
  user_id?: string;
  expert_id: number;
  rating: number;
  verified?: boolean;
  comment?: string;
  date: string;
}

export interface ContactSubmission {
  id: number;
  is_read?: boolean;
  created_at?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Review {
  id: string;
  expertId: string | number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface Report {
  id: string;
  expertId: string | number;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface NewReview {
  expertId: number;
  rating: number;
  comment?: string;
}

export interface NewReport {
  expertId: number;
  reason: string;
  details?: string;
}
