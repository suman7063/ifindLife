
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
