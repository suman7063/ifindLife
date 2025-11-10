import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, IndianRupee, Euro, Loader2 } from 'lucide-react';
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
  const [updatingBalance, setUpdatingBalance] = useState(false);
  const subscriptionRef = useRef<{ 
    transactionsChannel: ReturnType<typeof supabase.channel>; 
    usersChannel: ReturnType<typeof supabase.channel> 
  } | null>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      return newBalance;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      // Fallback to user profile balance
      const fallbackBalance = user?.wallet_balance || 0;
      setBalance(fallbackBalance);
      return fallbackBalance;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Set up real-time subscription for wallet balance updates
  useEffect(() => {
    if (!user?.id) return;

    console.log('🔔 Setting up real-time wallet balance subscription for user:', user.id);

    // Subscribe to wallet_transactions INSERT events for this user
    const transactionsChannel = supabase
      .channel(`wallet_transactions_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'wallet_transactions',
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          console.log('💰 New wallet transaction detected via real-time');
          // Clear any polling since real-time caught it
          if (fallbackTimeoutRef.current) {
            clearTimeout(fallbackTimeoutRef.current);
            fallbackTimeoutRef.current = null;
          }
          // Fetch updated balance immediately
          await fetchBalance();
          setUpdatingBalance((prev) => {
            if (prev) {
              toast.success('Wallet balance updated!');
              return false;
            }
            return prev;
          });
        }
      )
      .subscribe();

    // Subscribe to users table UPDATE events for wallet_balance
    const usersChannel = supabase
      .channel(`user_wallet_balance_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          const newBalance = (payload.new as { wallet_balance?: number })?.wallet_balance;
          if (newBalance !== undefined) {
            console.log('💰 Wallet balance updated via real-time (users table):', newBalance);
            // Clear any polling since real-time caught it
            if (fallbackTimeoutRef.current) {
              clearTimeout(fallbackTimeoutRef.current);
              fallbackTimeoutRef.current = null;
            }
            setBalance((prevBalance) => {
              if (newBalance !== prevBalance) {
                if (onBalanceUpdate) {
                  onBalanceUpdate(newBalance);
                }
                setUpdatingBalance((prev) => {
                  if (prev) {
                    toast.success('Wallet balance updated!');
                    return false;
                  }
                  return prev;
                });
                return newBalance;
              }
              return prevBalance;
            });
          }
        }
      )
      .subscribe();

    subscriptionRef.current = { transactionsChannel, usersChannel };

    return () => {
      console.log('🔔 Cleaning up wallet balance subscriptions');
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current.transactionsChannel);
        supabase.removeChannel(subscriptionRef.current.usersChannel);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Aggressive polling for balance update (as backup to real-time)
  const startBalancePolling = (initialBalance: number) => {
    // Clear any existing polling
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }

    let attempts = 0;
    const maxAttempts = 20; // Poll for up to 10 seconds (20 * 500ms)
    const pollInterval = 500; // Check every 500ms for faster updates

    const poll = async () => {
      attempts++;
      try {
        const currentBalance = await fetchBalance();
        
        // If balance changed, stop polling
        if (currentBalance !== initialBalance) {
          setUpdatingBalance(false);
          toast.success('Wallet balance updated!');
          return;
        }
        
        // Continue polling if balance hasn't changed and we haven't exceeded max attempts
        if (attempts < maxAttempts) {
          fallbackTimeoutRef.current = setTimeout(poll, pollInterval);
        } else {
          // After max attempts, stop loading
          setUpdatingBalance(false);
          toast.info('Payment processed. If balance doesn\'t update, please refresh the page.');
        }
      } catch (error) {
        console.error('Error during balance polling:', error);
        setUpdatingBalance(false);
      }
    };

    // Start polling immediately
    poll();
  };

  // Cleanup fallback timeout on unmount
  useEffect(() => {
    return () => {
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, []);

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
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Available Credits</p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold text-primary">
                      {symbol}{balance.toFixed(2)}
                    </h2>
                    {updatingBalance && (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {updatingBalance ? 'Updating balance...' : `${balance.toFixed(0)} credits`}
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
                disabled={updatingBalance}
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
        onPaymentReceived={() => {
          // Show loader immediately when payment is received (before verification)
          // This happens as soon as Razorpay window closes with successful payment
          setUpdatingBalance(true);
          
          // Get current balance before webhook processes
          const currentBalance = balance;
          
          // Start aggressive polling as backup (real-time subscription is primary)
          // This ensures we catch the update quickly even if real-time has delays
          startBalancePolling(currentBalance);
        }}
        onSuccess={async () => {
          setShowAddCreditsDialog(false);
          // Payment verified successfully - fetch balance immediately
          // This helps catch the update faster if webhook already processed
          try {
            const newBalance = await fetchBalance();
            if (newBalance !== balance) {
              setUpdatingBalance(false);
              toast.success('Wallet balance updated!');
            }
            // If balance hasn't changed yet, polling will catch it
          } catch (error) {
            console.error('Error fetching balance after payment:', error);
            // Polling will continue as backup
          }
        }}
        onPaymentFailed={() => {
          // Hide loader if payment fails
          setUpdatingBalance(false);
          setShowAddCreditsDialog(false);
        }}
        userCurrency={currency}
      />
    </Card>
  );
};

export default WalletBalanceCard;

