
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_name?: string;
  receiver_name?: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
  otherUserId: string;
  profilePicture?: string;
}

const useMessaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch conversations for the current user
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get all messages involving the current user
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }
      
      // Process messages to create conversation list
      const conversationMap = new Map<string, Conversation>();
      
      for (const message of data || []) {
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        
        if (!conversationMap.has(otherUserId)) {
          // Fetch user profile for the conversation
          const { data: userData } = await supabase
            .from('users')
            .select('name, profile_picture')
            .eq('id', otherUserId)
            .single();
            
          conversationMap.set(otherUserId, {
            id: otherUserId,
            name: userData?.name || 'Unknown User',
            lastMessage: message.content,
            lastMessageDate: message.created_at,
            unreadCount: message.receiver_id === user.id && !message.read ? 1 : 0,
            otherUserId,
            profilePicture: userData?.profile_picture
          });
        } else {
          // Update unread count
          if (message.receiver_id === user.id && !message.read) {
            const conversation = conversationMap.get(otherUserId);
            if (conversation) {
              conversation.unreadCount += 1;
            }
          }
        }
      }
      
      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error in fetchConversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (otherUserId: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get messages between current user and the other user
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      setMessages(data || []);
      setCurrentConversation(otherUserId);
      
      // Mark unread messages as read
      const unreadMessages = data?.filter(msg => 
        msg.receiver_id === user.id && !msg.read
      );
      
      if (unreadMessages && unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessages.map(msg => msg.id));
          
        // Refresh conversations to update unread counts
        fetchConversations();
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchConversations]);

  // Send a message
  const sendMessage = useCallback(async (receiverId: string, content: string): Promise<boolean> => {
    if (!user?.id || !content.trim()) return false;
    
    try {
      setSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          read: false
        });
        
      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return false;
      }
      
      // Refresh messages and conversations
      fetchMessages(receiverId);
      fetchConversations();
      
      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast.error('Failed to send message');
      return false;
    } finally {
      setSending(false);
    }
  }, [user?.id, fetchMessages, fetchConversations]);

  // Initialize conversations when user changes
  useEffect(() => {
    if (user?.id) {
      fetchConversations();
    }
  }, [user?.id, fetchConversations]);

  return {
    conversations,
    messages,
    currentConversation,
    loading,
    sending,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setCurrentConversation
  };
};

export default useMessaging;
export { useMessaging };
