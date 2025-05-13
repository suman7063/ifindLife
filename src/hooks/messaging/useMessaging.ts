
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/supabase/expert';
import { Message, Conversation } from '@/types/supabase/tables';
import { ensureStringId } from '@/utils/idConverters';
import { UseMessagingReturn, MessagingUser } from './types';

export const useMessaging = (user: MessagingUser): UseMessagingReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (partnerId: string): Promise<Message[]> => {
    if (!user || !user.id) return [];
    
    try {
      setMessagesLoading(true);
      setError(null);
      
      const userId = ensureStringId(user.id);
      const partnerIdString = ensureStringId(partnerId);
      
      // Fetch messages between the current user and the partner
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerIdString}),and(sender_id.eq.${partnerIdString},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
      return [];
    } finally {
      setMessagesLoading(false);
    }
  }, [user]);

  const fetchConversations = useCallback(async (): Promise<Conversation[]> => {
    if (!user || !user.id) return [];
    
    try {
      setConversationsLoading(true);
      setError(null);
      
      const userId = ensureStringId(user.id);
      
      // Fetch conversations for the current user
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user_id.eq.${userId},expert_id.eq.${userId}`)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the conversations based on whether the current user is the user or the expert
      const formattedConversations: Conversation[] = (data || []).map(conv => {
        return {
          ...conv,
          userId: userId === conv.user_id ? conv.expert_id : conv.user_id,
          userName: userId === conv.user_id ? conv.expert_name : conv.user_name,
          userAvatar: '',  // Add avatar handling if needed
          lastMessage: conv.last_message || '',
          lastMessageTime: conv.updated_at || conv.created_at || new Date().toISOString(),
          unreadCount: conv.unread_count || 0
        };
      });
      
      setConversations(formattedConversations);
      return formattedConversations;
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
      return [];
    } finally {
      setConversationsLoading(false);
    }
  }, [user]);

  const sendMessage = useCallback(async (receiverId: string, content: string): Promise<Message | null> => {
    if (!user || !user.id) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const senderId = ensureStringId(user.id);
      const receiverIdString = ensureStringId(receiverId);
      
      // Create or update conversation
      const conversationId = `${Math.min(senderId, receiverIdString)}_${Math.max(senderId, receiverIdString)}`;
      
      const now = new Date().toISOString();
      
      // Insert new message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: receiverIdString,
          content,
          created_at: now
        })
        .select();
      
      if (messageError) throw messageError;
      
      // Update conversation with last message
      await supabase
        .from('conversations')
        .upsert({
          id: conversationId,
          user_id: senderId,
          expert_id: receiverIdString,
          last_message: content,
          updated_at: now,
          unread_count: 1
        })
        .select();
      
      // Refresh messages
      await fetchMessages(receiverIdString);
      
      return messageData?.[0] || null;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchMessages]);

  const markConversationAsRead = useCallback(async (partnerId: string): Promise<boolean> => {
    if (!user || !user.id) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const userId = ensureStringId(user.id);
      const partnerIdString = ensureStringId(partnerId);
      
      const conversationId = `${Math.min(userId, partnerIdString)}_${Math.max(userId, partnerIdString)}`;
      
      // Update conversation to mark as read
      const { error } = await supabase
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId)
        .eq(userId === 'user_id' ? 'user_id' : 'expert_id', userId);
      
      if (error) throw error;
      
      // Refresh conversations
      await fetchConversations();
      
      return true;
    } catch (err: any) {
      console.error('Error marking conversation as read:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, fetchConversations]);

  return {
    messages,
    conversations,
    loading,
    messagesLoading,
    conversationsLoading,
    error,
    fetchMessages,
    fetchConversations,
    sendMessage,
    markConversationAsRead
  };
};

export default useMessaging;
