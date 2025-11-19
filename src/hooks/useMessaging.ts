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

      // Get participant information for each conversation
      // Note: The other participant could be an expert OR a user
      const participantIds = Array.from(conversationsMap.keys());
      if (participantIds.length > 0) {
        // Try to find experts by auth_id
        const { data: expertsByAuthId } = await supabase
          .from('expert_accounts')
          .select('auth_id, name, profile_picture')
          .in('auth_id', participantIds);
        
        // Also check users table (in case the other participant is a user, not an expert)
        const { data: usersData } = await supabase
          .from('users')
          .select('id, name, profile_picture')
          .in('id', participantIds);

        // Use experts found by auth_id
        const allExperts = expertsByAuthId || [];
        const uniqueExperts = Array.from(
          new Map(allExperts.map(e => [e.id, e])).values()
        );

        // Get expert IDs for presence lookup
        const expertIdsForPresence = uniqueExperts.map(e => e.id);
        const { data: presenceData } = expertIdsForPresence.length > 0 ? await supabase
          .from('expert_presence')
          .select('*')
          .in('expert_id', expertIdsForPresence) : { data: null };

        // Build conversations with participant info
        const conversationsList: Conversation[] = [];

        conversationsMap.forEach((conv, participantId) => {
          // First try to find as expert
          const expertInfo = uniqueExperts.find(
            expert => expert.auth_id === participantId
          );
          
          // If not found as expert, try as user
          const userInfo = !expertInfo ? usersData?.find(user => user.id === participantId) : null;

          if (expertInfo) {
            // This is an expert conversation
            // Use auth_id for expert_id to match messages (messages use auth.users.id)
            const expertAuthId = expertInfo.auth_id;
            const presence = presenceData?.find(
              p => p.expert_id === expertInfo.auth_id
            );
            
            conversationsList.push({
              expert_id: expertAuthId, // Use auth_id to match messages table
              expert_name: expertInfo.name,
              expert_image: expertInfo.profile_picture,
              last_message: conv.messages[0], // Most recent message
              unread_count: conv.unread_count,
              presence: presence ? {
                ...presence,
                status: presence.status as 'online' | 'away' | 'offline'
              } : undefined
            });
          } else if (userInfo) {
            // This is a user conversation (shouldn't happen for user messaging, but handle it)
            // For user-to-user messaging, we'd need a different structure
            // For now, skip user conversations in expert messaging context
            console.warn('Found user conversation in expert context, skipping:', participantId);
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

  // Mark messages as read for a conversation
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
  }, [userId, markMessagesAsRead]);

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

  // Start a new conversation with an expert
  const startConversation = useCallback(async (expertId: string, initialMessage?: string) => {
    if (!userId) return;

    try {
      // Get expert info - try both id and auth_id
      let expertData = null;
      let expertError = null;
      let byId = null;
      let errById = null;
      let byAuthId = null;
      let errByAuthId = null;
      
      // Try by auth_id (id column no longer exists)
      const { data: byAuthIdResult, error: errByAuthIdResult } = await supabase
        .from('expert_accounts')
        .select('auth_id, name, profile_picture')
        .eq('auth_id', expertId)
        .maybeSingle();
      byAuthId = byAuthIdResult;
      errByAuthId = errByAuthIdResult;

      if (!errByAuthId && byAuthId) {
        expertData = byAuthId;
      } else {
        // If expert not found, it might be a user ID - check users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, profile_picture')
          .eq('id', expertId)
          .maybeSingle();
        
        if (!userError && userData) {
          // This is actually a user, not an expert - this shouldn't happen in normal flow
          console.warn('Expert ID points to a user instead:', expertId);
          expertError = new Error('Invalid expert ID');
        } else {
          expertError = errByAuthId;
        }
      }

      if (expertError || !expertData) {
        console.error('Expert not found:', {
          expertId,
          error: expertError,
          byAuthIdError: errByAuthId,
          byAuthIdData: byAuthId
        });
        // Don't show error toast - just log it, as the expert might not exist yet
        // or there might be an RLS issue
        console.warn('Could not find expert with ID:', expertId);
        return null;
      }

      // Use the expert's auth_id for the conversation (since messages use auth_id)
      // This ensures consistency - messages use auth.users.id, so conversations should too
      const conversationExpertId = expertData.auth_id;
      console.log('Creating conversation with expert:', {
        expertId,
        expertDataAuthId: expertData.auth_id,
        conversationExpertId,
        expertName: expertData.name
      });

      // Add to conversations if not already there
      // Check by auth_id to handle any existing conversations
      const existingConv = conversations.find(
        c => c.expert_id === conversationExpertId || 
             c.expert_id === expertId ||
             (expertData.auth_id && c.expert_id === expertData.auth_id)
      );
      
      if (!existingConv) {
        const newConversation: Conversation = {
          expert_id: conversationExpertId, // Use auth_id for consistency with messages
          expert_name: expertData.name,
          expert_image: expertData.profile_picture,
          unread_count: 0
        };

        console.log('Adding new conversation:', newConversation);
        setConversations(prev => [newConversation, ...prev]);
      } else {
        console.log('Conversation already exists:', existingConv);
      }

      // Send initial message if provided
      if (initialMessage) {
        // Use the expert's auth_id for sending messages (messages table uses auth.users.id)
        const messageExpertId = expertData.auth_id || conversationExpertId;
        await sendMessage(messageExpertId, initialMessage);
      }

      // Fetch messages for this conversation - use auth_id (messages use auth.users.id)
      const messageExpertId = expertData.auth_id || conversationExpertId;
      await fetchMessages(messageExpertId);
      
      // Refresh conversations list to ensure the new conversation appears
      await fetchConversations();
      
      // Return the expert ID (auth_id) so the caller can select it
      console.log('Returning conversationExpertId for selection:', conversationExpertId);
      return conversationExpertId;

    } catch (err) {
      console.error('Error starting conversation:', err);
      toast.error('Failed to start conversation');
    }
  }, [userId, conversations, sendMessage, fetchMessages, fetchConversations]);

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