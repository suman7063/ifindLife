
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface RevenueAnalyticsProps {
  timeRange: string;
  detailed?: boolean;
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ timeRange, detailed = false }) => {
  const revenueData = [
    { period: 'Jan', revenue: 3200, sessions: 28, avgPerSession: 114 },
    { period: 'Feb', revenue: 3800, sessions: 32, avgPerSession: 119 },
    { period: 'Mar', revenue: 4200, sessions: 35, avgPerSession: 120 },
    { period: 'Apr', revenue: 3900, sessions: 31, avgPerSession: 126 },
    { period: 'May', revenue: 4500, sessions: 38, avgPerSession: 118 },
    { period: 'Jun', revenue: 4850, sessions: 42, avgPerSession: 115 }
  ];

  const serviceBreakdown = [
    { name: 'Individual Therapy', value: 6500, color: '#0088FE' },
    { name: 'Couples Therapy', value: 4200, color: '#00C49F' },
    { name: 'Group Sessions', value: 2100, color: '#FFBB28' },
    { name: 'Consultations', value: 1450, color: '#FF8042' }
  ];

  if (!detailed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analysis</CardTitle>
          <CardDescription>Detailed revenue breakdown and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Revenue Trend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Average Per Session</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Avg per Session']} />
                  <Bar dataKey="avgPerSession" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Service Type</CardTitle>
          <CardDescription>Distribution of revenue across different services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {serviceBreakdown.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${service.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      {((service.value / serviceBreakdown.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueAnalytics;
