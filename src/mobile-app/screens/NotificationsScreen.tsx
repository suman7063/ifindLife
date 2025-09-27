import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, Heart } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'session',
    title: 'Session Reminder',
    message: 'Your session with Dr. Sarah Johnson starts in 1 hour',
    time: '1h ago',
    unread: true,
    icon: Calendar
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message',
    message: 'Dr. Michael Chen sent you a message',
    time: '2h ago',
    unread: true,
    icon: MessageSquare
  },
  {
    id: 3,
    type: 'general',
    title: 'Session Complete',
    message: 'Your session has been completed successfully',
    time: '1d ago',
    unread: false,
    icon: Heart
  }
];

export const NotificationsScreen: React.FC = () => {
  return (
    <div className="flex flex-col bg-background p-6">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl p-4 border ${
              notification.unread ? 'border-ifind-aqua/30 bg-ifind-aqua/5' : 'border-border/50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-ifind-aqua/10 rounded-full flex items-center justify-center">
                <notification.icon className="h-5 w-5 text-ifind-aqua" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-poppins font-medium text-ifind-charcoal">
                    {notification.title}
                  </h3>
                  {notification.unread && (
                    <Badge className="bg-ifind-aqua text-white text-xs">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};