import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/supabase/user';
import { supabase } from '@/lib/supabase';
import { ArrowDown, ArrowUp, Calendar, Wallet, Gift, RefreshCw, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserCurrency } from '@/hooks/useUserCurrency';

interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: 'INR' | 'EUR';
  reason: string;
  description: string | null;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
  expires_at: string | null;
  metadata: Record<string, any>;
}

interface WalletTransactionsListProps {
  user: UserProfile | null;
}

const WalletTransactionsList: React.FC<WalletTransactionsListProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      // Clear transactions when user changes to prevent stale data
      setTransactions([]);
      fetchTransactions();
    } else {
      // Clear transactions if no user
      setTransactions([]);
      setLoading(false);
    }
  }, [user?.id]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Clear existing transactions first to ensure fresh data
      setTransactions([]);
      
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const { data, error } = await supabase.functions.invoke('wallet-operations', {
        body: { 
          action: 'get_transactions',
          limit: 50,
          _timestamp: timestamp // Cache buster
        }
      });

      if (error) {
        console.error('Error fetching wallet transactions:', error);
        setTransactions([]); // Ensure empty array on error
        return;
      }

      // Explicitly set to empty array if no transactions
      const transactions = data?.transactions || [];
      console.log('💰 Fetched wallet transactions from database:', transactions.length, 'transactions');
      setTransactions(transactions);
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      setTransactions([]); // Ensure empty array on error
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string, reason: string) => {
    if (type === 'credit') {
      switch (reason) {
        case 'referral_reward':
          return <Gift className="h-4 w-4 text-primary" />;
        case 'promotional':
        case 'compensation':
          return <Gift className="h-4 w-4 text-green-600" />;
        default:
          return <ArrowDown className="h-4 w-4 text-green-600" />;
      }
    } else {
      return <ArrowUp className="h-4 w-4 text-red-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      'purchase': 'Purchase',
      'booking': 'Booking',
      'refund': 'Refund',
      'referral_reward': 'Referral Reward',
      'promotional': 'Promotional',
      'compensation': 'Compensation',
      'adjustment': 'Admin Adjustment',
      'expiry': 'Expired'
    };
    return labels[reason] || reason;
  };

  const { symbol: defaultSymbol } = useUserCurrency();
  
  const getCurrencySymbol = (currency: 'INR' | 'EUR' | undefined) => {
    if (!currency) return defaultSymbol;
    return currency === 'INR' ? '₹' : '€';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading transactions...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTransactions}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-muted">
                <Receipt className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Your transaction history will appear here
            </p>
            <p className="text-xs text-muted-foreground">
              Start by adding credits or booking a session
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type, transaction.reason)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{transaction.description || getReasonLabel(transaction.reason)}</p>
                      <Badge variant="outline" className="text-xs">
                        {getReasonLabel(transaction.reason)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(transaction.created_at)}</span>
                      {transaction.expires_at && (
                        <>
                          <span className="mx-1">•</span>
                          <span className="text-xs">
                            Expires: {new Date(transaction.expires_at).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`text-right ${getTransactionColor(transaction.type)}`}>
                  <p className="font-bold">
                    {transaction.type === 'credit' ? '+' : '-'}
                    {getCurrencySymbol(transaction.currency)}{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs">
                    {transaction.type === 'credit' ? 'Credited' : 'Debited'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletTransactionsList;

