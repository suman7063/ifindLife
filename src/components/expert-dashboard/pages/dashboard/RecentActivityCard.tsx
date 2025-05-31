
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, MessageSquare, Star, Clock } from 'lucide-react';

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const RecentActivityCard: React.FC = () => {
  const recentActivities: ActivityItem[] = [
    {
      type: "session",
      message: "Completed session with Sarah M.",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      type: "booking",
      message: "New booking from John D. for tomorrow",
      time: "4 hours ago",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      type: "message",
      message: "3 new messages from clients",
      time: "6 hours ago",
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      type: "review",
      message: "New 5-star review from Maria L.",
      time: "1 day ago",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest activities and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <activity.icon className={`h-4 w-4 mt-1 ${activity.color}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
