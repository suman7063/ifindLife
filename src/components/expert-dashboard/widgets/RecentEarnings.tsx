import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useAuth } from '@/contexts/auth/AuthContext';

interface EarningsData {
  name: string;
  amount: number;
}

interface TopServiceData {
  name: string;
  amount: number;
  count: number;
}

const data: EarningsData[] = [
  {
    name: 'Jan',
    amount: 4000,
  },
  {
    name: 'Feb',
    amount: 3000,
  },
  {
    name: 'Mar',
    amount: 2000,
  },
  {
    name: 'Apr',
    amount: 2780,
  },
  {
    name: 'May',
    amount: 1890,
  },
  {
    name: 'Jun',
    amount: 2390,
  },
  {
    name: 'Jul',
    amount: 3490,
  },
];

const topServiceData: TopServiceData[] = [
  {
    name: 'Therapy Session',
    amount: 1200,
    count: 12
  }
];

const RecentEarnings = () => {
  const { expertProfile } = useAuth();
  const isLoading = !expertProfile;
  const topService = isLoading ? [] : topServiceData;

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Earnings</CardTitle>
          <CardDescription>Your earnings over the recent period</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Top Service
              </div>
              <div className="text-2xl font-bold">
                {topService[0]?.name || 'None'}
              </div>
              <div className="text-xs text-muted-foreground">
                {topService[0]?.amount || '$0'} from {topService[0]?.count || 0} sessions
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </div>
              <div className="text-2xl font-bold">$46,000</div>
              <div className="text-xs text-muted-foreground">
                +20.1% from last month
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Bar dataKey="amount" fill="#3182CE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEarnings;
