
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
  transaction_type?: string; // Maintain this field for backwards compatibility
}

export interface UserReview {
  id?: string;
  expert_id: number; // Changed to number to match the database schema
  user_id?: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string | null;
  is_read: boolean | null;
}
