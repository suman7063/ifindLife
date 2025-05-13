import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from './types';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ensureStringId } from '@/utils/idConverters';

interface UseMessagesProps {
  senderId?: string | null;
  receiverId?: string | null;
}

const useMessages = ({ senderId, receiverId }: UseMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMessages = useCallback(async () => {
    if (!senderId || !receiverId) {
      console.warn("Fetching messages without sender or receiver ID.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${senderId},sender_id.eq.${receiverId}`)
        .or(`receiver_id.eq.${senderId},receiver_id.eq.${receiverId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      }

      if (data) {
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          content: msg.content,
          createdAt: msg.created_at || new Date().toISOString(),
          read: msg.read || false,
        }));
        setMessages(formattedMessages);
      }
    } finally {
      setLoading(false);
    }
  }, [senderId, receiverId]);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as any;

            if (
              (newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
              (newMessage.sender_id === receiverId && newMessage.receiver_id === senderId)
            ) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  id: newMessage.id,
                  senderId: newMessage.sender_id,
                  receiverId: newMessage.receiver_id,
                  content: newMessage.content,
                  createdAt: newMessage.created_at || new Date().toISOString(),
                  read: newMessage.read || false,
                },
              ]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchMessages, receiverId, senderId, user]);

  const sendMessage = async (content: string) => {
    if (!user?.id || !receiverId) {
      console.error("Could not send message: missing user ID or receiver ID.");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content: content,
            sender_id: user.id,
            receiver_id: receiverId,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        return null;
      }

      if (data) {
        const formattedMessage: Message = {
          id: data.id,
          senderId: data.sender_id,
          receiverId: data.receiver_id,
          content: data.content,
          createdAt: data.created_at || new Date().toISOString(),
          read: data.read || false,
        };
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        return formattedMessage;
      }
      return null;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };

  return { messages, loading, sendMessage };
};

export default useMessages;
