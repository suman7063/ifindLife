
// User transaction
export interface UserTransaction {
  id: string;
  user_id?: string;
  amount: number;
  currency?: string;
  type?: 'credit' | 'debit';
  transaction_type?: string;
  description?: string;
  date?: string;
  status?: string;
  created_at?: string;
}

// Add other table interfaces here...

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
  is_read?: boolean;
}
