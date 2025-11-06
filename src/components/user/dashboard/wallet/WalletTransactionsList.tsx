import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/supabase/user';
import { supabase } from '@/lib/supabase';
import { ArrowDown, ArrowUp, Calendar, Wallet, Gift, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
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
      fetchTransactions();
    }
  }, [user?.id]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('wallet-operations', {
        body: { 
          action: 'get_transactions',
          limit: 50
        }
      });

      if (error) throw error;

      setTransactions(data?.transactions || []);
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
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

  const currency = user?.currency || 'INR';
  const symbol = currency === 'INR' ? '₹' : '€';

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
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Your wallet transactions will appear here</p>
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
                    {symbol}{transaction.amount.toFixed(2)}
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

