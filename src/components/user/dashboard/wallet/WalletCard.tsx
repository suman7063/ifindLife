import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Plus, Loader2 } from 'lucide-react';
import { useRazorpayPayment } from '@/hooks/call/useRazorpayPayment';
import { toast } from 'sonner';
import { UserProfile } from '@/types/database/unified';

interface WalletCardProps {
  user: UserProfile | null;
}

const WalletCard: React.FC<WalletCardProps> = ({ user }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const { processPayment, isLoading } = useRazorpayPayment();

  const walletBalance = user?.wallet_balance || 0;

  const handleAddFunds = async () => {
    const fundAmount = parseFloat(amount);
    if (!fundAmount || fundAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (fundAmount < 10) {
      toast.error('Minimum amount is ₹10');
      return;
    }

    try {
      await processPayment(
        fundAmount,
        currency as 'INR' | 'USD' | 'EUR',
        `Add ₹${fundAmount} to wallet`,
        (paymentId, orderId) => {
          toast.success(`₹${fundAmount} added to your wallet successfully!`);
          setAmount('');
          // In a real app, this would update the user's balance in the database
        },
        (error) => {
          console.error('Payment failed:', error);
          toast.error('Payment failed. Please try again.');
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const formatCurrency = (value: number) => {
    return currency === 'INR' ? `₹${value.toFixed(2)}` : 
           currency === 'USD' ? `$${value.toFixed(2)}` : 
           `€${value.toFixed(2)}`;
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(walletBalance)}
          </p>
        </div>

        {/* Add Funds */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Add Funds</Label>
            <div className="flex gap-2">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹</SelectItem>
                  <SelectItem value="USD">$</SelectItem>
                  <SelectItem value="EUR">€</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="amount"
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
                min="10"
                max="50000"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum: {currency === 'INR' ? '₹10' : currency === 'USD' ? '$1' : '€1'} | 
              Maximum: {currency === 'INR' ? '₹50,000' : currency === 'USD' ? '$500' : '€500'}
            </p>
          </div>

          <Button 
            onClick={handleAddFunds}
            disabled={isLoading || !amount || parseFloat(amount) < 10}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Funds
              </>
            )}
          </Button>
        </div>

        {/* Quick Amount Buttons */}
        <div className="space-y-2">
          <Label>Quick Add</Label>
          <div className="grid grid-cols-3 gap-2">
            {[100, 500, 1000].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                disabled={isLoading}
              >
                {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}{quickAmount}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;