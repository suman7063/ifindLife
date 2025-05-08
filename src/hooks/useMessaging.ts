
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Message } from '@/types/appointments';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/types/supabase/expert';

interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const useMessaging = (currentUser: ExpertProfile | UserProfile | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
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
      const conversationMap = new Map<string, Message[]>();
      messageData.forEach(msg => {
        const partnerId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, []);
        }
        conversationMap.get(partnerId)?.push(msg as Message);
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
  
  /**
   * Fetch messages for a specific conversation
   */
  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!currentUser) return [];
    
    try {
      setMessagesLoading(true);
      setError(null);
      
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });
      
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        toast.error('Failed to load messages');
        setError(messagesError.message);
        return [];
      }
      
      // Mark received messages as read
      const unreadMessages = messages?.filter(msg => 
        msg.sender_id === partnerId && 
        msg.receiver_id === currentUser.id && 
        !msg.read
      ) || [];
      
      if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map(msg => msg.id);
        const { error: updateError } = await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadIds);
        
        if (updateError) {
          console.error('Error marking messages as read:', updateError);
        }
      }
      
      setMessages(messages as Message[] || []);
      return messages as Message[] || [];
    } catch (error: any) {
      console.error('Error in fetchMessages:', error);
      setError(error.message);
      return [];
    } finally {
      setMessagesLoading(false);
    }
  }, [currentUser]);
  
  /**
   * Send a new message
   */
  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!currentUser) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content,
          read: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        setError(error.message);
        return null;
      }
      
      // Update local messages state
      setMessages(prev => [...prev, data as Message]);
      
      return data as Message;
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  /**
   * Mark all messages in a conversation as read
   */
  const markConversationAsRead = useCallback(async (partnerId: string) => {
    if (!currentUser) return false;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', partnerId)
        .eq('receiver_id', currentUser.id)
        .eq('read', false);
      
      if (error) {
        console.error('Error marking conversation as read:', error);
        return false;
      }
      
      // Update local messages state
      setMessages(prev => 
        prev.map(msg => 
          msg.sender_id === partnerId && msg.receiver_id === currentUser.id
            ? { ...msg, read: true }
            : msg
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error in markConversationAsRead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
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
