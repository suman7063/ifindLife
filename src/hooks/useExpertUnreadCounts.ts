import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface UnreadCounts {
  messages: number;
  notifications: number;
}

export const useExpertUnreadCounts = () => {
  const { expert } = useSimpleAuth();
  const expertId = expert?.auth_id || '';
  const [counts, setCounts] = useState<UnreadCounts>({ messages: 0, notifications: 0 });
  const [loading, setLoading] = useState(false); // Start as false to show UI immediately

  const fetchUnreadCounts = useCallback(async () => {
    if (!expertId) {
      setCounts({ messages: 0, notifications: 0 });
      setLoading(false);
      return;
    }

    try {
      // Use faster approach: fetch limited rows and count client-side
      // This is much faster than exact count on large tables
      // Using limit 100 for even faster queries (enough for badge display)
      const [messageResult, notificationResult] = await Promise.allSettled([
        // Fetch first 100 unread messages (enough for badge, much faster)
        supabase
          .from('messages')
          .select('id')
          .eq('receiver_id', expertId)
          .eq('read', false)
          .limit(100),
        
        // Fetch first 100 unread message notifications
        supabase
          .from('notifications')
          .select('id')
          .eq('user_id', expertId)
          .eq('read', false)
          .eq('type', 'message')
          .limit(100)
      ]);

      // Extract counts from results
      let messageCount = 0;
      let notificationCount = 0;

      if (messageResult.status === 'fulfilled' && messageResult.value.data) {
        messageCount = messageResult.value.data.length;
        // If we got 100, there might be more - show 99+
        if (messageCount >= 100) messageCount = 99;
      } else if (messageResult.status === 'rejected') {
        console.error('Error fetching message count:', messageResult.reason);
      }

      if (notificationResult.status === 'fulfilled' && notificationResult.value.data) {
        notificationCount = notificationResult.value.data.length;
        if (notificationCount >= 100) notificationCount = 99;
      } else if (notificationResult.status === 'rejected') {
        console.error('Error fetching notification count:', notificationResult.reason);
      }

      setCounts({
        messages: messageCount,
        notifications: notificationCount
      });
    } catch (error) {
      console.error('Error fetching unread counts:', error);
      // Don't reset counts on error, keep previous values
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    // Fetch immediately
    fetchUnreadCounts();

    if (!expertId) return;

    // Subscribe to real-time updates for messages
    const messageChannel = supabase
      .channel(`expert-unread-messages-${expertId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${expertId}`,
        },
        (payload) => {
          // Optimistically update count based on event type
          if (payload.eventType === 'INSERT') {
            setCounts(prev => ({ ...prev, messages: (prev.messages || 0) + 1 }));
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new as { read?: boolean } | null;
            // If message was marked as read, decrease count
            if (updatedMsg?.read === true) {
              setCounts(prev => ({ ...prev, messages: Math.max(0, (prev.messages || 0) - 1) }));
            } else {
              // Otherwise refresh to get accurate count
              fetchUnreadCounts();
            }
          }
        }
      )
      .subscribe();

    // Subscribe to real-time updates for notifications
    const notificationChannel = supabase
      .channel(`expert-unread-notifications-${expertId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${expertId}`,
        },
        (payload) => {
          const newNotif = payload.new as { type?: string; read?: boolean } | null;
          // Only process message-related notifications
          if (newNotif?.type === 'message') {
            if (payload.eventType === 'INSERT') {
              setCounts(prev => ({ ...prev, notifications: (prev.notifications || 0) + 1 }));
            } else if (payload.eventType === 'UPDATE') {
              // If notification was marked as read, decrease count
              if (newNotif?.read === true) {
                setCounts(prev => ({ ...prev, notifications: Math.max(0, (prev.notifications || 0) - 1) }));
              } else {
                fetchUnreadCounts();
              }
            }
          }
        }
      )
      .subscribe();

    // Refresh every 10 seconds as backup for faster updates
    const interval = setInterval(fetchUnreadCounts, 10000);

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(notificationChannel);
      clearInterval(interval);
    };
  }, [expertId, fetchUnreadCounts]);

  return { counts, loading, refetch: fetchUnreadCounts };
};

