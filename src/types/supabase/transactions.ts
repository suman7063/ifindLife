
// Re-export UserTransaction from tables.ts to maintain compatibility
import { UserTransaction } from './tables';

export type { UserTransaction };

// Add any transaction-specific types that aren't in tables.ts below
export interface TransactionHistory {
  transactions: UserTransaction[];
  total: number;
}
