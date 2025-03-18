
// Database schema type (snake_case)
export interface UserTransactionDb {
  id: string;
  user_id: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
}

// UI schema type (camelCase)
export interface UserTransaction {
  id: string;
  userId: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
  
  // DB fields for compatibility
  user_id: string;
}

// Types for creating transaction
export interface UserTransactionCreate {
  user_id: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
}
