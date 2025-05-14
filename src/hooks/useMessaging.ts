
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types/database/unified';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useMessaging = (recipientId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Function to load messages
  const fetchMessages = useCallback(async () => {
    if (!user?.id || !recipientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get messages sent by current user to recipient
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', user.id)
        .eq('receiver_id', recipientId)
        .order('created_at', { ascending: true });

      if (sentError) throw sentError;

      // Get messages received by current user from recipient
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', recipientId)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: true });

      if (receivedError) throw receivedError;

      // Combine and sort all messages by timestamp
      const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];
      allMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      // Add a property to indicate if message was sent by current user
      const processedMessages = allMessages.map(msg => ({
        ...msg,
        isMine: msg.sender_id === user.id,
        timestamp: new Date(msg.created_at)
      }));

      setMessages(processedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  }, [user, recipientId]);

  // Send a message to the recipient
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !recipientId) {
      toast.error('Cannot send message: Missing user or recipient');
      return;
    }

    try {
      const newMessage = {
        sender_id: user.id,
        receiver_id: recipientId,
        content,
        read: false,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;

      // Add the new message to the state with the "isMine" property
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          ...data, 
          isMine: true,
          timestamp: new Date(data.created_at)
        }
      ]);

      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
      throw err;
    }
  }, [user, recipientId]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!user?.id || !recipientId) return;

    try {
      const unreadMessages = messages.filter(
        msg => !msg.read && msg.sender_id === recipientId
      );

      if (unreadMessages.length === 0) return;

      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .in('id', unreadMessages.map(msg => msg.id));

      if (error) throw error;

      // Update local state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.sender_id === recipientId ? { ...msg, read: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [user, recipientId, messages]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user?.id || !recipientId) return;

    // Initial fetch
    fetchMessages();

    // Set up subscription for new messages
    const subscription = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${recipientId},receiver_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Add the received message to state
          setMessages(prevMessages => [
            ...prevMessages,
            {
              ...newMessage,
              isMine: false,
              timestamp: new Date(newMessage.created_at)
            }
          ]);
          
          // Mark it as read if the conversation is open
          markAsRead();
        }
      )
      .subscribe();

    // Mark messages as read when conversation is opened
    markAsRead();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, recipientId, fetchMessages, markAsRead]);

  return {
    messages,
    sendMessage,
    loading,
    error,
    fetchMessages,
    markAsRead
  };
};
