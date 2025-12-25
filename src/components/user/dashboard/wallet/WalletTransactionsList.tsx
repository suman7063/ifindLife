import React, { useState, useEffect, useRef } from 'react';
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

interface AppointmentDetails {
  appointment_date: string;
  start_time: string;
  expert_name: string;
}

interface WalletTransactionsListProps {
  user: UserProfile | null;
}

const WalletTransactionsList: React.FC<WalletTransactionsListProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentDetails, setAppointmentDetails] = useState<Record<string, AppointmentDetails>>({});
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Removed refreshTrigger - real-time subscription handles all updates
  // This prevents duplicate refreshes from multiple sources

  // Set up real-time subscription for wallet transactions
  useEffect(() => {
    if (!user?.id) return;

    console.log('🔔 Setting up real-time wallet transactions subscription for user:', user.id);

    // Subscribe to wallet_transactions INSERT events for this user
    const transactionsChannel = supabase
      .channel(`wallet_transactions_list_${user.id}_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'wallet_transactions',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('💰 New wallet transaction detected via real-time:', {
            transactionId: payload.new?.id,
            type: payload.new?.type,
            amount: payload.new?.amount,
            reason: payload.new?.reason
          });
          
          // Fetch updated transactions list immediately (same pattern as wallet balance)
          await fetchTransactions();
        }
      )
      .subscribe((status) => {
        console.log('📡 Wallet transactions subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time wallet transactions subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Wallet transactions channel error - will retry subscription');
          // Retry subscription after a delay
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Retrying wallet transactions subscription...');
            // Force re-render to retry subscription
            fetchTransactions();
          }, 3000);
        } else if (status === 'TIMED_OUT') {
          console.warn('⚠️ Wallet transactions subscription timed out');
        } else if (status === 'CLOSED') {
          console.warn('⚠️ Wallet transactions subscription closed');
        }
      });

    subscriptionRef.current = transactionsChannel;

    return () => {
      console.log('🔔 Cleaning up wallet transactions subscription');
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
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
        console.error('❌ Error fetching wallet transactions:', error);
        // Don't clear transactions on error - keep existing ones
        return;
      }

      // Explicitly set to empty array if no transactions
      const transactions = data?.transactions || [];
      console.log('💰 Fetched wallet transactions from database:', transactions.length, 'transactions');
      
      // Log all transaction types for debugging
      if (transactions.length > 0) {
        const creditCount = transactions.filter(t => t.type === 'credit').length;
        const debitCount = transactions.filter(t => t.type === 'debit').length;
        console.log('📊 Transaction breakdown:', {
          total: transactions.length,
          credits: creditCount,
          debits: debitCount,
          creditReasons: transactions.filter(t => t.type === 'credit').map(t => t.reason),
          debitReasons: transactions.filter(t => t.type === 'debit').map(t => t.reason)
        });
      }
      
      // Update transactions state
      setTransactions(transactions);
      
      // Fetch appointment details for expert_no_show refunds
      const expertNoShowTransactions = transactions.filter(
        t => t.reason === 'expert_no_show' && t.reference_id && (t.reference_type === 'appointment' || t.reference_type === 'call_session')
      );
      
      if (expertNoShowTransactions.length > 0) {
        fetchAppointmentDetails(expertNoShowTransactions);
      }
      
      // Log if we got new transactions
      if (transactions.length > 0) {
        console.log('✅ Transaction list updated:', {
          count: transactions.length,
          latest: transactions[0]?.description,
          latestAmount: transactions[0]?.amount,
          latestType: transactions[0]?.type
        });
      }
    } catch (error) {
      console.error('❌ Error fetching wallet transactions:', error);
      // Don't clear transactions on error - keep existing ones
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

  // Fetch appointment details for transactions
  const fetchAppointmentDetails = async (transactions: WalletTransaction[]) => {
    try {
      const appointmentIds: string[] = [];
      const callSessionIds: string[] = [];
      const transactionMap: Map<string, string> = new Map(); // Maps appointment_id to transaction reference_id
      
      // Collect appointment IDs and call session IDs
      for (const transaction of transactions) {
        if (transaction.reference_type === 'appointment' && transaction.reference_id) {
          appointmentIds.push(transaction.reference_id);
          transactionMap.set(transaction.reference_id, transaction.reference_id);
        } else if (transaction.reference_type === 'call_session' && transaction.reference_id) {
          callSessionIds.push(transaction.reference_id);
        } else if (transaction.metadata?.reference_id) {
          // Check metadata for appointment ID
          const refId = transaction.metadata.reference_id;
          if (refId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(refId)) {
            appointmentIds.push(refId);
            transactionMap.set(refId, refId);
          }
        }
      }

      // Fetch appointment IDs from call sessions
      if (callSessionIds.length > 0) {
        const { data: callSessions } = await supabase
          .from('call_sessions')
          .select('id, appointment_id')
          .in('id', callSessionIds);

        callSessions?.forEach(cs => {
          if (cs.appointment_id && !appointmentIds.includes(cs.appointment_id)) {
            appointmentIds.push(cs.appointment_id);
            transactionMap.set(cs.appointment_id, cs.id);
          }
        });
      }

      if (appointmentIds.length === 0) return;

      // Fetch appointment details
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('id, appointment_date, start_time, expert_name')
        .in('id', appointmentIds);

      if (error) {
        console.error('Error fetching appointment details:', error);
        return;
      }

      // Map appointment details - also map by call_session_id if needed
      const detailsMap: Record<string, AppointmentDetails> = {};
      appointments?.forEach(apt => {
        const details: AppointmentDetails = {
          appointment_date: apt.appointment_date,
          start_time: apt.start_time || '00:00',
          expert_name: apt.expert_name
        };
        
        // Map by appointment_id
        detailsMap[apt.id] = details;
        
        // Also map by call_session_id if this transaction references a call_session
        transactions.forEach(t => {
          if (t.reference_type === 'call_session' && t.reference_id) {
            const callSession = callSessions?.find(cs => cs.id === t.reference_id && cs.appointment_id === apt.id);
            if (callSession) {
              detailsMap[t.reference_id] = details; // Map by call_session_id too
            }
          }
        });
      });

      setAppointmentDetails(prev => ({ ...prev, ...detailsMap }));
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    }
  };

  // Get appointment details key from transaction
  const getAppointmentDetailsKey = (transaction: WalletTransaction): string | null => {
    // For call_session, check if we have details mapped by call_session_id
    if (transaction.reference_type === 'call_session' && transaction.reference_id) {
      if (appointmentDetails[transaction.reference_id]) {
        return transaction.reference_id;
      }
    }
    
    // For appointment reference_type
    if (transaction.reference_type === 'appointment' && transaction.reference_id) {
      return transaction.reference_id;
    }
    
    // Check metadata
    if (transaction.metadata?.reference_id) {
      const refId = transaction.metadata.reference_id;
      if (refId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(refId)) {
        return refId;
      }
    }
    
    return null;
  };

  // Format transaction description to be more user-friendly
  const formatTransactionDescription = (transaction: WalletTransaction): string => {
    // For expert_no_show refunds, show session details if available
    if (transaction.reason === 'expert_no_show') {
      const detailsKey = getAppointmentDetailsKey(transaction);
      const details = detailsKey ? appointmentDetails[detailsKey] : null;
      
      if (details) {
        const date = new Date(details.appointment_date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        const time = details.start_time ? details.start_time.substring(0, 5) : '';
        return `Session Cancelled - ${details.expert_name} (${date} ${time})`;
      }
      
      return 'Session Cancelled - Full Refund';
    }

    // If description already exists and is clean, use it
    if (transaction.description && !transaction.description.includes('Appointment ') && !transaction.description.includes('expert no-show')) {
      return transaction.description;
    }

    // For other refunds
    if (transaction.reason === 'refund') {
      return 'Refund Processed';
    }

    // Fallback to reason label
    return getReasonLabel(transaction.reason);
  };

  // Get informative badge text (different from description to avoid redundancy)
  const getBadgeText = (transaction: WalletTransaction): string | null => {
    // For expert_no_show, show "Full Refund" instead of "Session Cancelled - Refund"
    if (transaction.reason === 'expert_no_show') {
      return 'Full Refund';
    }
    
    // For other cases, show the reason label
    return getReasonLabel(transaction.reason);
  };

  const getTransactionIcon = (type: string, reason: string) => {
    if (type === 'credit') {
      switch (reason) {
        case 'referral_reward':
          return <Gift className="h-4 w-4 text-primary" />;
        case 'promotional':
        case 'compensation':
          return <Gift className="h-4 w-4 text-green-600" />;
        case 'refund':
        case 'expert_no_show':
          return <ArrowDown className="h-4 w-4 text-green-600" />;
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
      'expert_no_show': 'Session Cancelled - Refund',
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">
                        {formatTransactionDescription(transaction)}
                      </p>
                      {getBadgeText(transaction) && (
                        <Badge variant="outline" className="text-xs">
                          {getBadgeText(transaction)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground flex-wrap">
                      <Calendar className="h-3 w-3" />
                      <span>Refund processed: {formatDate(transaction.created_at)}</span>
                      {transaction.reason === 'expert_no_show' && (() => {
                        const detailsKey = getAppointmentDetailsKey(transaction);
                        const details = detailsKey ? appointmentDetails[detailsKey] : null;
                        if (details) {
                          const sessionDate = new Date(details.appointment_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          });
                          const sessionTime = details.start_time ? details.start_time.substring(0, 5) : '';
                          return (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-xs">
                                Session was: {sessionDate} {sessionTime}
                              </span>
                            </>
                          );
                        }
                        return null;
                      })()}
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

