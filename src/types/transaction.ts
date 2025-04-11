
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  transaction_type: string;
  payment_id: string;
  payment_method: string;
  description: string;
  type: string;
  date: string;
}
