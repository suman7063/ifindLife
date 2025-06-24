
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Message } from '@/types/database/unified';
import { Conversation } from './types';

const useMessaging = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (senderId: string, receiverId: string, content: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          content: content.trim(),
          read: false
        });

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast.error('Failed to send message');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMessages = useCallback(async (userId: string, otherUserId: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return (data || []).map(msg => ({
        ...msg,
        isMine: msg.sender_id === userId
      }));
    } catch (error) {
      console.error('Error in getMessages:', error);
      return [];
    }
  }, []);

  const getConversations = useCallback(async (userId: string): Promise<Conversation[]> => {
    try {
      // This is a simplified implementation
      // In a real app, you'd want to get the latest message from each conversation
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, content, created_at')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      // Group messages by conversation partner
      const conversationMap = new Map();
      
      data?.forEach(message => {
        const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            name: 'User', // You'd fetch actual names from users table
            lastMessage: message.content,
            lastMessageDate: message.created_at,
            unreadCount: 0,
            profilePicture: ''
          });
        }
      });

      return Array.from(conversationMap.values());
    } catch (error) {
      console.error('Error in getConversations:', error);
      return [];
    }
  }, []);

  const markAsRead = useCallback(async (messageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) {
        console.error('Error marking message as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }, []);

  return {
    sendMessage,
    getMessages,
    getConversations,
    markAsRead,
    loading
  };
};

export default useMessaging;
