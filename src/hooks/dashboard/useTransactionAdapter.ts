
import { useEffect, useState } from 'react';
import { UserTransaction } from '@/types/supabase/tables';
import { adaptTransaction } from '@/utils/userProfileAdapter';

export const useTransactionAdapter = (transactions: UserTransaction[] | undefined) => {
  const [adaptedTransactions, setAdaptedTransactions] = useState<any[]>([]);
  
  useEffect(() => {
    if (!transactions) {
      setAdaptedTransactions([]);
      return;
    }
    
    // Adapt all transactions to ensure they have both date/created_at and type/transaction_type
    const adapted = transactions.map(transaction => adaptTransaction(transaction));
    setAdaptedTransactions(adapted);
  }, [transactions]);
  
  return adaptedTransactions;
};
