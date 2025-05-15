
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types/database/unified';

export interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export const useMessaging = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getConversations = useCallback(async (userId: string): Promise<Conversation[]> => {
    try {
      setIsLoading(true);
      // Get all messages where this user is either sender or receiver
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (messagesError) {
        throw messagesError;
      }

      // Process messages to get unique conversations
      const conversationsMap = new Map<string, Conversation>();
      
      for (const message of messagesData || []) {
        // Determine the other party in the conversation
        const otherPartyId = message.sender_id === userId 
          ? message.receiver_id 
          : message.sender_id;
        
        if (!conversationsMap.has(otherPartyId)) {
          // Fetch user details for the conversation
          const { data: userData } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', otherPartyId)
            .single();

          const { data: expertData } = userData ? null : await supabase
            .from('expert_accounts')
            .select('name, email')
            .eq('id', otherPartyId)
            .maybeSingle();

          const otherUserName = userData?.name || expertData?.name || 'Unknown User';
          
          // Count unread messages
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', userId)
            .eq('sender_id', otherPartyId)
            .eq('read', false);

          conversationsMap.set(otherPartyId, {
            userId: otherPartyId,
            userName: otherUserName,
            lastMessage: message.content,
            timestamp: new Date(message.created_at),
            unread: unreadCount || 0
          });
        }
      }

      return Array.from(conversationsMap.values());
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMessages = useCallback(async (userId: string, recipientId: string): Promise<Message[]> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', userId)
        .eq('sender_id', recipientId);

      // Add 'isMine' property for UI convenience
      return (data || []).map(message => ({
        ...message,
        isMine: message.sender_id === userId
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (
    senderId: string, 
    recipientId: string, 
    content: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: recipientId,
          content,
          read: false
        });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getConversations,
    getMessages,
    sendMessage,
    isLoading
  };
};
