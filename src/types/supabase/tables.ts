
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  transaction_type?: string;
  date: string;
  currency: string;
  description?: string;
}

export interface NewReview {
  expertId: string | number;
  rating: number;
  comment?: string;
}

export interface NewReport {
  expertId: string | number;
  reason: string;
  details?: string;
}
