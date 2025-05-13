
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const useMessaging = (currentUser: UserProfile | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false); // General loading state for backward compatibility

  // Load conversations list
  const loadConversations = useCallback(async () => {
    if (!currentUser?.id) return;
    
    setIsLoadingConversations(true);
    setIsLoading(true); // For backward compatibility
    
    try {
      // This is a simplified implementation - in a real app, you'd fetch actual conversation data
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, content, created_at, read')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Process messages into conversations
      const conversationsMap = new Map<string, Conversation>();
      
      data?.forEach(message => {
        const otherUserId = message.sender_id === currentUser.id ? message.receiver_id : message.sender_id;
        
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            userName: `User ${otherUserId.substring(0, 5)}`, // Placeholder name
            lastMessage: message.content,
            lastMessageTime: message.created_at,
            unreadCount: message.read === false && message.sender_id !== currentUser.id ? 1 : 0
          });
        } else if (!message.read && message.sender_id !== currentUser.id) {
          const conversation = conversationsMap.get(otherUserId)!;
          conversationsMap.set(otherUserId, {
            ...conversation,
            unreadCount: conversation.unreadCount + 1
          });
        }
      });
      
      setConversations(Array.from(conversationsMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
      setIsLoading(false); // For backward compatibility
    }
  }, [currentUser]);

  // For backward compatibility
  const fetchConversations = loadConversations;

  // Load messages for a specific conversation
  const loadMessages = useCallback(async (userId: string) => {
    if (!currentUser?.id) return;
    
    setIsLoadingMessages(true);
    setIsLoading(true); // For backward compatibility
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', userId)
        .eq('receiver_id', currentUser.id)
        .eq('read', false);
        
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
      setIsLoading(false); // For backward compatibility
    }
  }, [currentUser]);

  // For backward compatibility
  const fetchMessages = loadMessages;

  // Send a new message
  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!currentUser?.id) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content,
          read: false
        });
        
      if (error) throw error;
      
      // Refresh messages
      loadMessages(receiverId);
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  }, [currentUser, loadMessages]);

  // Select a conversation
  const selectConversation = useCallback(async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.userId);
    return conversation;
  }, [loadMessages]);

  return { 
    messages, 
    conversations, 
    isLoadingMessages, 
    isLoadingConversations,
    loadMessages,
    loadConversations,
    fetchMessages, // For backward compatibility
    fetchConversations, // For backward compatibility
    sendMessage,
    selectedConversation,
    selectConversation,
    isLoading, // For backward compatibility
    messagesLoading: isLoadingMessages, // For backward compatibility
    conversationsLoading: isLoadingConversations // For backward compatibility
  };
};

// Export both as a named export and default for backward compatibility
export default useMessaging;
