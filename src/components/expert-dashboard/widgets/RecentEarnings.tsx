
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { DollarSign, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Transaction {
  id: string;
  client_name: string;
  service_name: string;
  amount: number;
  date: string;
}

interface RecentEarningsProps {
  expertId?: string;
  limit?: number;
}

const RecentEarnings: React.FC<RecentEarningsProps> = ({ expertId, limit = 5 }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (expertId) {
      fetchRecentEarnings();
    }
  }, [expertId]);

  const fetchRecentEarnings = async () => {
    if (!expertId) return;
    
    setIsLoading(true);
    try {
      // Fetch recent transactions
      const { data, error } = await supabase
        .from('user_expert_services')
        .select(`
          id,
          user_id,
          expert_id,
          service_id,
          amount,
          created_at,
          status,
          users (
            name
          ),
          services (
            name
          )
        `)
        .eq('expert_id', expertId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      // Format transactions
      const formattedTransactions = (data || []).map(t => ({
        id: t.id,
        client_name: t.users?.name || 'Unknown Client',
        service_name: t.services?.name || 'Unknown Service',
        amount: t.amount,
        date: format(new Date(t.created_at), 'MMM d, yyyy')
      }));
      
      setTransactions(formattedTransactions);
      
      // Calculate total
      const totalAmount = formattedTransactions.reduce((sum, t) => sum + t.amount, 0);
      setTotal(totalAmount);
      
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Recent Earnings</h3>
          <p className="text-sm text-muted-foreground">Last {limit} transactions</p>
        </div>
        <div className="flex items-center text-lg font-bold">
          <DollarSign className="h-5 w-5 mr-1" />
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recent earnings found.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.client_name}</TableCell>
                  <TableCell>{transaction.service_name}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="flex justify-center mt-4">
        <Button variant="outline" asChild>
          <Link to="/expert-dashboard/earnings" className="flex items-center">
            View all earnings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RecentEarnings;
