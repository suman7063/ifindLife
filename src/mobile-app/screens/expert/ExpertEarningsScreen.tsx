import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Clock,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data
const monthlyEarnings = [
  { month: 'Jan', amount: 2100 },
  { month: 'Feb', amount: 2350 },
  { month: 'Mar', amount: 2450 },
  { month: 'Apr', amount: 2600 },
  { month: 'May', amount: 2200 },
  { month: 'Jun', amount: 2450 }
];

const recentTransactions = [
  {
    id: 1,
    clientName: 'Sarah Wilson',
    date: 'Jun 15, 2024',
    amount: 50,
    type: 'Video Session',
    status: 'completed'
  },
  {
    id: 2,
    clientName: 'Michael Chen',
    date: 'Jun 14, 2024',
    amount: 45,
    type: 'Chat Session',
    status: 'completed'
  },
  {
    id: 3,
    clientName: 'Emma Davis',
    date: 'Jun 13, 2024',
    amount: 75,
    type: 'Video Session',
    status: 'completed'
  },
  {
    id: 4,
    clientName: 'John Smith',
    date: 'Jun 12, 2024',
    amount: 50,
    type: 'Video Session',
    status: 'pending'
  }
];

export const ExpertEarningsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const totalEarnings = monthlyEarnings.reduce((acc, curr) => acc + curr.amount, 0);
  const currentMonthEarnings = monthlyEarnings[monthlyEarnings.length - 1].amount;
  const previousMonthEarnings = monthlyEarnings[monthlyEarnings.length - 2].amount;
  const growthPercentage = ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings * 100).toFixed(1);

  return (
    <div className="flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10 p-6 rounded-b-3xl">
        <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
          Earnings
        </h1>
        <p className="text-muted-foreground">
          Track your income and transactions
        </p>

        {/* Main Stats */}
        <div className="mt-6 bg-gradient-to-br from-ifind-teal to-ifind-aqua rounded-2xl p-6 text-white shadow-lg">
          <p className="text-white/80 text-sm mb-1">Total Earnings</p>
          <h2 className="text-4xl font-bold mb-2">${totalEarnings.toLocaleString()}</h2>
          <div className="flex items-center space-x-2">
            <Badge className="bg-white/20 text-white border-white/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{growthPercentage}% this month
            </Badge>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Card className="bg-white border-border/50">
            <CardContent className="p-3">
              <div className="w-8 h-8 bg-ifind-teal/10 rounded-lg flex items-center justify-center mb-2">
                <DollarSign className="h-4 w-4 text-ifind-teal" />
              </div>
              <p className="text-lg font-bold text-ifind-charcoal">${currentMonthEarnings}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/50">
            <CardContent className="p-3">
              <div className="w-8 h-8 bg-ifind-aqua/10 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="h-4 w-4 text-ifind-aqua" />
              </div>
              <p className="text-lg font-bold text-ifind-charcoal">49</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/50">
            <CardContent className="p-3">
              <div className="w-8 h-8 bg-ifind-purple/10 rounded-lg flex items-center justify-center mb-2">
                <Clock className="h-4 w-4 text-ifind-purple" />
              </div>
              <p className="text-lg font-bold text-ifind-charcoal">36h</p>
              <p className="text-xs text-muted-foreground">Total Time</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="font-poppins font-semibold text-ifind-charcoal mb-3">
                Monthly Trend
              </h3>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-end justify-between space-x-2 h-40">
                    {monthlyEarnings.map((month, index) => {
                      const maxAmount = Math.max(...monthlyEarnings.map(m => m.amount));
                      const height = (month.amount / maxAmount) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex items-end justify-center mb-2" style={{ height: '120px' }}>
                            <div 
                              className="w-full bg-gradient-to-t from-ifind-teal to-ifind-aqua rounded-t-lg transition-all duration-300 hover:from-ifind-teal/80 hover:to-ifind-aqua/80"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{month.month}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-3">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-ifind-aqua to-ifind-teal rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {transaction.clientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-poppins font-medium text-ifind-charcoal">
                          {transaction.clientName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {transaction.type} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-ifind-charcoal">
                        ${transaction.amount}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={
                          transaction.status === 'completed' 
                            ? 'bg-green-500/10 text-green-700 border-green-200' 
                            : 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
