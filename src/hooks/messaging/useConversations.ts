
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Conversation } from '@/types/supabase/tables';
import { UserProfile } from '@/types/supabase';
import { ensureStringId } from '@/utils/idConverters';

const useConversations = (userId: string | null, role: 'user' | 'expert' | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !role) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);

        const idColumn = role === 'user' ? 'user_id' : 'expert_id';
        const { data, error: fetchError } = await supabase
          .from('conversations')
          .select('*, users:user_id(*), experts:expert_id(*)')
          .eq(idColumn, userId)
          .order('updated_at', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedConversations: Conversation[] = data.map((conv: any) => ({
          id: conv.id.toString(),
          user_id: conv.user_id,
          expert_id: ensureStringId(conv.expert_id) || '',
          last_message: conv.last_message,
          updated_at: conv.updated_at,
          created_at: conv.created_at,
          unread_count: conv.unread_count || 0,
          user_name: conv.users?.name || 'Unknown User',
          expert_name: conv.experts?.name || 'Unknown Expert'
        }));

        // Sort by most recent
        formattedConversations.sort((a, b) => {
          if (!a.updated_at) return 1;
          if (!b.updated_at) return -1;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

        setConversations(formattedConversations);
      } catch (err: any) {
        console.error('Error fetching conversations:', err);
        setError(err.message || 'Failed to fetch conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId, role]);

  return { conversations, loading, error };
};

export default useConversations;
