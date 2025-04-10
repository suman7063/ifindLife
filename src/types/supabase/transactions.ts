
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  payment_id?: string;
  payment_method?: string;
  transaction_type: string;
  description?: string;
}

export interface UserTransaction extends Transaction {
  status: string;
  created_at: string;
  payment_id: string;
  payment_method: string;
  transaction_type: string;
}

export interface WalletTransaction extends Transaction {
  wallet_id: string;
  balance_before: number;
  balance_after: number;
}
