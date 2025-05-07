
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

export const useMessaging = (currentUser: UserProfile | null) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  
  // Fetch all conversations for the current user
  const fetchConversations = async () => {
    if (!currentUser) return [];
    
    setConversationsLoading(true);
    try {
      // Get all messages where the expert is either the sender or receiver
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*, sender:sender_id(name, profile_picture), receiver:receiver_id(name, profile_picture)')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });
      
      if (messagesError) throw messagesError;
      
      // Group by conversation (unique users)
      const conversationMap = new Map();
      
      messages?.forEach((message: any) => {
        const otherUserId = message.sender_id === currentUser.id ? message.receiver_id : message.sender_id;
        const otherUser = message.sender_id === currentUser.id ? message.receiver : message.sender;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            userId: otherUserId,
            userName: otherUser?.name || 'User',
            userAvatar: otherUser?.profile_picture,
            lastMessage: message.content,
            lastMessageTime: message.created_at,
            unreadCount: message.receiver_id === currentUser.id && !message.read ? 1 : 0
          });
        } else if (new Date(message.created_at) > new Date(conversationMap.get(otherUserId).lastMessageTime)) {
          // Update last message if this one is newer
          const conversation = conversationMap.get(otherUserId);
          conversation.lastMessage = message.content;
          conversation.lastMessageTime = message.created_at;
          if (message.receiver_id === currentUser.id && !message.read) {
            conversation.unreadCount += 1;
          }
        } else if (message.receiver_id === currentUser.id && !message.read) {
          // Count other unread messages
          conversationMap.get(otherUserId).unreadCount += 1;
        }
      });
      
      // Convert map to array and sort by last message time
      const sortedConversations = Array.from(conversationMap.values())
        .sort((a: any, b: any) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
      
      setConversations(sortedConversations);
      return sortedConversations;
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      toast.error('Failed to load conversations');
      return [];
    } finally {
      setConversationsLoading(false);
    }
  };
  
  // Fetch messages for a specific conversation
  const fetchMessages = async (userId: string) => {
    if (!currentUser || !userId) return [];
    
    setMessagesLoading(true);
    try {
      // Get all messages between the expert and the selected user
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
      setActiveConversation(userId);
      
      // Mark messages as read
      const unreadMessages = data?.filter((msg: any) => 
        msg.receiver_id === currentUser.id && !msg.read
      );
      
      if (unreadMessages?.length) {
        await Promise.all(
          unreadMessages.map((msg: any) => 
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', msg.id)
          )
        );
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load messages');
      return [];
    } finally {
      setMessagesLoading(false);
    }
  };
  
  // Send a message
  const sendMessage = async (receiverId: string, content: string) => {
    if (!currentUser || !receiverId || !content.trim()) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content: content.trim(),
          read: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setMessages(prev => [...prev, data]);
      
      return data;
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser) return;
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${currentUser.id}`
      }, () => {
        // Refresh conversations when a new message arrives
        fetchConversations();
        
        // If we have an active conversation, also refresh messages
        if (activeConversation) {
          fetchMessages(activeConversation);
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser, activeConversation]);
  
  return {
    conversations,
    messages,
    loading,
    conversationsLoading,
    messagesLoading,
    activeConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setActiveConversation
  };
};

export default useMessaging;
