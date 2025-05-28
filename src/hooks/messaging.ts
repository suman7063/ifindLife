
import { useState, useCallback } from 'react';
import { Message } from '@/types/database/unified';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useMessaging = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (recipientId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: recipientId,
          content,
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add the new message to the list
      if (data) {
        setMessages(prev => [...prev, data]);
      }
      
      toast.success('Message sent');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  }, []);

  return {
    messages,
    loading,
    fetchMessages,
    sendMessage
  };
};
