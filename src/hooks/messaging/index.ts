
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from './types';

const useMessaging = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (receiverId: string, content: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          receiver_id: receiverId,
          content,
          sender_id: '', // This should be set from auth context
          read: false
        }]);

      if (error) throw error;
      
      // Refresh messages after sending
      // fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading
  };
};

export default useMessaging;
