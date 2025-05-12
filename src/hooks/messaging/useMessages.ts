
import { useState, useCallback } from 'react';
import { Message } from '@/types/appointments';
import { MessagingUser, UseMessagesReturn } from './types';
import { messagingRepository } from './messagingApi';
import { ensureStringId } from '@/utils/supabaseUtils';

export function useMessages(currentUser: MessagingUser): UseMessagesReturn {
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
      
      const messages = await messagingRepository.fetchMessages(
        ensureStringId(currentUser.id), 
        partnerId
      );
      setMessages(messages);
      return messages;
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
