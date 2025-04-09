
export interface UserTransaction {
  id: string;
  user_id?: string;
  amount: number;
  currency?: string;
  description?: string;
  date?: string;
  type?: 'credit' | 'debit';
  transaction_type?: string;
  status?: string;
  created_at?: string;
  payment_id?: string;
  payment_method?: string;
}
