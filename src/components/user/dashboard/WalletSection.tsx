
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import useTransactions from '@/hooks/dashboard/useTransactions';
import useRechargeDialog from '@/hooks/dashboard/useRechargeDialog';
import RechargeDialog from './RechargeDialog';
import WalletBalanceCard from './wallet/WalletBalanceCard';
import PaymentMethodsCard from './wallet/PaymentMethodsCard';
import TransactionHistoryCard from './wallet/TransactionHistoryCard';

interface WalletSectionProps {
  user: UserProfile | null;
}

const WalletSection: React.FC<WalletSectionProps> = ({ user }) => {
  const { transactions, isLoading: loading, refreshTransactions } = useTransactions(user?.id);

  const {
    isRechargeDialogOpen,
    isProcessing,
    handleOpenRechargeDialog,
    handleCloseRechargeDialog,
    handleRechargeSuccess
  } = useRechargeDialog(refreshTransactions);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Wallet & Transactions</h2>
        <p className="text-muted-foreground">
          Manage your wallet and view transaction history
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <WalletBalanceCard user={user} onRecharge={handleOpenRechargeDialog} />
        
        {/* Payment Methods */}
        <PaymentMethodsCard />
      </div>
      
      {/* Transaction History */}
      <TransactionHistoryCard transactions={transactions} loading={loading} />
      
      <RechargeDialog
        open={isRechargeDialogOpen}
        onOpenChange={handleCloseRechargeDialog}
        onSuccess={handleRechargeSuccess}
      />
    </div>
  );
};

export default WalletSection;
