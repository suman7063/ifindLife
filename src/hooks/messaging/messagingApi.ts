
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Message } from '@/types/appointments';
import { MessagingUser } from './types';

/**
 * Send a message to another user
 */
export async function sendMessage(
  currentUser: MessagingUser, 
  receiverId: string, 
  content: string
): Promise<Message | null> {
  if (!currentUser) return null;
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        receiver_id: receiverId,
        content,
        read: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return null;
    }
    
    return data as Message;
  } catch (error: any) {
    console.error('Error in sendMessage:', error);
    return null;
  }
}

/**
 * Mark all messages in a conversation as read
 */
export async function markConversationAsRead(
  currentUser: MessagingUser,
  partnerId: string
): Promise<boolean> {
  if (!currentUser) return false;
  
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', partnerId)
      .eq('receiver_id', currentUser.id)
      .eq('read', false);
    
    if (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markConversationAsRead:', error);
    return false;
  }
}
