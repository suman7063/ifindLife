
import { useState, useCallback } from 'react';
import { Message } from '@/types/appointments';
import { MessagingUser, UseMessagesReturn } from './types';
import { messagingRepository } from './messagingApi';

export function useMessages(currentUser: MessagingUser | null): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch messages for a specific conversation
   */
  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!currentUser || !currentUser.id) return [];
    
    try {
      setMessagesLoading(true);
      setError(null);
      
      const fetchedMessages = await messagingRepository.getMessages(currentUser.id, partnerId);
      // Ensure all required fields are present for compatibility
      const compatibleMessages = fetchedMessages.map(msg => ({
        ...msg,
        created_at: msg.created_at || new Date().toISOString(),
        read: msg.read || false
      })) as Message[];
      
      setMessages(compatibleMessages);
      return compatibleMessages;
    } catch (error: any) {
      console.error('Error in fetchMessages:', error);
      setError(error.message);
      return [];
    } finally {
      setMessagesLoading(false);
    }
  }, [currentUser]);
  
  return {
    messages,
    messagesLoading,
    fetchMessages,
    setMessages,
    error
  };
}
