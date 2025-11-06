import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, IndianRupee, Euro } from 'lucide-react';
import { UserProfile } from '@/types/supabase/user';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import AddCreditsDialog from './AddCreditsDialog';

interface WalletBalanceCardProps {
  user: UserProfile | null;
  onBalanceUpdate?: (newBalance: number) => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ user, onBalanceUpdate }) => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchBalance();
    }
  }, [user?.id]);

  const fetchBalance = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('wallet-operations', {
        body: { action: 'get_balance' }
      });

      if (error) throw error;

      const newBalance = data?.balance || 0;
      setBalance(newBalance);
      if (onBalanceUpdate) {
        onBalanceUpdate(newBalance);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      // Fallback to user profile balance
      setBalance(user?.wallet_balance || 0);
    } finally {
      setLoading(false);
    }
  };

  const currency = user?.currency || 'INR';
  const symbol = currency === 'INR' ? '₹' : '€';
  const CurrencyIcon = currency === 'INR' ? IndianRupee : Euro;

  const [showAddCreditsDialog, setShowAddCreditsDialog] = useState(false);

  const handleAddCredits = () => {
    setShowAddCreditsDialog(true);
  };

  return (
    <Card className="col-span-1">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">IFL Credits</h3>
              <p className="text-muted-foreground text-sm">Your wallet balance</p>
            </div>
            <Wallet className="h-8 w-8 text-primary" />
          </div>

          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Loading balance...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                {/* <CurrencyIcon className="h-6 w-6 text-primary" /> */}
                <div>
                  <p className="text-sm text-muted-foreground">Available Credits</p>
                  <h2 className="text-3xl font-bold text-primary">
                    {symbol}{balance.toFixed(2)}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {balance.toFixed(0)} credits
                  </p>
                </div>
              </div>

              <div className="bg-muted rounded-md p-3">
                <div className="flex items-center space-x-2 text-sm">
                  <p className="text-muted-foreground">
                    Credits can be used for booking sessions. 1 Credit = {symbol}1
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleAddCredits}
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Credits
              </Button>
            </>
          )}
        </div>
      </CardContent>

      <AddCreditsDialog
        isOpen={showAddCreditsDialog}
        onClose={() => setShowAddCreditsDialog(false)}
        onSuccess={() => {
          fetchBalance();
          setShowAddCreditsDialog(false);
        }}
        userCurrency={currency}
      />
    </Card>
  );
};

export default WalletBalanceCard;

