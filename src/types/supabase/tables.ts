
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  type: string;
  status?: string;
  created_at?: string;
  payment_id?: string;
  payment_method?: string;
  transaction_type?: string; // Add this property which is used in components
}

export interface UserReview {
  id?: string;
  expert_id: string;
  user_id?: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}
