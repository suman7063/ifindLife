
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageSquare, Users, Star, Clock } from 'lucide-react';

const RecentActivityCard: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'session',
      title: 'Session completed with Sarah Johnson',
      description: 'Anxiety management - 50 minutes',
      time: '2 hours ago',
      icon: Calendar,
      color: 'text-blue-500',
      avatar: '/lovable-uploads/avatar1.jpg'
    },
    {
      id: 2,
      type: 'message',
      title: 'New message from Michael Chen',
      description: 'Follow-up question about homework assignment',
      time: '4 hours ago',
      icon: MessageSquare,
      color: 'text-green-500',
      avatar: '/lovable-uploads/avatar2.jpg'
    },
    {
      id: 3,
      type: 'review',
      title: 'Received 5-star review',
      description: 'Emma Davis left positive feedback',
      time: '6 hours ago',
      icon: Star,
      color: 'text-yellow-500',
      avatar: '/lovable-uploads/avatar3.jpg'
    },
    {
      id: 4,
      type: 'client',
      title: 'New client registration',
      description: 'John Smith booked initial consultation',
      time: '1 day ago',
      icon: Users,
      color: 'text-purple-500',
      avatar: '/lovable-uploads/avatar4.jpg'
    },
    {
      id: 5,
      type: 'session',
      title: 'Session scheduled',
      description: 'Lisa Park - Tomorrow at 2:00 PM',
      time: '1 day ago',
      icon: Calendar,
      color: 'text-blue-500',
      avatar: '/lovable-uploads/avatar5.jpg'
    }
  ];

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'session':
        return <Badge className="bg-blue-100 text-blue-800">Session</Badge>;
      case 'message':
        return <Badge className="bg-green-100 text-green-800">Message</Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>;
      case 'client':
        return <Badge className="bg-purple-100 text-purple-800">Client</Badge>;
      default:
        return <Badge variant="secondary">Activity</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback>
                    <Icon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    {getActivityBadge(activity.type)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
