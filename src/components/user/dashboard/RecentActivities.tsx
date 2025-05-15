
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';

interface RecentActivitiesProps {
  user: UserProfile | null;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ user }) => {
  const activities = [
    { id: 1, type: 'Session', title: 'Consultation with Dr. Smith', date: '2023-05-10', status: 'Completed' },
    { id: 2, type: 'Payment', title: 'Wallet recharge', date: '2023-05-08', status: 'Success' },
    { id: 3, type: 'Program', title: 'Enrolled in Stress Management', date: '2023-05-05', status: 'Active' }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent activities</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
