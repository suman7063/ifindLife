/**
 * Global Call Notification Hook
 * Listens for incoming calls across the entire expert dashboard
 */

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!expertAuthId) {
      return;
    }

    

    // Request browser notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(err => {
        console.warn('⚠️ Could not request notification permission:', err);
      });
    }

    // Subscribe to incoming call requests (database table)
    const callsChannel = supabase
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
        
          const newCall = payload.new as CallRequest;
          
          // Only process pending calls
          if (newCall.status === 'pending') {
            // Set incoming call for dialog
            setIncomingCall(newCall);
            
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
       
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error:', err);
        }
      });

    // Subscribe to notifications table (for database notifications)
    const notificationsChannel = supabase
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
         
          const notification = payload.new as {
            id: string;
            type: string;
            title: string;
            content: string | null;
            user_id: string;
          };

          // Only show call-related notifications here (others might be handled elsewhere)
          if (notification.type === 'incoming_call_request' || notification.type === 'incoming_call') {
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
                  requireInteraction: true,
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
       if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error:', err);
        }
      });

    return () => {
      supabase.removeChannel(callsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [expertAuthId, navigate]);

  // Return incoming call for global dialog (if needed)
  return { incomingCall, setIncomingCall };
}

