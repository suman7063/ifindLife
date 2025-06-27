
import { useState, useCallback } from 'react';
import { Conversation } from './types';
import { adaptConversation } from '@/utils/userProfileAdapter';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      // Mock conversations for now - replace with actual API call
      const mockConversations = [
        {
          id: '1',
          participant_id: 'expert-1',
          participant_name: 'Dr. Sarah Johnson',
          name: 'Dr. Sarah Johnson',
          profilePicture: '',
          last_message: 'Thanks for the session today!',
          lastMessage: 'Thanks for the session today!',
          last_message_time: new Date().toISOString(),
          lastMessageDate: new Date().toISOString(),
          unread_count: 2,
          unreadCount: 2
        }
      ];
      
      const adaptedConversations = mockConversations.map(adaptConversation);
      setConversations(adaptedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversation(conversationId);
  }, []);

  return {
    conversations,
    selectedConversation,
    fetchConversations,
    selectConversation,
    loading
  };
};
