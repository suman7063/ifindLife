
import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { MessagingUser, Message, Conversation, MessagingContextType } from './types';
import { UserProfile } from '@/types/supabase/user';
import { ExpertProfile } from '@/types/database/unified';
import { format } from 'date-fns';

const useMessaging = (user: MessagingUser | UserProfile | ExpertProfile | null): MessagingContextType => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<MessagingUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [conversationsLoading, setConversationsLoading] = useState<boolean>(false);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Extract user ID safely
  const userId = useMemo(() => {
    if (!user) return null;
    if (typeof user === 'string') return user;
    if ('id' in user) return user.id;
    return null;
  }, [user]);
  
  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!userId) return;
    
    try {
      setConversationsLoading(true);
      
      // In a real implementation, this would fetch from your database
      // This is a simplified mock implementation
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      // Process conversations
      const processedConversations = await Promise.all((data || []).map(async (conv) => {
        const otherUserId = conv.sender_id === userId ? conv.receiver_id : conv.sender_id;
        
        // Get user details
        const { data: userData } = await supabase
          .from(conv.user_type === 'expert' ? 'expert_profiles' : 'user_profiles')
          .select('name, profile_picture')
          .eq('id', otherUserId)
          .single();
          
        // Get last message
        const { data: lastMessageData } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        // Count unread messages
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact' })
          .eq('receiver_id', userId)
          .eq('sender_id', otherUserId)
          .eq('read', false);
        
        return {
          userId: otherUserId,
          userName: userData?.name || 'Unknown User',
          userAvatar: userData?.profile_picture,
          lastMessage: lastMessageData ? {
            id: lastMessageData.id,
            senderId: lastMessageData.sender_id,
            receiverId: lastMessageData.receiver_id,
            content: lastMessageData.content,
            timestamp: lastMessageData.created_at,
            read: lastMessageData.read
          } : undefined,
          lastMessageTime: lastMessageData?.created_at || conv.updated_at,
          unreadCount: unreadCount || 0
        };
      }));
      
      setConversations(processedConversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err as Error);
    } finally {
      setConversationsLoading(false);
    }
  }, [userId]);
  
  // Fetch messages for a specific user
  const fetchMessages = useCallback(async (otherUserId: string) => {
    if (!userId || !otherUserId) return;
    
    try {
      setMessagesLoading(true);
      
      // Fetch messages between the two users
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Process messages
      const processedMessages = (data || []).map((msg) => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.content,
        timestamp: msg.created_at,
        read: msg.read
      }));
      
      setMessages(processedMessages);
      
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', userId)
        .eq('sender_id', otherUserId)
        .eq('read', false);
        
      // Update current conversation
      const currentConv = conversations.find(c => c.userId === otherUserId);
      if (currentConv) {
        setCurrentConversation({
          ...currentConv,
          unreadCount: 0
        });
        
        // Update conversations list
        setConversations(prevConvs => 
          prevConvs.map(c => 
            c.userId === otherUserId 
              ? { ...c, unreadCount: 0 } 
              : c
          )
        );
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
    } finally {
      setMessagesLoading(false);
    }
  }, [userId, conversations]);
  
  // Send message
  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!userId || !currentConversation) return false;
    
    try {
      setMessageLoading(true);
      
      const receiverId = currentConversation.userId;
      const now = new Date().toISOString();
      
      // Insert new message
      const { data: newMessage, error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: receiverId,
          content,
          created_at: now,
          read: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update conversation
      await supabase
        .from('conversations')
        .upsert({
          sender_id: userId,
          receiver_id: receiverId,
          updated_at: now,
          last_message: content
        });
      
      // Add message to local state
      const message: Message = {
        id: newMessage.id,
        senderId: userId,
        receiverId,
        content,
        timestamp: now,
        read: false
      };
      
      setMessages(prev => [...prev, message]);
      
      // Update current conversation
      setCurrentConversation(prev => ({
        ...prev!,
        lastMessage: message,
        lastMessageTime: now
      }));
      
      // Update conversations list
      setConversations(prevConvs =>
        prevConvs.map(c => 
          c.userId === receiverId
            ? { 
                ...c, 
                lastMessage: message,
                lastMessageTime: now
              }
            : c
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      return false;
    } finally {
      setMessageLoading(false);
    }
  }, [userId, currentConversation]);
  
  // Select conversation
  const selectConversation = useCallback((otherUserId: string) => {
    const conversation = conversations.find(c => c.userId === otherUserId);
    if (conversation) {
      setCurrentConversation(conversation);
      fetchMessages(otherUserId);
    }
  }, [conversations, fetchMessages]);
  
  // Mark message as read
  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, read: true }
            : msg
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError(err as Error);
    }
  }, []);
  
  // Refresh messages
  const refreshMessages = useCallback(async () => {
    if (currentConversation) {
      await fetchMessages(currentConversation.userId);
    }
  }, [currentConversation, fetchMessages]);
  
  // Refresh conversations
  const refreshConversations = useCallback(async () => {
    await fetchConversations();
  }, [fetchConversations]);
  
  return {
    conversations,
    currentConversation: currentConversation || ({} as Conversation),
    messages,
    users,
    loading,
    messageLoading,
    error,
    sendMessage,
    selectConversation,
    markAsRead,
    refreshMessages,
    refreshConversations,
    fetchMessages,
    fetchConversations,
    conversationsLoading,
    messagesLoading
  };
};

export default useMessaging;
