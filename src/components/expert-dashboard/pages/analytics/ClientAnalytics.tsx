
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ClientAnalyticsProps {
  timeRange: string;
}

const ClientAnalytics: React.FC<ClientAnalyticsProps> = ({ timeRange }) => {
  const clientData = [
    { period: 'Jan', new: 5, active: 22, returning: 18, churned: 2 },
    { period: 'Feb', new: 8, active: 28, returning: 20, churned: 1 },
    { period: 'Mar', new: 6, active: 32, returning: 24, churned: 2 },
    { period: 'Apr', new: 4, active: 34, returning: 26, churned: 3 },
    { period: 'May', new: 7, active: 38, returning: 28, churned: 1 },
    { period: 'Jun', new: 9, active: 42, returning: 32, churned: 2 }
  ];

  const retentionData = [
    { cohort: 'Jan 2024', month1: 100, month2: 85, month3: 72, month4: 68, month5: 65, month6: 62 },
    { cohort: 'Feb 2024', month1: 100, month2: 88, month3: 75, month4: 70, month5: 68 },
    { cohort: 'Mar 2024', month1: 100, month2: 82, month3: 78, month4: 74 },
    { cohort: 'Apr 2024', month1: 100, month2: 90, month3: 82 },
    { cohort: 'May 2024', month1: 100, month2: 87 },
    { cohort: 'Jun 2024', month1: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Client Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Client Growth & Activity</CardTitle>
          <CardDescription>Track new clients, active users, and retention</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="new" fill="#3b82f6" name="New Clients" />
              <Bar dataKey="returning" fill="#10b981" name="Returning Clients" />
              <Bar dataKey="churned" fill="#ef4444" name="Churned Clients" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Client Retention */}
      <Card>
        <CardHeader>
          <CardTitle>Client Retention Analysis</CardTitle>
          <CardDescription>Client retention rates by cohort</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cohort" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
              <Line type="monotone" dataKey="month1" stroke="#3b82f6" name="Month 1" />
              <Line type="monotone" dataKey="month2" stroke="#10b981" name="Month 2" />
              <Line type="monotone" dataKey="month3" stroke="#f59e0b" name="Month 3" />
              <Line type="monotone" dataKey="month6" stroke="#ef4444" name="Month 6" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAnalytics;
