
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Wallet, Download, ArrowDown, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Transaction {
  id: string;
  client_name: string;
  service_name: string;
  amount: number;
  date: string;
  status: string;
  payment_method?: string;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  account_details: string;
  payout_date: string | null;
}

const EarningsPage = () => {
  const { expertProfile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('current-month');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [payableBalance, setPayableBalance] = useState(0);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank-transfer');
  const [accountDetails, setAccountDetails] = useState('');
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (expertProfile?.id) {
      fetchTransactions();
      fetchPayoutRequests();
    }
  }, [expertProfile, timeRange]);

  useEffect(() => {
    if (transactions.length > 0) {
      const filtered = transactions.filter(transaction =>
        transaction.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.service_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [transactions, searchQuery]);

  const fetchTransactions = async () => {
    if (!expertProfile?.id) return;
    
    setIsLoading(true);
    try {
      let startDate, endDate;
      const today = new Date();
      
      switch (timeRange) {
        case 'current-month':
          startDate = startOfMonth(today);
          endDate = endOfMonth(today);
          break;
        case 'last-month':
          startDate = startOfMonth(subMonths(today, 1));
          endDate = endOfMonth(subMonths(today, 1));
          break;
        case 'last-3-months':
          startDate = startOfMonth(subMonths(today, 3));
          endDate = endOfMonth(today);
          break;
        case 'last-6-months':
          startDate = startOfMonth(subMonths(today, 6));
          endDate = endOfMonth(today);
          break;
        case 'all-time':
          startDate = new Date(2000, 0, 1); // Far in the past
          endDate = today;
          break;
        default:
          startDate = startOfMonth(today);
          endDate = endOfMonth(today);
      }
      
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      
      // Fetch transactions
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
        .eq('expert_id', expertProfile.id)
        .eq('status', 'completed')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedTransactions = (data || []).map(t => ({
        id: t.id,
        client_name: t.users?.name || 'Unknown Client',
        service_name: t.services?.name || 'Unknown Service',
        amount: t.amount,
        date: format(new Date(t.created_at), 'MMM d, yyyy'),
        status: t.status,
        payment_method: 'Credit Card' // Assuming default
      }));
      
      setTransactions(formattedTransactions);
      setFilteredTransactions(formattedTransactions);
      
      // Calculate total earnings for the period
      const total = formattedTransactions.reduce((sum, t) => sum + t.amount, 0);
      setTotalEarnings(total);
      
      // Calculate available balance (80% of earnings)
      const available = total * 0.8; // Assuming platform fee is 20%
      setPayableBalance(available);
      
      // Prepare chart data (monthly aggregates)
      prepareChartData(data || []);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayoutRequests = async () => {
    if (!expertProfile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('expert_payouts')
        .select('*')
        .eq('expert_id', expertProfile.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPayoutRequests(data || []);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      toast.error('Failed to load payout requests');
    }
  };

  const prepareChartData = (transactions: any[]) => {
    if (!transactions.length) return;
    
    // Group transactions by month
    const monthlyData: Record<string, { earnings: number, month: string }> = {};
    
    transactions.forEach(t => {
      const date = new Date(t.created_at);
      const monthYear = format(date, 'MMM yyyy');
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: monthYear,
          earnings: 0
        };
      }
      
      monthlyData[monthYear].earnings += t.amount;
    });
    
    // Convert to array and sort by date
    const chartDataArray = Object.values(monthlyData).sort((a, b) => {
      return new Date(a.month).getTime() - new Date(b.month).getTime();
    });
    
    setChartData(chartDataArray);
  };

  const handleRequestPayout = async () => {
    if (!expertProfile?.id) return;
    
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid payout amount');
      return;
    }
    
    if (amount > payableBalance) {
      toast.error('Payout amount exceeds available balance');
      return;
    }
    
    if (!payoutMethod) {
      toast.error('Please select a payout method');
      return;
    }
    
    if (!accountDetails) {
      toast.error('Please enter account details for the payout');
      return;
    }
    
    setIsRequestingPayout(true);
    try {
      // Create payout request
      const { error } = await supabase
        .from('expert_payouts')
        .insert({
          expert_id: expertProfile.id,
          amount,
          status: 'pending',
          payment_method: payoutMethod,
          account_details: accountDetails
        });
        
      if (error) throw error;
      
      toast.success('Payout request submitted successfully');
      setIsDialogOpen(false);
      
      // Reset form and refresh data
      setPayoutAmount('');
      setAccountDetails('');
      fetchPayoutRequests();
      
    } catch (error) {
      console.error('Error requesting payout:', error);
      toast.error('Failed to submit payout request');
    } finally {
      setIsRequestingPayout(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Earnings & Payouts</h1>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium">Total Earnings</CardTitle>
              <CardDescription>Current period</CardDescription>
            </div>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium">Platform Fee</CardTitle>
              <CardDescription>20% of earnings</CardDescription>
            </div>
            <ArrowDown className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalEarnings * 0.2).toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium">Available Balance</CardTitle>
              <CardDescription>For payout</CardDescription>
            </div>
            <ArrowUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payableBalance.toFixed(2)}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Request Payout</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Payout</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to withdraw and the payout method.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Available for payout</label>
                    <div className="text-xl font-semibold">${payableBalance.toFixed(2)}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">Payout Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        max={payableBalance}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="payout-method" className="text-sm font-medium">Payout Method</label>
                    <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                      <SelectTrigger id="payout-method">
                        <SelectValue placeholder="Select a payout method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="credit-card">Credit to Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="account-details" className="text-sm font-medium">
                      Account Details
                    </label>
                    <Input
                      id="account-details"
                      placeholder={payoutMethod === 'bank-transfer' 
                        ? 'Account number, routing number, etc.'
                        : payoutMethod === 'paypal' 
                        ? 'PayPal email address'
                        : 'Card details'}
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    onClick={handleRequestPayout}
                    disabled={isRequestingPayout || !payoutAmount || !accountDetails}
                  >
                    {isRequestingPayout ? 'Processing...' : 'Submit Request'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>
            Visualization of your earnings over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Earnings']}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="earnings" 
                  name="Earnings" 
                  fill="#0369a1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              All your completed sessions and payments
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select
                value={timeRange}
                onValueChange={setTimeRange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found for the selected period.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.client_name}</TableCell>
                      <TableCell>{transaction.service_name}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.payment_method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            Your past and pending payout requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payoutRequests.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No payout requests found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Completion Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{formatDate(payout.created_at)}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${payout.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          payout.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : payout.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : payout.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payout.status}
                        </span>
                      </TableCell>
                      <TableCell>{payout.payment_method}</TableCell>
                      <TableCell>
                        {payout.payout_date ? formatDate(payout.payout_date) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsPage;
