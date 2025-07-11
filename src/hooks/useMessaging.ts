import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpertPresence {
  id: string;
  expert_id: string;
  status: 'online' | 'away' | 'offline';
  last_activity: string;
  auto_away_enabled: boolean;
  away_timeout_minutes: number;
}

export interface Conversation {
  expert_id: string;
  expert_name: string;
  expert_image?: string;
  last_message?: Message;
  unread_count: number;
  presence?: ExpertPresence;
}

export const useMessaging = (userId?: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [expertId: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations list with last message and unread count
  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Get all conversations for this user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          read,
          created_at,
          updated_at
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Group messages by expert (the other participant)
      const conversationsMap = new Map<string, {
        expert_id: string;
        messages: Message[];
        unread_count: number;
      }>();

      messagesData?.forEach((message) => {
        const expertId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        
        if (!conversationsMap.has(expertId)) {
          conversationsMap.set(expertId, {
            expert_id: expertId,
            messages: [],
            unread_count: 0
          });
        }

        const conv = conversationsMap.get(expertId)!;
        conv.messages.push(message);

        // Count unread messages (messages sent to this user that are unread)
        if (message.receiver_id === userId && !message.read) {
          conv.unread_count++;
        }
      });

      // Get expert information for each conversation
      const expertIds = Array.from(conversationsMap.keys());
      if (expertIds.length > 0) {
        const { data: expertsData, error: expertsError } = await supabase
          .from('expert_accounts')
          .select('id, name, profile_picture')
          .in('id', expertIds);

        if (expertsError) throw expertsError;

        // Get expert presence information
        const { data: presenceData } = await supabase
          .from('expert_presence')
          .select('*')
          .in('expert_id', expertIds);

        // Build conversations with expert info
        const conversationsList: Conversation[] = [];

        conversationsMap.forEach((conv, expertId) => {
          const expertInfo = expertsData?.find(expert => expert.id === expertId);
          const presence = presenceData?.find(p => p.expert_id === expertId);

          if (expertInfo) {
            conversationsList.push({
              expert_id: expertId,
              expert_name: expertInfo.name,
              expert_image: expertInfo.profile_picture,
              last_message: conv.messages[0], // Most recent message
              unread_count: conv.unread_count,
              presence: presence ? {
                ...presence,
                status: presence.status as 'online' | 'away' | 'offline'
              } : undefined
            });
          }
        });

        // Sort by last message time
        conversationsList.sort((a, b) => {
          const aTime = a.last_message?.created_at || '';
          const bTime = b.last_message?.created_at || '';
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });

        setConversations(conversationsList);
      }

    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch messages for a specific expert
  const fetchMessages = useCallback(async (expertId: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${expertId}),and(sender_id.eq.${expertId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(prev => ({
        ...prev,
        [expertId]: data || []
      }));

      // Mark messages as read
      await markMessagesAsRead(expertId);

    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load messages');
    }
  }, [userId]);

  // Send a new message
  const sendMessage = useCallback(async (expertId: string, content: string) => {
    if (!userId || !content.trim()) return false;

    try {
      setSendingMessage(true);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: expertId,
          content: content.trim(),
          read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Add message to local state
      setMessages(prev => ({
        ...prev,
        [expertId]: [...(prev[expertId] || []), data]
      }));

      // Update conversations list
      await fetchConversations();

      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return false;
    } finally {
      setSendingMessage(false);
    }
  }, [userId, fetchConversations]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (expertId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', expertId)
        .eq('receiver_id', userId)
        .eq('read', false);

      if (error) throw error;

      // Update local state
      setMessages(prev => ({
        ...prev,
        [expertId]: prev[expertId]?.map(msg => 
          msg.sender_id === expertId && msg.receiver_id === userId 
            ? { ...msg, read: true }
            : msg
        ) || []
      }));

      // Update conversations unread count
      setConversations(prev =>
        prev.map(conv =>
          conv.expert_id === expertId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );

    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [userId]);

  // Start a new conversation with an expert
  const startConversation = useCallback(async (expertId: string, initialMessage?: string) => {
    if (!userId) return;

    try {
      // Get expert info
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('name, profile_picture')
        .eq('id', expertId)
        .single();

      if (expertError) throw expertError;

      // Add to conversations if not already there
      const existingConv = conversations.find(c => c.expert_id === expertId);
      if (!existingConv) {
        const newConversation: Conversation = {
          expert_id: expertId,
          expert_name: expertData.name,
          expert_image: expertData.profile_picture,
          unread_count: 0
        };

        setConversations(prev => [newConversation, ...prev]);
      }

      // Send initial message if provided
      if (initialMessage) {
        await sendMessage(expertId, initialMessage);
      }

      // Fetch messages for this conversation
      await fetchMessages(expertId);

    } catch (err) {
      console.error('Error starting conversation:', err);
      toast.error('Failed to start conversation');
    }
  }, [userId, conversations, sendMessage, fetchMessages]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    const messageSubscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Add to messages state
          setMessages(prev => ({
            ...prev,
            [newMessage.sender_id]: [...(prev[newMessage.sender_id] || []), newMessage]
          }));

          // Update conversations
          fetchConversations();

          // Show notification
          toast.info('New message received');
        }
      )
      .subscribe();

    const presenceSubscription = supabase
      .channel('expert_presence')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'expert_presence'
        },
        (payload) => {
          const updatedPresence = {
            ...payload.new,
            status: payload.new.status as 'online' | 'away' | 'offline'
          } as ExpertPresence;
          
          // Update presence in conversations
          setConversations(prev =>
            prev.map(conv =>
              conv.expert_id === updatedPresence.expert_id
                ? { ...conv, presence: updatedPresence }
                : conv
            )
          );
        }
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
      presenceSubscription.unsubscribe();
    };
  }, [userId, fetchConversations]);

  // Initial load
  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId, fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    sendingMessage,
    error,
    sendMessage,
    fetchMessages,
    markMessagesAsRead,
    startConversation,
    refetch: fetchConversations
  };
};