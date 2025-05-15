
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';

interface Activity {
  id: string;
  type: string;
  description: string;
  date: string;
  amount?: number;
}

const RecentActivities: React.FC = () => {
  const { profile } = useAuth();
  
  // Extract transactions from profile and convert to activities
  const activities: Activity[] = React.useMemo(() => {
    if (!profile?.transactions) return [];
    
    return (profile.transactions || []).slice(0, 5).map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      description: transaction.description || 'Transaction',
      date: transaction.date,
      amount: transaction.amount
    }));
  }, [profile?.transactions]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
                {activity.amount !== undefined && (
                  <div className={`text-sm font-medium ${activity.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                    {activity.type === 'credit' ? '+' : '-'}{profile?.currency || '$'}{Math.abs(activity.amount).toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent activities to display</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
