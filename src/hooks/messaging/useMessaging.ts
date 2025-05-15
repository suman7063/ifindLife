
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useMessages } from './useMessages';
import { useConversations } from './useConversations';
import { Message, Conversation, MessagingHook } from './types';

export const useMessaging = (): MessagingHook => {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  
  const { 
    messages, 
    loading: messagesLoading, 
    error: messagesError,
    sendMessage: sendNewMessage,
    markAsRead,
    fetchMessages,
  } = useMessages();
  
  const { 
    conversations, 
    loading: conversationsLoading, 
    error: conversationsError,
    selectedConversation,
    selectConversation,
    fetchConversations,
    setCurrentConversation,
  } = useConversations();
  
  // Combined loading state
  const loading = messagesLoading || conversationsLoading;
  
  // Send message wrapper
  const sendMessage = useCallback(async (receiverId: string, content: string): Promise<boolean> => {
    if (!user || !content.trim()) return false;
    
    setSending(true);
    try {
      const success = await sendNewMessage(content);
      return success;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    } finally {
      setSending(false);
    }
  }, [user, sendNewMessage]);
  
  // Get messages - compatibility with the interface
  const getMessages = useCallback((conversationId: string): Message[] => {
    if (selectedConversation === conversationId) {
      return messages;
    }
    return [];
  }, [messages, selectedConversation]);
  
  // Get conversations - compatibility with the interface
  const getConversations = useCallback((): Conversation[] => {
    return conversations;
  }, [conversations]);
  
  // Set current conversation - alias for selectConversation
  const updateCurrentConversation = useCallback((conversationId: string): void => {
    selectConversation(conversationId);
  }, [selectConversation]);

  return {
    messages,
    conversations,
    currentConversation: selectedConversation,
    loading,
    sending,
    sendMessage,
    getMessages,
    getConversations,
    markAsRead,
    fetchMessages,
    fetchConversations,
    setCurrentConversation: updateCurrentConversation
  };
};
