
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Message } from '@/types/appointments';
import { MessagingUser } from './types';

export function useMessages(currentUser: MessagingUser) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch messages for a specific conversation
   */
  const fetchMessages = useCallback(async (partnerId: string) => {
    if (!currentUser || !currentUser.id) return [];
    
    try {
      setMessagesLoading(true);
      setError(null);
      
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });
      
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        toast.error('Failed to load messages');
        setError(messagesError.message);
        return [];
      }
      
      // Mark received messages as read
      const unreadMessages = messages?.filter(msg => 
        msg.sender_id === partnerId && 
        msg.receiver_id === currentUser.id && 
        !msg.read
      ) || [];
      
      if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map(msg => msg.id);
        const { error: updateError } = await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadIds);
        
        if (updateError) {
          console.error('Error marking messages as read:', updateError);
        }
      }
      
      setMessages(messages as Message[] || []);
      return messages as Message[] || [];
    } catch (error: any) {
      console.error('Error in fetchMessages:', error);
      setError(error.message);
      return [];
    } finally {
      setMessagesLoading(false);
    }
  }, [currentUser]);
  
  return {
    messages,
    messagesLoading,
    fetchMessages,
    setMessages,
    error
  };
}
