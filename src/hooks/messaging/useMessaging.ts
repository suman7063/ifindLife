
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types/database/unified';
import { useAuth } from '@/contexts/auth/AuthContext';

export interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export const useMessaging = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Get all conversations for the current user
  const getConversations = useCallback(async (userId: string): Promise<Conversation[]> => {
    try {
      setLoading(true);
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
            .eq('auth_id', otherPartyId)
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

      const sortedConversations = Array.from(conversationsMap.values())
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setConversations(sortedConversations);
      return sortedConversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get messages for a specific conversation
  const getMessages = useCallback(async (userId: string, recipientId?: string): Promise<Message[]> => {
    if (!recipientId) recipientId = selectedConversation || '';
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Mark messages as read
      const unreadMessages = data?.filter(msg => 
        msg.receiver_id === userId && !msg.read
      ) || [];
      
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessages.map(msg => msg.id));
      }

      // Add 'isMine' property for UI convenience
      const formattedMessages = (data || []).map(message => ({
        ...message,
        isMine: message.sender_id === userId
      }));
      
      setMessages(formattedMessages);
      return formattedMessages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [selectedConversation]);

  // Send a message
  const sendMessage = useCallback(async (recipientId: string, content: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: recipientId,
          content,
          read: false
        });

      if (error) {
        throw error;
      }

      // Refresh messages
      await getMessages(user.id, recipientId);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getMessages]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase.channel('public:messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}` 
        }, 
        async (payload) => {
          console.log('New message received:', payload);
          
          // If from current conversation, refresh messages
          if (selectedConversation === payload.new.sender_id) {
            await getMessages(user.id, selectedConversation);
          }
          
          // Always refresh conversations list to update unread counts
          await getConversations(user.id);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation, getMessages, getConversations]);

  // Mark a conversation as read
  const markConversationAsRead = useCallback(async (conversationPartnerId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', conversationPartnerId)
        .eq('receiver_id', user.id)
        .eq('read', false);

      if (error) {
        throw error;
      }

      // Refresh conversations to update unread counts
      await getConversations(user.id);
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getConversations]);

  // Initialize messages
  const fetchMessages = useCallback((recipientId: string) => {
    if (user?.id) {
      setSelectedConversation(recipientId);
      getMessages(user.id, recipientId);
    }
  }, [user, getMessages]);

  // Initialize conversations
  const fetchConversations = useCallback(() => {
    if (user?.id) {
      getConversations(user.id);
    }
  }, [user, getConversations]);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      getConversations(user.id);
    }
  }, [user, getConversations]);

  return {
    messages,
    conversations,
    loading,
    selectedConversation,
    sendMessage,
    getMessages,
    getConversations,
    markConversationAsRead,
    fetchMessages,
    fetchConversations,
    setSelectedConversation
  };
};

export default useMessaging;
