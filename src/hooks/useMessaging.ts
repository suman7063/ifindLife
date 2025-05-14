
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isMine: boolean;
  sender_id: string;
  receiver_id: string;
}

export interface Conversation {
  id: string;
  name: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export const useMessaging = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock data for now - this would be replaced with actual Supabase queries
      setConversations([
        {
          id: '1',
          name: 'John Doe',
          profilePicture: 'https://i.pravatar.cc/150?u=john',
          lastMessage: 'Hello, how can I help you today?',
          lastMessageTime: new Date(),
          unreadCount: 2
        },
        {
          id: '2',
          name: 'Jane Smith',
          profilePicture: 'https://i.pravatar.cc/150?u=jane',
          lastMessage: 'Your appointment is confirmed.',
          lastMessageTime: new Date(Date.now() - 3600000),
          unreadCount: 0
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversations'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    setLoading(true);
    setError(null);
    setCurrentConversation(conversationId);

    try {
      // Mock data for now - this would be replaced with actual Supabase queries
      setTimeout(() => {
        const mockMessages = [
          {
            id: '1',
            content: 'Hello, how can I help you today?',
            timestamp: new Date(Date.now() - 86400000),
            isMine: false,
            sender_id: conversationId,
            receiver_id: 'current-user'
          },
          {
            id: '2',
            content: 'I would like to book an appointment.',
            timestamp: new Date(Date.now() - 3600000),
            isMine: true,
            sender_id: 'current-user',
            receiver_id: conversationId
          },
          {
            id: '3',
            content: 'Sure, I have availability next week.',
            timestamp: new Date(Date.now() - 1800000),
            isMine: false,
            sender_id: conversationId,
            receiver_id: 'current-user'
          }
        ];
        setMessages(mockMessages);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
      setLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, content: string): Promise<boolean> => {
    if (!content.trim()) return false;
    setSending(true);
    setError(null);

    try {
      // This would be a Supabase insert in a real implementation
      const newMessage = {
        id: `temp-${Date.now()}`,
        content,
        timestamp: new Date(),
        isMine: true,
        sender_id: 'current-user',
        receiver_id: conversationId
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Update the conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, lastMessage: content, lastMessageTime: new Date() } 
            : conv
        )
      );
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      return false;
    } finally {
      setSending(false);
    }
  }, []);

  return {
    messages,
    conversations,
    currentConversation,
    loading,
    sending,
    error,
    fetchMessages,
    fetchConversations,
    sendMessage,
    setCurrentConversation
  };
};

export default useMessaging;
