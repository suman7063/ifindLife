
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, DollarSign, Download, Calendar, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EarningsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  // Mock earnings data
  const earningsData = {
    totalEarnings: 2847.50,
    thisMonth: 1250.00,
    pendingPayouts: 350.00,
    completedSessions: 42,
    averageSessionRate: 120
  };

  const recentTransactions = [
    {
      id: '1',
      client: 'Sarah Johnson',
      service: 'Individual Therapy',
      amount: 120,
      date: '2024-01-15',
      status: 'completed',
      sessionDuration: '60 min'
    },
    {
      id: '2',
      client: 'Michael Chen',
      service: 'Couples Counseling',
      amount: 180,
      date: '2024-01-14',
      status: 'completed',
      sessionDuration: '90 min'
    },
    {
      id: '3',
      client: 'Emma Davis',
      service: 'Quick Consultation',
      amount: 60,
      date: '2024-01-13',
      status: 'pending',
      sessionDuration: '30 min'
    },
    {
      id: '4',
      client: 'Robert Wilson',
      service: 'Individual Therapy',
      amount: 120,
      date: '2024-01-12',
      status: 'completed',
      sessionDuration: '60 min'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      cancelled: 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Earnings & Payouts</h1>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold">${earningsData.totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold">${earningsData.thisMonth.toFixed(2)}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                <p className="text-3xl font-bold">${earningsData.pendingPayouts.toFixed(2)}</p>
              </div>
              <Wallet className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session Rate</p>
                <p className="text-3xl font-bold">${earningsData.averageSessionRate}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Trend</CardTitle>
          <CardDescription>Your earnings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Earnings chart will be implemented here</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest session payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{transaction.client}</h4>
                    <p className="text-sm text-gray-600">{transaction.service}</p>
                    <p className="text-xs text-gray-500">{transaction.date} • {transaction.sessionDuration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${transaction.amount}</p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payout Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payout Settings
            </CardTitle>
            <CardDescription>Manage your payment preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Bank Account</h3>
              <p className="text-sm text-gray-600">****1234 - Chase Bank</p>
              <Button variant="outline" size="sm" className="mt-2">
                Update Account
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Payout Schedule</h3>
              <p className="text-sm text-gray-600">Weekly on Fridays</p>
              <Button variant="outline" size="sm" className="mt-2">
                Change Schedule
              </Button>
            </div>
            
            <Button className="w-full">
              <Wallet className="h-4 w-4 mr-2" />
              Request Payout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarningsPage;
