
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { MessagingUser, Conversation } from './types';

export function useConversations(currentUser: MessagingUser) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch all conversations for the current user
   */
  const fetchConversations = useCallback(async () => {
    if (!currentUser) return [];
    
    try {
      setConversationsLoading(true);
      setError(null);
      
      // First get all messages where the user is either sender or receiver
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });
      
      if (messageError) {
        console.error('Error fetching messages:', messageError);
        toast.error('Failed to load conversations');
        setError(messageError.message);
        return [];
      }
      
      if (!messageData || messageData.length === 0) {
        setConversations([]);
        return [];
      }
      
      // Extract unique user IDs from messages (excluding the current user)
      const userIds = new Set<string>();
      messageData.forEach(msg => {
        if (msg.sender_id === currentUser.id) {
          userIds.add(msg.receiver_id);
        } else {
          userIds.add(msg.sender_id);
        }
      });
      
      // Get user details for all conversation partners
      const userIdsArray = Array.from(userIds);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, profile_picture')
        .in('id', userIdsArray);
      
      if (userError) {
        console.error('Error fetching user details:', userError);
        setError(userError.message);
      }
      
      // Create a map of user IDs to user details for easier access
      const userMap = new Map();
      (userData || []).forEach(user => {
        userMap.set(user.id, user);
      });
      
      // Group messages by conversation partner
      const conversationMap = new Map<string, any[]>();
      messageData.forEach(msg => {
        const partnerId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, []);
        }
        conversationMap.get(partnerId)?.push(msg);
      });
      
      // Create conversation objects
      const conversationsArray: Conversation[] = [];
      conversationMap.forEach((messages, userId) => {
        // Sort messages by created_at in descending order
        messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        const lastMessage = messages[0];
        const unreadCount = messages.filter(msg => msg.sender_id !== currentUser.id && !msg.read).length;
        const user = userMap.get(userId);
        
        conversationsArray.push({
          userId,
          userName: user?.name || 'Unknown User',
          userAvatar: user?.profile_picture,
          lastMessage: lastMessage.content,
          lastMessageTime: lastMessage.created_at,
          unreadCount
        });
      });
      
      // Sort conversations by last message time
      conversationsArray.sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
      
      setConversations(conversationsArray);
      return conversationsArray;
    } catch (error: any) {
      console.error('Error in fetchConversations:', error);
      setError(error.message);
      return [];
    } finally {
      setConversationsLoading(false);
    }
  }, [currentUser]);
  
  return { 
    conversations, 
    conversationsLoading, 
    fetchConversations,
    error 
  };
}
