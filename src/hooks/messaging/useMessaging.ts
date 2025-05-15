
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Conversation, Message, MessagingHook, MessagingUser } from './types';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { messagingRepository } from './messagingApi';

export default function useMessaging(): MessagingHook {
  const { user } = useAuth();
  const [currentConversation, setCurrentConversation] = useState<string | undefined>(undefined);
  const [sending, setSending] = useState(false);
  
  // Create a messaging user from auth user
  const messagingUser: MessagingUser | null = user ? {
    id: user.id,
    name: user.email.split('@')[0]
  } : null;
  
  // Use our specialized hooks for conversations and messages
  const { 
    conversations, 
    conversationsLoading: loading,
    fetchConversations 
  } = useConversations(messagingUser);
  
  const { 
    messages, 
    messagesLoading,
    fetchMessages
  } = useMessages(messagingUser);
  
  // Fetch conversations on mount or when user changes
  useEffect(() => {
    if (messagingUser) {
      fetchConversations();
    }
  }, [messagingUser, fetchConversations]);
  
  // Fetch messages when conversation changes
  useEffect(() => {
    if (messagingUser && currentConversation) {
      fetchMessages(currentConversation);
    }
  }, [messagingUser, currentConversation, fetchMessages]);
  
  const sendMessage = useCallback(async (receiverId: string, content: string): Promise<boolean> => {
    if (!messagingUser?.id) return false;
    
    try {
      setSending(true);
      return await messagingRepository.sendMessage(messagingUser.id, receiverId, content);
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    } finally {
      setSending(false);
    }
  }, [messagingUser]);
  
  return {
    conversations,
    messages,
    loading: loading || messagesLoading,
    sending,
    currentConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setCurrentConversation
  };
}
