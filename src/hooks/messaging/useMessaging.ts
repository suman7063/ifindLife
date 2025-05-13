
import { useState, useCallback } from 'react';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { Conversation, Message } from './types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';

export const useMessaging = () => {
  const { user } = useAuth();
  const { conversations, loadConversations, isLoadingConversations } = useConversations();
  const { messages, loadMessages, sendMessage, isLoadingMessages } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleSelectConversation = useCallback(async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (user) {
      await loadMessages(conversation.id);
    }
  }, [user, loadMessages]);

  const handleSendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!selectedConversation || !user || !content.trim()) {
      return false;
    }
    
    return await sendMessage(content, selectedConversation.id);
  }, [selectedConversation, user, sendMessage]);

  return {
    conversations,
    loadConversations,
    isLoadingConversations,
    messages,
    loadMessages,
    isLoadingMessages,
    selectedConversation,
    selectConversation: handleSelectConversation,
    sendMessage: handleSendMessage
  };
};
