
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WalletBalanceCard from './WalletBalanceCard';
import PaymentMethodsCard from './PaymentMethodsCard';
import TransactionHistoryCard from './TransactionHistoryCard';
import useTransactions from '@/hooks/dashboard/useTransactions';
import useRechargeDialog from '@/hooks/dashboard/useRechargeDialog';
import RechargeDialog from './RechargeDialog';
import { UserProfile } from '@/types/supabase';

const WalletPage: React.FC = () => {
  // Fix the reference to userProfile - use profile instead
  const { profile } = useAuth();
  const { transactions, isLoading, refreshTransactions } = useTransactions(profile?.id || '');
  const { 
    isRechargeDialogOpen, 
    handleOpenRechargeDialog, 
    handleCloseRechargeDialog, 
    handleRechargeSuccess,
    isProcessing
  } = useRechargeDialog(refreshTransactions);

  if (!profile) {
    return <div className="py-12 text-center">Loading wallet information...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet & Transactions</h1>
        <p className="text-muted-foreground">Manage your wallet and view transaction history</p>
      </div>

      {/* Cards Section */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <WalletBalanceCard 
          user={profile} 
          onRecharge={handleOpenRechargeDialog} 
        />
        <PaymentMethodsCard />
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <p className="text-muted-foreground">View all your past transactions</p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <TransactionHistoryCard transactions={transactions} loading={isLoading} />
        ) : (
          <div className="text-center py-16 bg-muted rounded-lg">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>

      {/* Recharge Dialog */}
      <RechargeDialog 
        open={isRechargeDialogOpen} 
        onOpenChange={handleCloseRechargeDialog}
        onSuccess={handleRechargeSuccess}
      />
    </div>
  );
};

export default WalletPage;
