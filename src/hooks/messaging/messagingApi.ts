
import { supabase } from '@/lib/supabase';
import { Message, Conversation, MessagingUser } from '@/types/database/unified';

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
          participants: [currentUserId, otherUserId],
          last_message: message.content,
          last_message_time: message.created_at,
          unread_count: message.sender_id !== currentUserId && !message.read ? 1 : 0,
          other_user: {
            id: otherUserId,
            name: 'User', // This should be fetched from the user profile
            profile_picture: undefined
          }
        });
      }
    }
    
    return Array.from(conversationMap.values());
  }
  
  /**
   * Get a user by ID for messaging purposes
   */
  async getUser(userId: string): Promise<MessagingUser | null> {
    try {
      // Try to get from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, profile_picture')
        .eq('id', userId)
        .single();
      
      if (!userError && userData) {
        return {
          id: userData.id,
          name: userData.name || 'User',
          profile_picture: userData.profile_picture,
          isOnline: false
        };
      }
      
      // Try to get from experts table
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('id, name, profile_picture')
        .eq('id', userId)
        .single();
      
      if (!expertError && expertData) {
        return {
          id: expertData.id,
          name: expertData.name || 'Expert',
          profile_picture: expertData.profile_picture,
          isOnline: false
        };
      }
      
      console.error('User not found in either table');
      return null;
    } catch (error) {
      console.error('Repository error in getUser:', error);
      return null;
    }
  }
}

export const messagingRepository = new MessagingRepository();
