
import { useState } from 'react';
import { Message } from '@/types/appointments';
import { MessagingUser, UseMessagingReturn, Conversation } from './types';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { messagingRepository } from './messagingApi';

/**
 * Main messaging hook that provides complete messaging functionality
 */
export const useMessaging = (currentUser: MessagingUser | null): UseMessagingReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    conversations, 
    conversationsLoading, 
    fetchConversations,
    error: conversationsError 
  } = useConversations(currentUser);
  
  const {
    messages,
    messagesLoading,
    fetchMessages,
    setMessages,
    error: messagesError
  } = useMessages(currentUser);
  
  /**
   * Send a new message
   */
  const sendMessage = async (receiverId: string, content: string): Promise<boolean> => {
    if (!currentUser || !currentUser.id) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const newMessage = await messagingRepository.sendMessage(currentUser.id, receiverId, content);
      
      if (newMessage) {
        // Update local messages state
        setMessages(prev => [...prev, newMessage]);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Mark message as read
   */
  const markMessageAsRead = async (messageId: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const success = await messagingRepository.markAsRead(messageId);
      
      if (success) {
        // Update local messages state
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
      }
      
      return success;
    } catch (error: any) {
      console.error('Error in markMessageAsRead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search for users
   */
  const searchUsers = async (query: string): Promise<MessagingUser[]> => {
    if (!query.trim()) return [];
    
    try {
      return await messagingRepository.searchUsers(query);
    } catch (error: any) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  /**
   * Refresh conversations
   */
  const refreshConversations = async (): Promise<void> => {
    await fetchConversations();
  };

  // Combine errors from all sources
  const combinedError = error || conversationsError || messagesError;
  
  return {
    messages,
    conversations,
    loading,
    messagesLoading,
    conversationsLoading,
    error: combinedError,
    fetchMessages,
    fetchConversations,
    sendMessage,
    markMessageAsRead,
    refreshConversations,
    searchUsers,
    getMessages: fetchMessages // Alias for backward compatibility
  };
};

export default useMessaging;
