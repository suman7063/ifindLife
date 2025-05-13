import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Conversation } from './types';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ensureStringId } from '@/utils/idConverters';

interface UseConversationsProps {
  userId?: string | null;
}

const useConversations = ({ userId }: UseConversationsProps = {}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const currentUserId = userId || user?.id;

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (name, id, profile_picture),
          receiver:receiver_id (name, id, profile_picture)
        `)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
        return;
      }

      // Process messages to form conversations
      const processedConversations: { [key: string]: Conversation } = {};

      data.forEach(message => {
        const otherUserId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id;
        const conversationId = [currentUserId, otherUserId].sort().join('_');

        if (!processedConversations[conversationId]) {
          const sender = message.sender_id === currentUserId ? message.sender : message.receiver;
          const receiver = message.sender_id === currentUserId ? message.receiver : message.sender;

          processedConversations[conversationId] = {
            id: conversationId,
            user_id1: currentUserId,
            user_id2: otherUserId,
            createdAt: message.created_at,
            updatedAt: message.created_at,
            lastMessage: message.content,
            sender,
            receiver,
          };
        } else {
          processedConversations[conversationId].updatedAt = message.created_at;
          processedConversations[conversationId].lastMessage = message.content;
        }
      });

      // Convert the processed conversations object to an array
      const conversationsArray = Object.values(processedConversations);

      // Sort conversations by last message timestamp
      conversationsArray.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      setConversations(conversationsArray);
    } catch (error) {
      console.error("Unexpected error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, supabase]);

  useEffect(() => {
    fetchConversations();

    const channel = supabase.channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
        console.log('Change received!', payload)
        fetchConversations();
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchConversations, supabase]);

  return {
    conversations,
    loading,
    refetchConversations: fetchConversations,
  };
};

export default useConversations;
