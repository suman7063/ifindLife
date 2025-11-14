import { useState, useEffect, useCallback } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message, Conversation } from './messaging/types';

const useMessaging = () => {
  const { user, isAuthenticated } = useSimpleAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);

  // Get conversations for a user
  const getConversations = useCallback(async (userId: string): Promise<Conversation[]> => {
    if (!isAuthenticated || !user) return [];
    
    setLoading(true);
    try {
      // Get unique conversation partners (people user has messaged with)
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id, created_at')
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });
        
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id, created_at')
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false });
        
      if (sentError || receivedError) {
        console.error('Error fetching conversations:', sentError || receivedError);
        toast.error('Failed to load conversations');
        return [];
      }
      
      // Combine and find unique conversation partners
      const conversationPartners = new Map<string, { lastMessageDate: string }>();
      
      sentMessages?.forEach(msg => {
        if (!conversationPartners.has(msg.receiver_id)) {
          conversationPartners.set(msg.receiver_id, { 
            lastMessageDate: msg.created_at 
          });
        } else {
          const existing = conversationPartners.get(msg.receiver_id);
          if (existing && new Date(msg.created_at) > new Date(existing.lastMessageDate)) {
            existing.lastMessageDate = msg.created_at;
          }
        }
      });
      
      receivedMessages?.forEach(msg => {
        if (!conversationPartners.has(msg.sender_id)) {
          conversationPartners.set(msg.sender_id, { 
            lastMessageDate: msg.created_at 
          });
        } else {
          const existing = conversationPartners.get(msg.sender_id);
          if (existing && new Date(msg.created_at) > new Date(existing.lastMessageDate)) {
            existing.lastMessageDate = msg.created_at;
          }
        }
      });
      
      // Get user details for each conversation partner
      const conversationList: Conversation[] = [];
      
      for (const [partnerId, data] of conversationPartners.entries()) {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, profile_picture')
          .eq('id', partnerId)
          .single();
          
        if (!userError && userData) {
          conversationList.push({
            id: partnerId,
            participant_id: partnerId,
            participant_name: userData.name || 'Unknown User',
            name: userData.name || 'Unknown User',
            profilePicture: userData.profile_picture || '',
            last_message: '',
            lastMessage: '',
            last_message_time: data.lastMessageDate,
            lastMessageDate: data.lastMessageDate,
            unread_count: 0,
            unreadCount: 0
          });
        }
      }
      
      // Sort by most recent message
      conversationList.sort((a, b) => 
        new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
      );
      
      return conversationList;
    } catch (error) {
      console.error('Error in getConversations:', error);
      toast.error('An error occurred while loading conversations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Get messages for a specific conversation
  const getMessages = useCallback(async (userId: string, recipientId?: string): Promise<Message[]> => {
    if (!recipientId) recipientId = selectedConversation || '';
    if (!isAuthenticated || !user) return [];
    
    setLoading(true);
    try {
      // Get messages where current user is either sender or receiver
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .or(`sender_id.eq.${recipientId},receiver_id.eq.${recipientId}`)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
        return [];
      }
      
      // Filter to only include messages between these two users
      const filteredMessages = data.filter(msg =>
        (msg.sender_id === userId && msg.receiver_id === recipientId) ||
        (msg.sender_id === recipientId && msg.receiver_id === userId)
      );
      
      // Transform to our Message type
      const formattedMessages: Message[] = filteredMessages.map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        content: msg.content,
        created_at: msg.created_at,
        updated_at: msg.updated_at || msg.created_at,
        read: msg.read,
        timestamp: new Date(msg.created_at),
        isMine: msg.sender_id === userId
      }));
      
      setMessages(formattedMessages);
      setSelectedConversation(recipientId);
      
      // Mark received messages as read
      const unreadMessageIds = filteredMessages
        .filter(msg => msg.receiver_id === userId && !msg.read)
        .map(msg => msg.id);
        
      if (unreadMessageIds.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessageIds);
      }
      
      return formattedMessages;
    } catch (error) {
      console.error('Error in getMessages:', error);
      toast.error('An error occurred while loading messages');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, selectedConversation]);

  // Fetch conversations (alias for getConversations for backward compatibility)
  const fetchConversations = useCallback(async () => {
    if (user?.id) {
      await getConversations(user.id);
    }
  }, [user, getConversations]);

  // Fetch messages (alias for getMessages for backward compatibility)
  const fetchMessages = useCallback(async (recipientId: string) => {
    if (user?.id) {
      await getMessages(user.id, recipientId);
    }
  }, [user, getMessages]);

  // Send a message
  const sendMessage = useCallback(async (recipientId: string, content: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to send messages');
      return false;
    }
    
    if (!content.trim()) {
      toast.error('Message cannot be empty');
      return false;
    }
    
    setSending(true);
    try {
      const newMessage = {
        sender_id: user.id,
        receiver_id: recipientId,
        content: content.trim(),
        read: false,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();
        
      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return false;
      }
      
      // Add the new message to the state
      const formattedMessage: Message = {
        id: data.id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at,
        read: data.read,
        timestamp: new Date(data.created_at),
        isMine: true
      };
      
      setMessages(prev => [...prev, formattedMessage]);
      
      // Update the conversation list
      await fetchConversations();
      
      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast.error('An error occurred while sending the message');
      return false;
    } finally {
      setSending(false);
    }
  }, [isAuthenticated, user, fetchConversations]);

  // Subscribe to new messages
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const subscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, async (payload) => {
        // A new message has arrived for the user
        const newMessage = payload.new;
        
        // Add to messages if from current conversation
        if (selectedConversation === newMessage.sender_id) {
          const formattedMessage: Message = {
            id: newMessage.id,
            sender_id: newMessage.sender_id,
            receiver_id: newMessage.receiver_id,
            content: newMessage.content,
            created_at: newMessage.created_at,
            updated_at: newMessage.updated_at,
            read: newMessage.read,
            timestamp: new Date(newMessage.created_at),
            isMine: false
          };
          
          setMessages(prev => [...prev, formattedMessage]);
          
          // Mark as read since user is currently viewing this conversation
          await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', newMessage.id);
        }
        
        // Refresh conversations to update order/unread status
        fetchConversations();
        
        // Notify user if not in current conversation
        if (selectedConversation !== newMessage.sender_id) {
          // Get sender name
          const { data: senderData } = await supabase
            .from('users')
            .select('name')
            .eq('id', newMessage.sender_id)
            .single();
            
          const senderName = senderData?.name || 'Someone';
          
          toast(`New message from ${senderName}`, {
            description: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : ''),
            action: {
              label: 'View',
              onClick: () => fetchMessages(newMessage.sender_id),
            },
          });
        }
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, user, selectedConversation, fetchConversations, fetchMessages]);

  // Load conversations initially
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConversations();
    }
  }, [isAuthenticated, user, fetchConversations]);

  return {
    messages,
    conversations,
    selectedConversation,
    loading,
    sending,
    fetchMessages,
    sendMessage,
    fetchConversations,
    getConversations,
    getMessages
  };
};

export default useMessaging;
