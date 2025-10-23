import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, DollarSign, Star, Clock } from 'lucide-react';

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: 'appointment',
    icon: Calendar,
    title: 'New Appointment Request',
    message: 'Sarah Wilson wants to book a session with you',
    time: '5 min ago',
    unread: true
  },
  {
    id: 2,
    type: 'message',
    icon: MessageSquare,
    title: 'New Message',
    message: 'Michael Chen sent you a message',
    time: '1 hour ago',
    unread: true
  },
  {
    id: 3,
    type: 'payment',
    icon: DollarSign,
    title: 'Payment Received',
    message: 'You received $50 from Emma Davis',
    time: '2 hours ago',
    unread: false
  },
  {
    id: 4,
    type: 'review',
    icon: Star,
    title: 'New Review',
    message: 'John Smith left you a 5-star review',
    time: '3 hours ago',
    unread: false
  },
  {
    id: 5,
    type: 'reminder',
    icon: Clock,
    title: 'Upcoming Session',
    message: 'You have a session starting in 30 minutes',
    time: '1 day ago',
    unread: false
  }
];

export const ExpertNotificationsScreen: React.FC = () => {
  const getIconColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'text-ifind-teal bg-ifind-teal/10';
      case 'message':
        return 'text-ifind-aqua bg-ifind-aqua/10';
      case 'payment':
        return 'text-green-600 bg-green-50';
      case 'review':
        return 'text-yellow-600 bg-yellow-50';
      case 'reminder':
        return 'text-ifind-purple bg-ifind-purple/10';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-ifind-teal/10 via-ifind-aqua/10 to-ifind-purple/10 p-6 rounded-b-3xl">
        <h1 className="text-2xl font-poppins font-bold text-ifind-charcoal mb-2">
          Notifications
        </h1>
        <p className="text-muted-foreground">
          Stay updated with your activity
        </p>
      </div>

      <div className="p-6 space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <Card 
              key={notification.id} 
              className={`border-border/50 cursor-pointer hover:border-ifind-aqua/30 transition-all duration-300 ${
                notification.unread ? 'bg-ifind-aqua/5' : 'bg-white'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-poppins font-medium text-ifind-charcoal">
                        {notification.title}
                      </h4>
                      {notification.unread && (
                        <Badge className="bg-ifind-teal text-white ml-2 flex-shrink-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
