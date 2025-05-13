
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import useConversations from './useConversations';
import useMessages from './useMessages';

const useMessaging = () => {
  const { user, role } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const userId = user?.id || null;
  const { conversations, loading: loadingConversations } = useConversations(userId, role as 'user' | 'expert' | null);
  const { 
    messages, 
    loading: loadingMessages, 
    sendMessage, 
    markAsRead 
  } = useMessages(activeConversationId);

  const startConversation = async (recipientId: string, recipientType: 'user' | 'expert') => {
    if (!user) return null;
    
    try {
      // Check if conversation already exists
      const userIdField = recipientType === 'user' ? 'expert_id' : 'user_id';
      const expertIdField = recipientType === 'expert' ? 'user_id' : 'expert_id';
      
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq(userIdField, user.id)
        .eq(expertIdField, recipientId)
        .maybeSingle();
        
      if (existingConversation) {
        setActiveConversationId(existingConversation.id.toString());
        return existingConversation.id.toString();
      }
      
      // Create new conversation
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          user_id: recipientType === 'expert' ? user.id : recipientId,
          expert_id: recipientType === 'expert' ? recipientId : user.id,
          last_message: '',
          unread_count: 0
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setActiveConversationId(newConversation.id.toString());
      return newConversation.id.toString();
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  };

  return {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    markAsRead,
    startConversation
  };
};

export default useMessaging;
