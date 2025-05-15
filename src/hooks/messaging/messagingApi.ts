
import { supabase } from '@/lib/supabase';
import { Message, Conversation } from './types';

// Create a messaging repository for handling all messaging operations
export const messagingRepository = {
  /**
   * Fetch all conversations for a user
   * @param userId The ID of the user
   * @returns Array of conversations
   */
  async fetchConversations(userId: string): Promise<Conversation[]> {
    try {
      // Get all unique users this user has messaged with
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id, created_at, content, read')
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id, created_at, content, read')
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false });

      if (sentError || receivedError) {
        console.error("Error fetching messages:", sentError || receivedError);
        return [];
      }

      // Get unique user IDs from messages
      const uniqueUserIds = new Set<string>();
      sentMessages?.forEach(msg => uniqueUserIds.add(msg.receiver_id));
      receivedMessages?.forEach(msg => uniqueUserIds.add(msg.sender_id));

      // If no conversations, return empty array
      if (uniqueUserIds.size === 0) {
        return [];
      }

      // Get user details for each unique user
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, name, email, profile_picture')
        .in('id', Array.from(uniqueUserIds));

      if (usersError) {
        console.error("Error fetching users:", usersError);
        return [];
      }

      // Create conversations combining user details and last message
      const conversations: Conversation[] = (users || []).map(user => {
        // Find latest message to/from this user
        const sentToUser = sentMessages?.filter(msg => msg.receiver_id === user.id) || [];
        const receivedFromUser = receivedMessages?.filter(msg => msg.sender_id === user.id) || [];
        
        const allMessages = [...sentToUser, ...receivedFromUser].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const lastMessage = allMessages.length > 0 ? allMessages[0].content : '';
        const lastMessageDate = allMessages.length > 0 ? allMessages[0].created_at : undefined;
        
        // Count unread messages from this user
        const unreadCount = receivedFromUser.filter(msg => !msg.read).length;

        return {
          id: user.id,
          name: user.name || user.email?.split('@')[0] || 'Unknown User',
          profilePicture: user.profile_picture,
          lastMessage,
          lastMessageDate,
          unreadCount,
          participantId: user.id
        };
      });

      // Sort conversations by last message date
      return conversations.sort((a, b) => {
        if (!a.lastMessageDate) return 1;
        if (!b.lastMessageDate) return -1;
        return new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime();
      });
    } catch (error) {
      console.error("Error in fetchConversations:", error);
      return [];
    }
  },

  /**
   * Fetch messages between two users
   * @param userId The ID of the current user
   * @param partnerId The ID of the conversation partner
   * @returns Array of messages
   */
  async fetchMessages(userId: string, partnerId: string): Promise<Message[]> {
    try {
      // Get all messages between these two users
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .or(`sender_id.eq.${partnerId},receiver_id.eq.${partnerId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }

      // Filter to only include messages between these two users (exclude other conversations)
      const filteredMessages = data.filter(msg => 
        (msg.sender_id === userId && msg.receiver_id === partnerId) || 
        (msg.sender_id === partnerId && msg.receiver_id === userId)
      );

      // Format messages for the UI
      return filteredMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        isMine: msg.sender_id === userId,
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        created_at: msg.created_at,
        read: msg.read || false
      }));
    } catch (error) {
      console.error("Error in fetchMessages:", error);
      return [];
    }
  },

  /**
   * Send a message to another user
   * @param senderId The ID of the sender
   * @param receiverId The ID of the receiver
   * @param content The message content
   * @returns Success status
   */
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          read: false
        });

      if (error) {
        console.error("Error sending message:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      return false;
    }
  },

  /**
   * Mark all messages from a specific sender as read
   * @param userId The ID of the current user (recipient)
   * @param senderId The ID of the sender
   * @returns Success status
   */
  async markMessagesAsRead(userId: string, senderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', userId)
        .eq('sender_id', senderId);

      if (error) {
        console.error("Error marking messages as read:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in markMessagesAsRead:", error);
      return false;
    }
  }
};
