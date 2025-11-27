import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, ArrowDownToLine, ArrowUpFromLine, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for demo purposes
const MOCK_WALLET_BALANCE = 2500;

const QUICK_RECHARGE_AMOUNTS = [500, 1000, 2000, 5000];

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'debit',
    description: 'Session with Dr. Ananya Sharma',
    amount: 800,
    date: '2024-01-20',
    status: 'completed'
  },
  {
    id: '2',
    type: 'credit',
    description: 'Wallet Recharge',
    amount: 2000,
    date: '2024-01-18',
    status: 'completed'
  },
  {
    id: '3',
    type: 'debit',
    description: 'Session with Ms. Priya Menon',
    amount: 600,
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: '4',
    type: 'credit',
    description: 'Referral Bonus',
    amount: 100,
    date: '2024-01-10',
    status: 'completed'
  },
  {
    id: '5',
    type: 'debit',
    description: 'Session with Dr. Rajesh Kumar',
    amount: 1200,
    date: '2024-01-08',
    status: 'completed'
  },
];

export const WalletScreen: React.FC = () => {
  const [customAmount, setCustomAmount] = useState('');
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('1week');

  const handleQuickRecharge = (amount: number) => {
    console.log('Quick recharge:', amount);
    // PG flow will be initiated here
  };

  const handleCustomRecharge = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      console.log('Custom recharge:', customAmount);
      // PG flow will be initiated here
      setCustomAmount('');
    }
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    const transactions = [...MOCK_TRANSACTIONS];

    switch (selectedFilter) {
      case '1week':
        return transactions.filter(t => {
          const txDate = new Date(t.date);
          const diff = now.getTime() - txDate.getTime();
          return diff <= 7 * 24 * 60 * 60 * 1000;
        });
      case '1month':
        return transactions.filter(t => {
          const txDate = new Date(t.date);
          const diff = now.getTime() - txDate.getTime();
          return diff <= 30 * 24 * 60 * 60 * 1000;
        });
      case '1year':
        return transactions.filter(t => {
          const txDate = new Date(t.date);
          const diff = now.getTime() - txDate.getTime();
          return diff <= 365 * 24 * 60 * 60 * 1000;
        });
      default:
        return transactions;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col bg-background p-6 space-y-6">
      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-ifind-aqua to-ifind-teal p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Wallet Balance</span>
          </div>
        </div>
        <div className="text-4xl font-bold mb-2">₹{MOCK_WALLET_BALANCE.toLocaleString()}</div>
        <p className="text-xs opacity-80">Available for sessions and services</p>
      </Card>

      {/* Quick Recharge Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Quick Recharge</h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_RECHARGE_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              className="h-14 font-semibold text-lg hover:bg-ifind-aqua/10 hover:border-ifind-aqua hover:text-ifind-aqua"
              onClick={() => handleQuickRecharge(amount)}
            >
              <Plus className="h-4 w-4 mr-2" />
              ₹{amount}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Amount Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Custom Amount</h2>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="pl-7 h-12"
            />
          </div>
          <Button
            onClick={handleCustomRecharge}
            disabled={!customAmount || parseFloat(customAmount) <= 0}
            className="h-12 px-6 bg-ifind-aqua hover:bg-ifind-teal text-white"
          >
            Recharge
          </Button>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
          <Dialog open={isStatementOpen} onOpenChange={setIsStatementOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-ifind-aqua">
                View Statement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Transaction Statement</DialogTitle>
                <DialogDescription>
                  View your transaction history
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="1week">1 Week</TabsTrigger>
                  <TabsTrigger value="1month">1 Month</TabsTrigger>
                  <TabsTrigger value="1year">1 Year</TabsTrigger>
                  <TabsTrigger value="custom">
                    <Calendar className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={selectedFilter} className="space-y-3 mt-4">
                  {getFilteredTransactions().length > 0 ? (
                    getFilteredTransactions().map((transaction) => (
                      <Card key={transaction.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'credit' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? (
                                <ArrowDownToLine className="h-4 w-4" />
                              ) : (
                                <ArrowUpFromLine className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">
                                {transaction.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(transaction.date)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'credit' 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions found for this period
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {MOCK_TRANSACTIONS.slice(0, 3).map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownToLine className="h-4 w-4" />
                    ) : (
                      <ArrowUpFromLine className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
