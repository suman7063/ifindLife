
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, Download, Calendar, CreditCard, Euro, IndianRupee } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserCurrency } from '@/hooks/call/useUserCurrency';

const EarningsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const { currency } = useUserCurrency();
  const currencySymbol = currency === 'INR' ? '₹' : '€';
  const CurrencyIcon = currency === 'INR' ? IndianRupee : Euro;

  // No dummy data - will be empty for now

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

      {/* No Earnings Data State */}
      <div className="text-center py-12">
        <CurrencyIcon className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold mb-4">No Earnings Data Available</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Once you start completing sessions, your earnings data will appear here. 
          All amounts will be displayed in {currency}.
        </p>
      </div>

      {/* Payout Settings - Still show for setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payout Settings
          </CardTitle>
          <CardDescription>Set up your payment preferences for {currency} payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Configure your payout settings to receive earnings in {currency}</p>
            <Button className="mt-4">
              <Wallet className="h-4 w-4 mr-2" />
              Setup Payout Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsPage;
