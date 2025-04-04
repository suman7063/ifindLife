// User transaction
export interface UserTransaction {
  id: string;
  user_id?: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit';
  description?: string;
  date: string;
  created_at?: string;
}

// Add other table interfaces here...
