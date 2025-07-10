import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AwayMessage {
  id: string;
  expert_id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  sent_at: string;
  read_at?: string;
}

export function useAwayMessaging() {
  const [loading, setLoading] = useState(false);

  // Send message to away expert
  const sendAwayMessage = useCallback(async (
    expertId: string,
    message: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('expert_away_messages')
        .insert({
          expert_id: expertId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          message
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error sending away message:', error);
        toast.error('Failed to send message to expert');
        return false;
      }

      // Create a notification for the expert
      await supabase
        .from('notifications')
        .insert({
          user_id: expertId,
          type: 'away_message',
          title: 'New message while away',
          content: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          reference_id: data.id
        });

      toast.success('Message sent to expert. They will be notified when they return.');
      return true;
    } catch (error) {
      console.error('❌ Error in sendAwayMessage:', error);
      toast.error('Failed to send message');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get away messages for expert (expert view)
  const getAwayMessages = useCallback(async (expertId: string): Promise<AwayMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('expert_away_messages')
        .select('*')
        .eq('expert_id', expertId)
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching away messages:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error in getAwayMessages:', error);
      return [];
    }
  }, []);

  // Get unread away message count
  const getUnreadCount = useCallback(async (expertId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('expert_away_messages')
        .select('*', { count: 'exact' })
        .eq('expert_id', expertId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error fetching unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('❌ Error in getUnreadCount:', error);
      return 0;
    }
  }, []);

  // Mark message as read
  const markAsRead = useCallback(async (messageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('mark_away_message_read', {
        message_id: messageId
      });

      if (error) {
        console.error('❌ Error marking message as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error in markAsRead:', error);
      return false;
    }
  }, []);

  // Mark all messages as read for expert
  const markAllAsRead = useCallback(async (expertId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('expert_away_messages')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('expert_id', expertId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error marking all messages as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error in markAllAsRead:', error);
      return false;
    }
  }, []);

  return {
    loading,
    sendAwayMessage,
    getAwayMessages,
    getUnreadCount,
    markAsRead,
    markAllAsRead
  };
}