
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SessionAnalyticsProps {
  timeRange: string;
  detailed?: boolean;
}

const SessionAnalytics: React.FC<SessionAnalyticsProps> = ({ timeRange, detailed = false }) => {
  const sessionData = [
    { period: 'Jan', completed: 26, cancelled: 2, noShow: 1, rescheduled: 3 },
    { period: 'Feb', completed: 30, cancelled: 1, noShow: 2, rescheduled: 2 },
    { period: 'Mar', completed: 33, cancelled: 2, noShow: 1, rescheduled: 4 },
    { period: 'Apr', completed: 29, cancelled: 3, noShow: 2, rescheduled: 1 },
    { period: 'May', completed: 36, cancelled: 1, noShow: 1, rescheduled: 2 },
    { period: 'Jun', completed: 40, cancelled: 2, noShow: 0, rescheduled: 3 }
  ];

  const sessionTypes = [
    { name: 'Individual Therapy', value: 145, color: '#0088FE' },
    { name: 'Couples Therapy', value: 67, color: '#00C49F' },
    { name: 'Group Sessions', value: 23, color: '#FFBB28' },
    { name: 'Consultations', value: 31, color: '#FF8042' }
  ];

  if (!detailed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
          <CardDescription>Monthly session completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Session Status Analysis</CardTitle>
          <CardDescription>Detailed breakdown of session outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
              <Bar dataKey="noShow" fill="#f59e0b" name="No Show" />
              <Bar dataKey="rescheduled" fill="#3b82f6" name="Rescheduled" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Session Types */}
      <Card>
        <CardHeader>
          <CardTitle>Session Types Distribution</CardTitle>
          <CardDescription>Breakdown of different session types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sessionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sessionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Sessions']} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {sessionTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{type.value} sessions</p>
                    <p className="text-sm text-gray-500">
                      {((type.value / sessionTypes.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(1)}%
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

export default SessionAnalytics;
