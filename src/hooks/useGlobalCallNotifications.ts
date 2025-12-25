/**
 * Global Call Notification Hook
 * Listens for incoming calls across the entire expert dashboard
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CallRequest {
  id: string;
  user_id: string;
  expert_id?: string;
  call_type: string;
  status: string;
  user_metadata?: {
    name?: string;
    avatar?: string;
  };
}

export function useGlobalCallNotifications(expertAuthId: string | undefined) {
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState<CallRequest | null>(null);
  const pendingCallsQueueRef = useRef<CallRequest[]>([]);

  // Show next call from queue when current dialog closes
  const showNextCall = useCallback(() => {
    if (pendingCallsQueueRef.current.length > 0) {
      const nextCall = pendingCallsQueueRef.current[0];
      pendingCallsQueueRef.current = pendingCallsQueueRef.current.slice(1);
      setIncomingCall(nextCall);
    } else {
      setIncomingCall(null);
    }
  }, []);

  useEffect(() => {
    if (!expertAuthId) {
      return;
    }

    let callsChannel: ReturnType<typeof supabase.channel> | null = null;
    let notificationsChannel: ReturnType<typeof supabase.channel> | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isMounted = true;

    // Request browser notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(err => {
        console.warn('⚠️ Could not request notification permission:', err);
      });
    }

    const setupChannels = () => {
      if (!isMounted || !expertAuthId) return;

      // Remove old channels if they exist
      if (callsChannel) {
        supabase.removeChannel(callsChannel);
      }
      if (notificationsChannel) {
        supabase.removeChannel(notificationsChannel);
      }

      // Subscribe to incoming call requests (database table)
      callsChannel = supabase
        .channel(`global_incoming_calls_${expertAuthId}_${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'incoming_call_requests',
            filter: `expert_id=eq.${expertAuthId}`
          },
          (payload) => {
            if (!isMounted) return;
            const newCall = payload.new as CallRequest;
            
            // Only process pending calls
            if (newCall.status === 'pending') {
              // Check if dialog is already open
              setIncomingCall(current => {
                if (current) {
                  // Dialog is open, add to queue (avoid duplicates)
                  if (!pendingCallsQueueRef.current.some(call => call.id === newCall.id)) {
                    pendingCallsQueueRef.current = [...pendingCallsQueueRef.current, newCall];
                  }
                  return current; // Keep current dialog open
                } else {
                  // No dialog open, show this one
                  return newCall;
                }
              });
              
              const userName = newCall.user_metadata?.name || 'A user';
              const callType = newCall.call_type === 'video' ? 'Video' : 'Audio';

              // Show toast notification
              toast.info(`📞 Incoming ${callType} Call from ${userName}!`, {
                action: {
                  label: 'View',
                  onClick: () => navigate('/expert-dashboard/calls')
                },
                duration: 20000
              });

              // Show browser notification if permitted
              if ('Notification' in window && Notification.permission === 'granted') {
                try {
                  const notification = new Notification(`📞 Incoming ${callType} Call`, {
                    body: `${userName} wants to have a ${callType.toLowerCase()} call with you`,
                    icon: newCall.user_metadata?.avatar || '/favicon.ico',
                    tag: `call-${newCall.id}`,
                    requireInteraction: true,
                    badge: '/favicon.ico'
                  });

                  // Handle notification click
                  notification.onclick = () => {
                    window.focus();
                    navigate('/expert-dashboard/calls');
                    notification.close();
                  };
                } catch (err) {
                  console.warn('⚠️ Could not show browser notification:', err);
                }
              }
            }
          }
        )
        .subscribe((status, err) => {
          if (!isMounted) return;
          console.log('📡 Calls channel status:', status);
          if (status === 'CHANNEL_ERROR') {
            console.error('❌ Channel error:', err);
            // Don't try to reconnect on the same channel - let cleanup handle it
          } else if (status === 'SUBSCRIBED') {
            console.log('✅ Calls channel subscribed successfully');
          }
        });

      // Subscribe to notifications table (for database notifications)
      notificationsChannel = supabase
        .channel(`global_notifications_${expertAuthId}_${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${expertAuthId}`
          },
          (payload) => {
            if (!isMounted) return;
            const notification = payload.new as {
              id: string;
              type: string;
              title: string;
              content: string | null;
              user_id: string;
            };

            // Only show call-related notifications here (others might be handled elsewhere)
            if (notification.type === 'incoming_call_request' || notification.type === 'incoming_call' || notification.type === 'call_accepted_by_expert') {
              toast.info(notification.title, {
                description: notification.content || '',
                action: {
                  label: 'View',
                  onClick: () => navigate('/expert-dashboard/calls')
                },
                duration: 20000
              });

              // Show browser notification
              if ('Notification' in window && Notification.permission === 'granted') {
                try {
                  const browserNotification = new Notification(notification.title, {
                    body: notification.content || '',
                    icon: '/favicon.ico',
                    tag: `notification-${notification.id}`,
                    requireInteraction: notification.type === 'call_accepted_by_expert' ? false : true,
                    badge: '/favicon.ico'
                  });

                  browserNotification.onclick = () => {
                    window.focus();
                    navigate('/expert-dashboard/calls');
                    browserNotification.close();
                  };
                } catch (err) {
                  console.warn('⚠️ Could not show browser notification:', err);
                }
              }
            }
          }
        )
        .subscribe((status, err) => {
          if (!isMounted) return;
          console.log('📡 Notifications channel status:', status);
          if (status === 'CHANNEL_ERROR') {
            console.error('❌ Channel error:', err);
            // Don't try to reconnect on the same channel - let cleanup handle it
          } else if (status === 'SUBSCRIBED') {
            console.log('✅ Notifications channel subscribed successfully');
          }
        });
    };

    // Initial setup
    setupChannels();

    return () => {
      isMounted = false;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (callsChannel) {
        supabase.removeChannel(callsChannel);
      }
      if (notificationsChannel) {
        supabase.removeChannel(notificationsChannel);
      }
    };
  }, [expertAuthId, navigate]);

  // Custom setter that shows next call when closing
  const setIncomingCallWithQueue = useCallback((call: CallRequest | null) => {
    setIncomingCall(call);
    // If closing dialog, show next call from queue after a short delay
    if (!call) {
      setTimeout(() => {
        showNextCall();
      }, 200);
    }
  }, [showNextCall]);

  // Return incoming call for global dialog and function to show next call
  return { 
    incomingCall, 
    setIncomingCall: setIncomingCallWithQueue
  };
}

