
import { useState, useCallback } from 'react';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { Conversation, Message } from './types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ExpertProfile } from '@/types/supabase';

export const useMessaging = (expertProfile?: ExpertProfile | null) => {
  const { user } = useAuth();
  const { 
    conversations, 
    loadConversations: _loadConversations, 
    isLoadingConversations 
  } = useConversations();
  const { 
    messages, 
    loadMessages: _loadMessages, 
    sendMessage: _sendMessage, 
    isLoadingMessages 
  } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const fetchConversations = useCallback(async () => {
    if (user || expertProfile) {
      await _loadConversations();
    }
  }, [user, expertProfile, _loadConversations]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (user || expertProfile) {
      await _loadMessages(conversationId);
    }
  }, [user, expertProfile, _loadMessages]);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (conversation?.id) {
      await fetchMessages(conversation.id);
    }
  }, [fetchMessages]);

  const sendMessage = useCallback(async (recipientId: string, content: string): Promise<boolean> => {
    if (!content.trim() || (!user && !expertProfile)) {
      return false;
    }
    
    return await _sendMessage(content, recipientId);
  }, [user, expertProfile, _sendMessage]);

  return {
    conversations,
    loadConversations: _loadConversations,
    fetchConversations,
    isLoadingConversations,
    conversationsLoading: isLoadingConversations,
    messages,
    loadMessages: _loadMessages,
    fetchMessages,
    isLoadingMessages,
    messagesLoading: isLoadingMessages,
    loading: isLoadingMessages,
    selectedConversation,
    selectConversation,
    sendMessage
  };
};
