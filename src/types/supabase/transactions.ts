
export interface UserTransaction {
  id: string;
  user_id?: string;
  amount: number;
  transaction_type?: string;
  type?: 'credit' | 'debit';
  description?: string;
  status?: string;
  created_at?: string;
  date?: string;
  currency?: string;
  payment_id?: string;
  payment_method?: string;
}
