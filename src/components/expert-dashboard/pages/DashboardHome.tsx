
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { Calendar, DollarSign, Users, Star } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { expertProfile } = useAuth();

  const stats = [
    { icon: Calendar, label: 'Today\'s Appointments', value: '3' },
    { icon: DollarSign, label: 'Monthly Earnings', value: '$1,250' },
    { icon: Users, label: 'Total Clients', value: '45' },
    { icon: Star, label: 'Average Rating', value: '4.8' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {expertProfile?.name}!</h1>
        <p className="text-muted-foreground">Here's your dashboard overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`capitalize ${
                  expertProfile?.status === 'approved' ? 'text-green-600' :
                  expertProfile?.status === 'pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {expertProfile?.status || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Verified:</span>
                <span>{expertProfile?.verified ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
