import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Check, 
  X, 
  Settings, 
  Calendar,
  MessageSquare,
  Heart,
  Star,
  User,
  Clock,
  CheckCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  created_at: string;
  sender_id?: string;
  reference_id?: string;
  data?: Record<string, unknown>;
}

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  booking_confirmations: boolean;
  appointment_reminders: boolean;
  expert_messages: boolean;
  promotional_emails: boolean;
  weekly_digest: boolean;
}

export const NotificationCenter: React.FC = () => {
  const simpleAuth = useSimpleAuth();
  const userId = simpleAuth.user?.id || simpleAuth.userProfile?.id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // Track which notifications have already triggered popup to prevent infinite loops
  // Use localStorage to persist across page refreshes
  const getProcessedNotifications = (): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    const stored = localStorage.getItem('processed_notifications');
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[];
        // Only keep IDs from last 24 hours to prevent localStorage from growing too large
        return new Set(ids);
      } catch {
        return new Set();
      }
    }
    return new Set();
  };
  
  const addProcessedNotification = (id: string) => {
    if (typeof window === 'undefined') return;
    const processed = getProcessedNotifications();
    processed.add(id);
    // Store only last 100 notification IDs to prevent localStorage from growing too large
    const idsArray = Array.from(processed).slice(-100);
    localStorage.setItem('processed_notifications', JSON.stringify(idsArray));
  };
  
  const isNotificationProcessed = (id: string): boolean => {
    return getProcessedNotifications().has(id);
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchPreferences();
      
      // Subscribe to real-time notifications
      const channel = supabase
        .channel(`user-notifications-${userId}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          },
          async (payload) => {
            const newNotif = payload.new as Notification;
            console.log('🔔 New notification received (real-time):', {
              id: newNotif.id,
              type: newNotif.type,
              title: newNotif.title,
              reference_id: newNotif.reference_id,
              hasContent: !!newNotif.content,
              userId: userId,
              timestamp: new Date().toISOString()
            });
            
            // Mark as processed to prevent duplicate popups (persists across page refreshes)
            addProcessedNotification(newNotif.id);
            
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast with actual notification title and content
            const notificationTitle = newNotif.title || 'New Notification';
            const notificationContent = newNotif.content || '';
            
            // Special handling for session_ready notifications - show interactive popup
            if (newNotif.type === 'session_ready') {
              // Get sessionId from reference_id (appointment ID)
              // reference_id contains the appointment ID which we can use to join the call
              const sessionId = newNotif.reference_id;
              
              console.log('📞 Processing session_ready notification:', {
                sessionId,
                title: notificationTitle,
                content: notificationContent,
                notificationId: newNotif.id
              });
              
              if (!sessionId) {
                console.warn('⚠️ session_ready notification missing reference_id (appointment ID)');
                toast.error('Session ID missing in notification');
                return;
              }
              
              // Check if user is already in a call for this appointment
              // If they are, don't show the notification
              try {
                // Check if there's an active call session for this appointment
                const { data: callSession } = await supabase
                  .from('call_sessions')
                  .select('id, status, channel_name')
                  .eq('appointment_id', sessionId)
                  .eq('status', 'active')
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .maybeSingle();
                
                if (callSession) {
                  console.log('ℹ️ User already has active call session for this appointment, skipping notification:', {
                    callSessionId: callSession.id,
                    channelName: callSession.channel_name
                  });
                  return; // Don't show notification if already in call
                }
              } catch (error) {
                console.warn('⚠️ Error checking call session:', error);
                // On error, continue to show notification
              }
              
              // Dispatch custom event to trigger call interface
              const joinCallEvent = new CustomEvent('joinAppointmentCall', {
                detail: {
                  appointmentId: sessionId,
                  notificationId: newNotif.id
                }
              });
              
              console.log('📡 Dispatching joinAppointmentCall event:', {
                appointmentId: sessionId,
                notificationId: newNotif.id
              });
              
              window.dispatchEvent(joinCallEvent);
              
              // Show interactive toast with Join button
              console.log('🎨 Showing toast notification...');
              const toastId = toast.success(notificationTitle, {
                description: notificationContent,
                duration: 30000, // Show for 30 seconds
                action: {
                  label: 'Join Call',
                  onClick: async () => {
                    console.log('🔘 Join Call button clicked');
                    if (sessionId) {
                      try {
                        // Dispatch event to open call interface
                        window.dispatchEvent(joinCallEvent);
                        // Also navigate to booking history as fallback
                        setTimeout(() => {
                          window.location.href = '/user-dashboard/booking-history';
                        }, 500);
                      } catch (error) {
                        console.error('Error joining call:', error);
                        toast.error('Failed to join call. Please try again.');
                      }
                    } else {
                      console.warn('⚠️ Cannot join call: sessionId is missing');
                      toast.error('Session ID not found. Please try from booking history.');
                    }
                  }
                },
                cancel: {
                  label: 'Dismiss',
                  onClick: () => {
                    console.log('❌ Join call popup dismissed');
                  }
                }
              });
              
              console.log('✅ Join call toast displayed with ID:', toastId);
            } else {
              // Regular notification - show simple toast
              console.log('📬 Showing regular notification toast');
              toast.info(notificationTitle, {
                description: notificationContent,
                duration: 5000
              });
            }
            
            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                const browserNotif = new Notification(notificationTitle, {
                  body: notificationContent,
                  icon: '/favicon.ico',
                  tag: `notification-${newNotif.id}`,
                  badge: '/favicon.ico',
                  requireInteraction: newNotif.type === 'session_ready' // Keep session_ready notifications visible
                });
                
                browserNotif.onclick = () => {
                  window.focus();
                  if (newNotif.type === 'session_ready') {
                    // Navigate to booking history to join call
                    window.location.href = '/user-dashboard/booking-history';
                  }
                  browserNotif.close();
                };
              } catch (err) {
                console.warn('Could not show browser notification:', err);
              }
            } else if ('Notification' in window && Notification.permission === 'default') {
              // Request permission for future notifications
              Notification.requestPermission();
            }
          }
        )
        .subscribe((status) => {
          console.log('📡 Notification channel subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully subscribed to real-time notifications for user:', userId);
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Notification channel error for user:', userId);
          } else if (status === 'TIMED_OUT') {
            console.warn('⏱️ Notification channel timed out for user:', userId);
          } else if (status === 'CLOSED') {
            console.warn('🔒 Notification channel closed for user:', userId);
          }
        });

      return () => {
        console.log('🧹 Cleaning up notification channel for user:', userId);
        supabase.removeChannel(channel);
      };
    } else {
      console.log('⚠️ NotificationCenter: No userId, skipping setup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchNotifications = async () => {
    if (!userId) {
      console.log('⚠️ fetchNotifications: No userId');
      return;
    }

    try {
      console.log('📥 Fetching notifications for user:', userId);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Error fetching notifications:', error);
        throw error;
      }

      console.log('✅ Fetched notifications:', data?.length || 0, 'notifications');
      if (data && data.length > 0) {
        console.log('📋 Sample notifications:', data.slice(0, 3).map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          read: n.read
        })));
        
        // Check for unread session_ready notifications and trigger popup (only once per notification)
        const allSessionReady = data.filter(n => n.type === 'session_ready');
        const unreadSessionReady = allSessionReady.filter(n => 
          !n.read && 
          !isNotificationProcessed(n.id) // Only process if not already processed
        );
        
        console.log('📞 Session ready notifications check:', {
          totalSessionReady: allSessionReady.length,
          unreadNotProcessed: unreadSessionReady.length,
          allSessionReadyDetails: allSessionReady.map(n => ({
            id: n.id,
            read: n.read,
            processed: isNotificationProcessed(n.id),
            reference_id: n.reference_id,
            title: n.title
          }))
        });
        
        if (unreadSessionReady.length > 0) {
          console.log('📞 Found unread session_ready notifications:', unreadSessionReady.length);
          // Process the most recent one
          const latestSessionReady = unreadSessionReady[0];
          console.log('📞 Processing latest session_ready notification:', {
            id: latestSessionReady.id,
            reference_id: latestSessionReady.reference_id,
            title: latestSessionReady.title,
            read: latestSessionReady.read
          });
          
          // Mark as processed to prevent infinite loops (persists across page refreshes)
          addProcessedNotification(latestSessionReady.id);
          console.log('✅ Marked notification as processed:', latestSessionReady.id);
          
          // Trigger popup for this notification (same logic as real-time handler)
          const sessionId = latestSessionReady.reference_id;
          if (sessionId) {
            // Check if user is already in a call for this appointment
            const checkIfAlreadyInCall = async () => {
              try {
                // Check if there's an active call session for this appointment
                const { data: callSession } = await supabase
                  .from('call_sessions')
                  .select('id, status, channel_name')
                  .eq('appointment_id', sessionId)
                  .eq('status', 'active')
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .maybeSingle();
                
                if (callSession) {
                  console.log('ℹ️ User already has active call session for this appointment, skipping notification:', {
                    callSessionId: callSession.id,
                    channelName: callSession.channel_name
                  });
                  return true; // Already in call
                }
                return false; // Not in call
              } catch (error) {
                console.warn('⚠️ Error checking call session:', error);
                return false; // On error, show notification anyway
              }
            };
            
            // Check if already in call before showing notification
            const isAlreadyInCall = await checkIfAlreadyInCall();
            if (isAlreadyInCall) {
              console.log('✅ User already in call for this appointment, notification skipped');
              return; // Don't show notification if already in call
            }
            
            const notificationTitle = latestSessionReady.title || 'Video Session Ready';
            const notificationContent = latestSessionReady.content || '';
            
            console.log('📞 Triggering popup for session_ready notification:', {
              sessionId,
              title: notificationTitle,
              content: notificationContent,
              notificationId: latestSessionReady.id
            });
            
            // Dispatch custom event to trigger call interface
            const joinCallEvent = new CustomEvent('joinAppointmentCall', {
              detail: {
                appointmentId: sessionId,
                notificationId: latestSessionReady.id
              }
            });
            
            console.log('📡 Dispatching joinAppointmentCall event with detail:', joinCallEvent.detail);
            window.dispatchEvent(joinCallEvent);
            
            // Show interactive toast with Join button
            console.log('🎨 Showing toast popup...');
            const toastId = toast.success(notificationTitle, {
              description: notificationContent,
              duration: 30000,
              action: {
                label: 'Join Call',
                onClick: async () => {
                  console.log('🔘 Join Call button clicked');
                  window.dispatchEvent(joinCallEvent);
                  setTimeout(() => {
                    window.location.href = '/user-dashboard/booking-history';
                  }, 500);
                }
              },
              cancel: {
                label: 'Dismiss',
                onClick: () => {
                  console.log('❌ Popup dismissed');
                }
              }
            });
            
            console.log('✅ Popup triggered for unread session_ready notification, toast ID:', toastId);
          } else {
            console.warn('⚠️ Session ready notification missing reference_id:', {
              id: latestSessionReady.id,
              title: latestSessionReady.title,
              reference_id: latestSessionReady.reference_id
            });
          }
        } else if (allSessionReady.length > 0) {
          console.log('ℹ️ Found session_ready notifications but all are already processed or read:', {
            total: allSessionReady.length,
            unread: allSessionReady.filter(n => !n.read).length,
            processed: allSessionReady.filter(n => isNotificationProcessed(n.id)).length
          });
          console.log('💡 To show popup again, clear localStorage: localStorage.removeItem("processed_notifications")');
        } else {
          console.log('ℹ️ No session_ready notifications found in fetched notifications');
          // Log all notification types for debugging
          const notificationTypes = [...new Set(data.map(n => n.type))];
          console.log('📋 Available notification types:', notificationTypes);
        }
      }
      
      setNotifications(data || []);
      const unread = data?.filter(n => !n.read).length || 0;
      setUnreadCount(unread);
      console.log('📊 Unread count:', unread);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle missing rows gracefully

      // If table doesn't exist (PGRST205) or row doesn't exist (PGRST116), use defaults
      // Also handle 406 (Not Acceptable) which can occur with RLS when no row exists
      if (error) {
        const errorObj = error as { code?: string; status?: number; message?: string };
        const errorCode = errorObj.code;
        const errorStatus = errorObj.status;
        const errorMessage = errorObj.message || '';
        
        // Check for various error conditions that indicate missing row or table
        if (
          errorCode === 'PGRST205' || 
          errorCode === 'PGRST116' || 
          errorStatus === 406 ||
          errorMessage.includes('406') ||
          errorMessage.includes('Not Acceptable')
        ) {
          // Table doesn't exist or row doesn't exist - use default preferences
          const defaultPrefs: NotificationPreferences = {
            email_notifications: true,
            push_notifications: true,
            booking_confirmations: true,
            appointment_reminders: true,
            expert_messages: true,
            promotional_emails: false,
            weekly_digest: true
          };
          setPreferences(defaultPrefs);
          return;
        }
        throw error;
      }
      
      if (data) {
        setPreferences(data);
      } else {
        // No row found - use default preferences
        const defaultPrefs: NotificationPreferences = {
          email_notifications: true,
          push_notifications: true,
          booking_confirmations: true,
          appointment_reminders: true,
          expert_messages: true,
          promotional_emails: false,
          weekly_digest: true
        };
        setPreferences(defaultPrefs);
      }
    } catch (error: unknown) {
      // Silently handle errors - just use default preferences
      const defaultPrefs: NotificationPreferences = {
        email_notifications: true,
        push_notifications: true,
        booking_confirmations: true,
        appointment_reminders: true,
        expert_messages: true,
        promotional_emails: false,
        weekly_digest: true
      };
      setPreferences(defaultPrefs);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!userId || !preferences) return;

    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .update({ [key]: value })
        .eq('user_id', userId);

      if (error) throw error;
      
      setPreferences(prev => prev ? { ...prev, [key]: value } : null);
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'favorite':
        return <Heart className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      case 'reminder':
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50 text-blue-600';
      case 'appointment':
        return 'bg-green-50 text-green-600';
      case 'favorite':
        return 'bg-red-50 text-red-600';
      case 'review':
        return 'bg-yellow-50 text-yellow-600';
      case 'reminder':
        return 'bg-purple-50 text-purple-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && preferences && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                </div>
                <Switch
                  checked={preferences.push_notifications}
                  onCheckedChange={(checked) => updatePreference('push_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Booking Confirmations</p>
                  <p className="text-sm text-muted-foreground">Notifications about bookings</p>
                </div>
                <Switch
                  checked={preferences.booking_confirmations}
                  onCheckedChange={(checked) => updatePreference('booking_confirmations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders before sessions</p>
                </div>
                <Switch
                  checked={preferences.appointment_reminders}
                  onCheckedChange={(checked) => updatePreference('appointment_reminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Expert Messages</p>
                  <p className="text-sm text-muted-foreground">Messages from experts</p>
                </div>
                <Switch
                  checked={preferences.expert_messages}
                  onCheckedChange={(checked) => updatePreference('expert_messages', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promotional Emails</p>
                  <p className="text-sm text-muted-foreground">Special offers and updates</p>
                </div>
                <Switch
                  checked={preferences.promotional_emails}
                  onCheckedChange={(checked) => updatePreference('promotional_emails', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! Notifications will appear here when you receive them.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <>
                                <Badge variant="secondary" className="text-xs">New</Badge>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};