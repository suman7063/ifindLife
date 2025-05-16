
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface WalletSectionProps {
  user?: any;
  isRechargeDialogOpen?: boolean;
  isProcessingPayment?: boolean;
  handleOpenRechargeDialog?: () => void;
  handleCloseRechargeDialog?: () => void;
  handlePaymentSuccess?: () => void;
  handlePaymentCancel?: () => void;
  setIsProcessingPayment?: (isProcessing: boolean) => void;
}

const WalletSection: React.FC<WalletSectionProps> = ({
  user,
  isRechargeDialogOpen,
  isProcessingPayment,
  handleOpenRechargeDialog,
  handleCloseRechargeDialog,
  handlePaymentSuccess,
  handlePaymentCancel,
  setIsProcessingPayment
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-medium">Current Balance</h3>
          <p className="text-3xl font-bold">
            ₹{user?.wallet_balance || 0}
          </p>
        </div>
        
        <Button 
          onClick={handleOpenRechargeDialog}
          disabled={isProcessingPayment}
          className="w-full sm:w-auto"
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Add Money to Wallet'
          )}
        </Button>

        {/* Transaction history would go here */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Recent Transactions</h3>
          <p className="text-muted-foreground">
            No recent transactions found.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSection;
