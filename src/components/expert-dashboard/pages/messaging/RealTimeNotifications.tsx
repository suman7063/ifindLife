import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bell, Calendar, MessageSquare, DollarSign, User, X, Settings, Check, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'message' | 'appointment' | 'payment' | 'client' | 'system' | 'urgent';
  title: string;
  message: string;
  time: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  clientName?: string;
  clientAvatar?: string;
}

interface NotificationSettings {
  messages: boolean;
  appointments: boolean;
  payments: boolean;
  clients: boolean;
  system: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
}

const RealTimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      message: 'Sarah Johnson sent you a message about her anxiety management progress',
      time: new Date(Date.now() - 300000),
      read: false,
      priority: 'high',
      clientName: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'You have a session with Michael Chen in 15 minutes',
      time: new Date(Date.now() - 600000),
      read: false,
      priority: 'urgent',
      clientName: 'Michael Chen'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $120 received from Emma Davis for consultation',
      time: new Date(Date.now() - 1800000),
      read: true,
      priority: 'medium',
      clientName: 'Emma Davis'
    },
    {
      id: '4',
      type: 'client',
      title: 'New Client Registration',
      message: 'John Smith has booked his first appointment with you',
      time: new Date(Date.now() - 3600000),
      read: true,
      priority: 'medium',
      clientName: 'John Smith'
    },
    {
      id: '5',
      type: 'system',
      title: 'Profile Update',
      message: 'Your expert profile has been successfully updated and approved',
      time: new Date(Date.now() - 7200000),
      read: false,
      priority: 'low'
    },
    {
      id: '6',
      type: 'urgent',
      title: 'Emergency Support Request',
      message: 'Client requires immediate assistance - Crisis intervention needed',
      time: new Date(Date.now() - 900000),
      read: false,
      priority: 'urgent'
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    messages: true,
    appointments: true,
    payments: true,
    clients: true,
    system: true,
    sound: true,
    desktop: true,
    email: false
  });

  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? 'message' : 'appointment',
          title: Math.random() > 0.5 ? 'New Message' : 'Appointment Update',
          message: 'You have a new notification',
          time: new Date(),
          read: false,
          priority: Math.random() > 0.8 ? 'urgent' : 'medium'
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        if (settings.sound && settings.desktop) {
          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/ifindlife-logo.png'
            });
          }
          
          // Show toast notification
          toast(newNotification.title, {
            description: newNotification.message,
            action: {
              label: 'View',
              onClick: () => console.log('View notification')
            }
          });
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [settings]);

  // Request notification permission
  useEffect(() => {
    if (settings.desktop && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.desktop]);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'urgent' ? 'text-red-500' : 
                     priority === 'high' ? 'text-orange-500' : 
                     'text-blue-500';
    
    switch (type) {
      case 'appointment':
        return <Calendar className={`h-4 w-4 ${iconClass}`} />;
      case 'message':
        return <MessageSquare className={`h-4 w-4 ${iconClass}`} />;
      case 'payment':
        return <DollarSign className={`h-4 w-4 ${iconClass}`} />;
      case 'client':
        return <User className={`h-4 w-4 ${iconClass}`} />;
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
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

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant={urgentCount > 0 ? "destructive" : "default"}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                  {urgentCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {urgentCount} urgent
                    </Badge>
                  )}
                </CardDescription>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {showSettings && (
              <div className="mt-4 space-y-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">Notification Settings</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => updateSetting(key as keyof NotificationSettings, checked)}
                      />
                      <Label htmlFor={key} className="text-xs capitalize">
                        {key}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="space-y-1 p-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border-l-4 transition-colors cursor-pointer ${
                        notification.read ? 'bg-gray-50' : getPriorityColor(notification.priority)
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type, notification.priority)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium truncate">
                              {notification.title}
                              {notification.clientName && (
                                <span className="text-xs text-gray-500 ml-1">
                                  • {notification.clientName}
                                </span>
                              )}
                            </h4>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTime(notification.time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {notifications.length > 0 && (
              <>
                <Separator />
                <div className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="w-full"
                  >
                    Clear All
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default RealTimeNotifications;
