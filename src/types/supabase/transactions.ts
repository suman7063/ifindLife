
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description?: string;
  status: string;
  created_at: string;
  payment_id?: string;
  payment_method?: string;
}
