
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';
import { CalendarDays, MessageSquare, Video, CreditCard } from 'lucide-react';

interface RecentActivitiesProps {
  user: UserProfile | any;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ user }) => {
  // This would normally come from an API
  const activities = [
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment scheduled',
      expert: 'Dr. Sarah Johnson',
      date: '2025-05-22T15:30:00',
      icon: CalendarDays
    },
    {
      id: 2,
      type: 'message',
      title: 'New message received',
      expert: 'Dr. Michael Chen',
      date: '2025-05-17T10:15:00',
      icon: MessageSquare
    },
    {
      id: 3,
      type: 'video',
      title: 'Video consultation completed',
      expert: 'Dr. Emily Wilson',
      date: '2025-05-15T14:00:00',
      icon: Video
    },
    {
      id: 4,
      type: 'payment',
      title: 'Wallet recharged',
      amount: '₹500',
      date: '2025-05-10T09:45:00',
      icon: CreditCard
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-100">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <li key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {activity.expert && (
                      <p className="text-xs text-gray-600">with {activity.expert}</p>
                    )}
                    {activity.amount && (
                      <p className="text-xs text-gray-600">Amount: {activity.amount}</p>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="py-6 text-center text-gray-500">No recent activity</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
