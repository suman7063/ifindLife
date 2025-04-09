
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
}

export interface UserReview {
  id?: string;
  expert_id: string; // Using string type to match the database
  user_id?: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}
