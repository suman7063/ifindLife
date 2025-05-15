
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Conversation, Message, MessagingHook } from './types';
import { useAuth } from '@/contexts/auth';

export const useMessaging = (): MessagingHook => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<string | undefined>(undefined);
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Fetch users this user has messaged with
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
      
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });
      
      if (sentError || receivedError) {
        console.error('Error fetching conversations:', sentError || receivedError);
        return;
      }
      
      // Get unique user IDs
      const senderIds = receivedMessages?.map(msg => msg.sender_id) || [];
      const receiverIds = sentMessages?.map(msg => msg.receiver_id) || [];
      const uniqueUserIds = [...new Set([...senderIds, ...receiverIds])];
      
      if (uniqueUserIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }
      
      // Fetch user profiles for these IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, profile_picture')
        .in('id', uniqueUserIds);
      
      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        return;
      }
      
      // For each user, fetch the last message and unread count
      const conversationPromises = uniqueUserIds.map(async (userId) => {
        const profile = profiles?.find(p => p.id === userId);
        
        if (!profile) return null;
        
        // Get last message
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('content, created_at')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false })
          .limit(1);
        
        // Get unread count
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('sender_id', userId)
          .eq('receiver_id', user.id)
          .eq('read', false);
        
        return {
          id: userId,
          name: profile.name || 'User',
          profilePicture: profile.profile_picture,
          lastMessage: lastMessage?.[0]?.content,
          lastMessageDate: lastMessage?.[0]?.created_at,
          unreadCount: unreadCount || 0
        } as Conversation;
      });
      
      const conversationResults = await Promise.all(conversationPromises);
      setConversations(conversationResults.filter(Boolean) as Conversation[]);
    } catch (error) {
      console.error('Error in fetchConversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user?.id || !conversationId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      const formattedMessages = data.map(msg => ({
        ...msg,
        isMine: msg.sender_id === user.id,
        timestamp: new Date(msg.created_at)
      }));
      
      setMessages(formattedMessages);
      
      // Mark messages as read
      if (data.some(msg => !msg.read && msg.receiver_id === user.id)) {
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('receiver_id', user.id)
          .eq('sender_id', conversationId);
        
        // Update unread count in conversations
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, unreadCount: 0 } 
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!user?.id || !receiverId || !content.trim()) return false;

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
        return false;
      }
      
      // Refetch messages to include the new one
      await fetchMessages(receiverId);
      
      // Update conversation list
      fetchConversations();
      
      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return false;
    } finally {
      setSending(false);
    }
  }, [user?.id, fetchMessages, fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    sending,
    currentConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setCurrentConversation
  };
};

export default useMessaging;
