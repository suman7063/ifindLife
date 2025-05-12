
import { useState, useCallback } from 'react';
import { MessagingUser, UseConversationsReturn } from './types';
import { messagingRepository } from './messagingApi';
import { ensureStringId } from '@/utils/idConverters';

export function useConversations(currentUser: MessagingUser): UseConversationsReturn {
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch all conversations for the current user
   */
  const fetchConversations = useCallback(async () => {
    if (!currentUser || !currentUser.id) return [];
    
    try {
      setConversationsLoading(true);
      setError(null);
      
      const conversations = await messagingRepository.fetchConversations(ensureStringId(currentUser.id));
      setConversations(conversations);
      return conversations;
    } catch (error: any) {
      console.error('Error in fetchConversations:', error);
      setError(error.message);
      return [];
    } finally {
      setConversationsLoading(false);
    }
  }, [currentUser]);
  
  return { 
    conversations, 
    conversationsLoading, 
    fetchConversations,
    error 
  };
}
