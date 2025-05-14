
import { supabase } from '@/lib/supabase';
import { Message, MessagingUser } from '@/types/database/unified';
import { Conversation } from './types';

class MessagingRepository {
  /**
   * Get messages between two users
   */
  async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${senderId},receiver_id.eq.${senderId}`)
        .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      
      return data as Message[];
    } catch (error) {
      console.error('Repository error in getMessages:', error);
      return [];
    }
  }
  
  /**
   * Send a message from one user to another
   */
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: senderId,
            receiver_id: receiverId,
            content
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error sending message:', error);
        return null;
      }
      
      return data as Message;
    } catch (error) {
      console.error('Repository error in sendMessage:', error);
      return null;
    }
  }
  
  /**
   * Mark a message as read
   */
  async markAsRead(messageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
      
      return !error;
    } catch (error) {
      console.error('Repository error in markAsRead:', error);
      return false;
    }
  }
  
  /**
   * Get the conversations for a user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      // This is a complex query that should be implemented as a PostgreSQL function
      // For now, we'll simulate it with a simplified version
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }
      
      // Process the data to create conversations
      const conversations = this.processConversations(data as Message[], userId);
      return conversations;
    } catch (error) {
      console.error('Repository error in getConversations:', error);
      return [];
    }
  }
  
  /**
   * Process messages to create conversations
   */
  private processConversations(messages: Message[], currentUserId: string): Conversation[] {
    // This is a simplified version
    const conversationMap = new Map<string, Conversation>();
    
    for (const message of messages) {
      const otherUserId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id;
      
      if (!conversationMap.has(otherUserId)) {
        // Fetch user details (this would be better done in a JOIN)
        conversationMap.set(otherUserId, {
          id: otherUserId,
          userId: otherUserId,
          userName: 'User', // This should be fetched from the user profile
          userAvatar: undefined,
          lastMessage: {
            content: message.content,
            timestamp: message.created_at || '',
            isRead: !!message.read,
            senderId: message.sender_id
          },
          lastMessageTime: message.created_at || '',
          unreadCount: message.sender_id !== currentUserId && !message.read ? 1 : 0
        });
      }
    }
    
    return Array.from(conversationMap.values());
  }
  
  /**
   * Search for users
   */
  async searchUsers(query: string): Promise<MessagingUser[]> {
    try {
      // Try to get from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, profile_picture')
        .ilike('name', `%${query}%`)
        .limit(10);
      
      if (!userError && userData) {
        return userData.map(user => ({
          id: user.id,
          name: user.name || 'User',
          avatar: user.profile_picture
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Repository error in searchUsers:', error);
      return [];
    }
  }
}

export const messagingRepository = new MessagingRepository();
