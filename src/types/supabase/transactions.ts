
export interface UserTransaction {
  id: string;
  user_id?: string;
  amount: number;
  currency: string;
  date: string;
  type: string;  // e.g., 'deposit', 'withdrawal', 'program_purchase'
  description?: string;
}
