
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserCurrency } from '@/hooks/call/useUserCurrency';
import { TrendingUp, Wallet } from 'lucide-react';

const EarningsTab: React.FC = () => {
  const { currency } = useUserCurrency();
  const currencySymbol = currency === 'INR' ? '₹' : '€';

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Earnings Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Earnings Data Yet</h3>
          <p className="text-muted-foreground">
            Once you complete your first session, your earnings will appear here in {currency}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsTab;
