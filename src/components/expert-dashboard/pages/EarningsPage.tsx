
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, Download, Calendar, CreditCard, Euro, IndianRupee, FileText, FileSpreadsheet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUserCurrency } from '@/hooks/call/useUserCurrency';
import PayoutSetup from './PayoutSetup';
import { exportToPDF, exportToExcel, generateEarningsExportData } from '@/utils/exportUtils';
import { toast } from 'sonner';

const EarningsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [showPayoutSetup, setShowPayoutSetup] = useState(false);
  const [hasPayoutMethod, setHasPayoutMethod] = useState(false);
  const { currency } = useUserCurrency();
  const currencySymbol = currency === 'INR' ? '₹' : '€';
  const CurrencyIcon = currency === 'INR' ? IndianRupee : Euro;

  // Check if payout method is configured
  useEffect(() => {
    const payoutMethod = localStorage.getItem('expertPayoutMethod');
    setHasPayoutMethod(!!payoutMethod);
  }, []);

  const handleExport = (format: 'pdf' | 'excel') => {
    const data = generateEarningsExportData(currency, selectedPeriod);
    
    if (format === 'pdf') {
      exportToPDF(data);
      toast.success('PDF report downloaded successfully!');
    } else {
      exportToExcel(data);
      toast.success('Excel report downloaded successfully!');
    }
  };

  if (showPayoutSetup) {
    return <PayoutSetup onBack={() => setShowPayoutSetup(false)} />;
  }

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          {hasPayoutMethod ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Payout method configured</h4>
                    <p className="text-sm text-muted-foreground">Ready to receive payments in {currency}</p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPayoutSetup(true)}>
                  Update Method
                </Button>
                <Button>
                  Request Payout
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Configure your payout settings to receive earnings in {currency}</p>
              <Button onClick={() => setShowPayoutSetup(true)}>
                <Wallet className="h-4 w-4 mr-2" />
                Setup Payout Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsPage;
