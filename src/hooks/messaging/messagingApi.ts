
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Message } from '@/types/appointments';
import { MessagingUser, MessagingRepository } from './types';

// Implementation of the MessagingRepository interface for Supabase
class SupabaseMessagingRepository implements MessagingRepository {
  /**
   * Fetch messages for a conversation between two users
   */
  async fetchMessages(userId: string, partnerId: string): Promise<Message[]> {
    try {
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        toast.error('Failed to load messages');
        return [];
      }
      
      // Mark received messages as read
      const unreadMessages = messages?.filter(msg => 
        msg.sender_id === partnerId && 
        msg.receiver_id === userId && 
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
      
      return messages as Message[] || [];
    } catch (error: any) {
      console.error('Error in fetchMessages:', error);
      return [];
    }
  }

  /**
   * Fetch all conversations for a user
   */
  async fetchConversations(userId: string) {
    try {
      // First get all messages where the user is either sender or receiver
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (messageError) {
        console.error('Error fetching messages:', messageError);
        toast.error('Failed to load conversations');
        return [];
      }
      
      if (!messageData || messageData.length === 0) {
        return [];
      }
      
      // Extract unique user IDs from messages (excluding the current user)
      const userIds = new Set<string>();
      messageData.forEach(msg => {
        if (msg.sender_id === userId) {
          userIds.add(msg.receiver_id);
        } else {
          userIds.add(msg.sender_id);
        }
      });
      
      // Get user details for all conversation partners
      const userIdsArray = Array.from(userIds);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, profile_picture')
        .in('id', userIdsArray);
      
      if (userError) {
        console.error('Error fetching user details:', userError);
      }
      
      // Create a map of user IDs to user details for easier access
      const userMap = new Map();
      (userData || []).forEach(user => {
        userMap.set(user.id, user);
      });
      
      // Group messages by conversation partner
      const conversationMap = new Map<string, any[]>();
      messageData.forEach(msg => {
        const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, []);
        }
        conversationMap.get(partnerId)?.push(msg);
      });
      
      // Create conversation objects
      const conversationsArray = [];
      conversationMap.forEach((messages, userId) => {
        // Sort messages by created_at in descending order
        messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        const lastMessage = messages[0];
        const unreadCount = messages.filter(msg => msg.sender_id !== userId && !msg.read).length;
        const user = userMap.get(userId);
        
        conversationsArray.push({
          userId,
          userName: user?.name || 'Unknown User',
          userAvatar: user?.profile_picture,
          lastMessage: lastMessage.content,
          lastMessageTime: lastMessage.created_at,
          unreadCount
        });
      });
      
      // Sort conversations by last message time
      conversationsArray.sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
      
      return conversationsArray;
    } catch (error: any) {
      console.error('Error in fetchConversations:', error);
      return [];
    }
  }

  /**
   * Send a message to another user
   */
  async sendMessage(
    senderId: string, 
    receiverId: string, 
    content: string
  ) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
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
  async markConversationAsRead(
    userId: string,
    partnerId: string
  ) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', partnerId)
        .eq('receiver_id', userId)
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
}

// Export a singleton instance of the repository
export const messagingRepository = new SupabaseMessagingRepository();

// Adapter functions for backward compatibility
export async function sendMessage(
  currentUser: MessagingUser, 
  receiverId: string, 
  content: string
): Promise<Message | null> {
  if (!currentUser || !currentUser.id) return null;
  return messagingRepository.sendMessage(currentUser.id, receiverId, content);
}

export async function markConversationAsRead(
  currentUser: MessagingUser,
  partnerId: string
): Promise<boolean> {
  if (!currentUser || !currentUser.id) return false;
  return messagingRepository.markConversationAsRead(currentUser.id, partnerId);
}
