
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RevenueChart: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState('6months');
  
  const monthlyData = [
    { month: 'Jan', revenue: 3200, sessions: 28, clients: 15 },
    { month: 'Feb', revenue: 3800, sessions: 32, clients: 18 },
    { month: 'Mar', revenue: 4200, sessions: 35, clients: 22 },
    { month: 'Apr', revenue: 3900, sessions: 31, clients: 20 },
    { month: 'May', revenue: 4500, sessions: 38, clients: 25 },
    { month: 'Jun', revenue: 4850, sessions: 42, clients: 28 }
  ];

  const weeklyData = [
    { week: 'Week 1', revenue: 1200, sessions: 10, clients: 8 },
    { week: 'Week 2', revenue: 1100, sessions: 9, clients: 7 },
    { week: 'Week 3', revenue: 1300, sessions: 11, clients: 9 },
    { week: 'Week 4', revenue: 1250, sessions: 12, clients: 10 }
  ];

  const data = timeframe === 'month' ? weeklyData : monthlyData;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Track your earnings and session trends</CardDescription>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Line Chart */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Revenue Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeframe === 'month' ? 'week' : 'month'} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sessions Bar Chart */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Sessions & Clients</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeframe === 'month' ? 'week' : 'month'} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#10b981" name="Sessions" />
                <Bar dataKey="clients" fill="#f59e0b" name="Clients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {data.reduce((sum, item) => sum + item.sessions, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              ${Math.round(data.reduce((sum, item) => sum + item.revenue, 0) / data.reduce((sum, item) => sum + item.sessions, 0))}
            </p>
            <p className="text-sm text-gray-600">Avg per Session</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
