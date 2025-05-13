
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types/supabase/tables';
import { ensureStringId } from '@/utils/idConverters';

const useMessages = (conversationId: string | number | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        const formattedMessages: Message[] = data.map((msg: any) => ({
          id: msg.id.toString(),
          conversation_id: ensureStringId(msg.conversation_id) || '',
          sender_id: msg.sender_id,
          sender_type: msg.sender_type,
          content: msg.content,
          created_at: msg.created_at,
          read: msg.read || false
        }));

        setMessages(formattedMessages);
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        setError(err.message || 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel(`conversation_${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}` 
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  const sendMessage = async (content: string, senderId: string, senderType: 'user' | 'expert') => {
    try {
      if (!conversationId || !content.trim() || !senderId) {
        return false;
      }

      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: senderId,
        sender_type: senderType,
        content: content.trim(),
        read: false
      });

      if (error) throw error;

      // Update the conversation's last message
      await supabase
        .from('conversations')
        .update({ 
          last_message: content.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  };

  const markAsRead = async (messageIds: (string | number)[]) => {
    try {
      if (!messageIds.length) return true;
      
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds);
        
      return !error;
    } catch (err) {
      console.error('Error marking messages as read:', err);
      return false;
    }
  };

  return { messages, loading, error, sendMessage, markAsRead };
};

export default useMessages;
