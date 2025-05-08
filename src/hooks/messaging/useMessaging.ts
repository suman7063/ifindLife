
import { useState } from 'react';
import { Message } from '@/types/appointments';
import { MessagingUser, UseMessagingReturn } from './types';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { sendMessage as sendMessageApi, markConversationAsRead as markConversationAsReadApi } from './messagingApi';

/**
 * Main messaging hook that provides complete messaging functionality
 */
export const useMessaging = (currentUser: MessagingUser): UseMessagingReturn => {
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
  const sendMessage = async (receiverId: string, content: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const newMessage = await sendMessageApi(currentUser, receiverId, content);
      
      if (newMessage) {
        // Update local messages state
        setMessages(prev => [...prev, newMessage]);
      }
      
      return newMessage;
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Mark all messages in a conversation as read
   */
  const markConversationAsRead = async (partnerId: string) => {
    setLoading(true);
    
    try {
      const success = await markConversationAsReadApi(currentUser, partnerId);
      
      if (success) {
        // Update local messages state
        setMessages(prev => 
          prev.map(msg => 
            msg.sender_id === partnerId && msg.receiver_id === currentUser?.id
              ? { ...msg, read: true }
              : msg
          )
        );
      }
      
      return success;
    } catch (error: any) {
      console.error('Error in markConversationAsRead:', error);
      return false;
    } finally {
      setLoading(false);
    }
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
    markConversationAsRead
  };
};

export default useMessaging;
