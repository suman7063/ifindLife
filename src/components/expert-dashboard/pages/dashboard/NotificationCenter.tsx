
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Calendar, MessageSquare, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'Emergency Session Request',
      message: 'Sarah Johnson needs immediate support',
      time: '5 min ago',
      read: false,
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Upcoming Session',
      message: 'Session with Michael Chen in 30 minutes',
      time: '25 min ago',
      read: false,
      icon: Calendar
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      message: 'Emma Davis sent you a follow-up question',
      time: '1 hour ago',
      read: true,
      icon: MessageSquare
    },
    {
      id: 4,
      type: 'client',
      title: 'New Client Registration',
      message: 'John Smith completed registration',
      time: '2 hours ago',
      read: true,
      icon: Users
    },
    {
      id: 5,
      type: 'success',
      title: 'Session Completed',
      message: 'Successfully completed session with Lisa Park',
      time: '3 hours ago',
      read: true,
      icon: CheckCircle
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'appointment':
        return 'border-l-blue-500 bg-blue-50';
      case 'message':
        return 'border-l-green-500 bg-green-50';
      case 'client':
        return 'border-l-purple-500 bg-purple-50';
      case 'success':
        return 'border-l-emerald-500 bg-emerald-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Stay updated with your practice</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${
                    notification.read ? 'bg-gray-50' : getNotificationColor(notification.type)
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${
                      notification.type === 'urgent' ? 'text-red-500' :
                      notification.type === 'appointment' ? 'text-blue-500' :
                      notification.type === 'message' ? 'text-green-500' :
                      notification.type === 'client' ? 'text-purple-500' :
                      'text-emerald-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
