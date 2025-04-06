
import React from 'react';
import { UserProfile } from '@/types/supabase';
import { UserTransaction } from '@/types/supabase/transactions';
import WalletBalanceCard from './WalletBalanceCard';
import RecentTransactionsCard from './RecentTransactionsCard';

interface WalletSectionProps {
  user: UserProfile | null;
  transactions: UserTransaction[];
  onRecharge: () => void;
}

const WalletSection: React.FC<WalletSectionProps> = ({
  user,
  transactions,
  onRecharge
}) => {
  if (!user) {
    return <div className="text-center py-8">Loading wallet information...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Wallet</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WalletBalanceCard userProfile={user} onRecharge={onRecharge} />
        <RecentTransactionsCard transactions={transactions} />
      </div>
      
      {transactions.length === 0 && (
        <div className="text-center p-4 bg-muted rounded-md">
          <p>No transaction history yet. When you add funds or make purchases, they will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default WalletSection;
