
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

export const useAwayMessaging = () => {
  const [loading, setLoading] = useState(false);

  const sendAwayMessage = useCallback(async (
    expertId: string,
    message: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('expert_away_messages')
        .insert({
          expert_id: expertId,
          user_id: 'user-id-placeholder', // This should be the current user's ID
          message
        });

      if (error) throw error;

      toast.success('Message sent to expert');
      return true;
    } catch (error) {
      console.error('Error sending away message:', error);
      toast.error('Failed to send message');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAwayMessages = useCallback(async (expertId: string): Promise<AwayMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('expert_away_messages')
        .select('*')
        .eq('expert_id', expertId)
        .order('sent_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching away messages:', error);
      return [];
    }
  }, []);

  const getUnreadCount = useCallback(async (expertId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('expert_away_messages')
        .select('*', { count: 'exact', head: true })
        .eq('expert_id', expertId)
        .eq('is_read', false);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }, []);

  const markAsRead = useCallback(async (messageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .rpc('mark_away_message_read', { message_id: messageId });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }, []);

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

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      return false;
    }
  }, []);

  return {
    sendAwayMessage,
    getAwayMessages,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    loading
  };
};
