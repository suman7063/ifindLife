
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  date?: string; // For backward compatibility
  payment_id?: string;
  payment_method?: string;
  transaction_type: string;
  type?: string; // For backward compatibility
  description?: string;
}

export interface UserTransaction extends Transaction {
  status: string;
  created_at: string;
  date: string; // For UI display
  payment_id: string;
  payment_method: string;
  transaction_type: string;
  type: string; // For UI display
  description: string; // Made required in UserTransaction
}

export interface WalletTransaction extends Transaction {
  wallet_id: string;
  balance_before: number;
  balance_after: number;
}
