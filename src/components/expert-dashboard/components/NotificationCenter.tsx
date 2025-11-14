
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Calendar, MessageSquare, DollarSign, User, X, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'payment' | 'client' | 'system' | 'urgent';
  title: string;
  message: string;
  time: string;
  read: boolean;
  created_at?: string;
}

const NotificationCenter: React.FC = () => {
  const { expert } = useSimpleAuth();
  const expertId = expert?.auth_id || '';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!expertId) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', expertId)
          .eq('type', 'message') // Only fetch message-related notifications
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        // Transform database notifications to component format
        const transformedNotifications: Notification[] = (data || []).map((notif: any) => ({
          id: notif.id,
          type: (notif.type as any) || 'system',
          title: notif.title || 'Notification',
          message: notif.content || notif.message || '',
          time: formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }),
          read: notif.read || false,
          created_at: notif.created_at
        }));

        setNotifications(transformedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Subscribe to real-time notifications - handle INSERT, UPDATE, DELETE
    const channel = supabase
      .channel(`expert-notifications-realtime-${expertId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${expertId}`,
        },
        (payload) => {
          const newNotif = payload.new as any;
          // Only process message-related notifications for now
          if (newNotif.type !== 'message') return;
          
          const transformed: Notification = {
            id: newNotif.id,
            type: (newNotif.type as any) || 'system',
            title: newNotif.title || 'Notification',
            message: newNotif.content || newNotif.message || '',
            time: formatDistanceToNow(new Date(newNotif.created_at), { addSuffix: true }),
            read: newNotif.read || false,
            created_at: newNotif.created_at
          };
          
          // Add to notifications list
          setNotifications(prev => [transformed, ...prev]);
          
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              const browserNotif = new Notification(transformed.title, {
                body: transformed.message,
                icon: '/favicon.ico',
                tag: `notification-${transformed.id}`,
                badge: '/favicon.ico'
              });
              
              browserNotif.onclick = () => {
                window.focus();
                browserNotif.close();
              };
            } catch (err) {
              console.warn('Could not show browser notification:', err);
            }
          }
          
          // Show toast notification
          toast.info(transformed.title, {
            description: transformed.message,
            duration: 5000
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${expertId}`,
        },
        (payload) => {
          const updatedNotif = payload.new as any;
          // Update notification in list
          setNotifications(prev =>
            prev.map(notif =>
              notif.id === updatedNotif.id
                ? {
                    ...notif,
                    read: updatedNotif.read || false,
                    time: formatDistanceToNow(new Date(updatedNotif.created_at), { addSuffix: true })
                  }
                : notif
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${expertId}`,
        },
        (payload) => {
          const deletedNotif = payload.old as { id: string };
          // Remove notification from list
          setNotifications(prev => prev.filter(notif => notif.id !== deletedNotif.id));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time notifications subscribed');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Notification channel error');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [expertId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case 'client':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      // Optimistically update - real-time subscription will also update it
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const removeNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Optimistically remove - real-time subscription will also remove it
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error removing notification:', error);
      toast.error('Failed to remove notification');
    }
  };

  const markAllAsRead = async () => {
    if (!expertId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', expertId)
        .eq('read', false)
        .eq('type', 'message'); // Only mark message notifications as read

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
            <CardDescription>
              You have {unreadCount} unread notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {loading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            •
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notifications.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
