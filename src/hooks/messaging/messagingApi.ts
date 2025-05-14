
import { MessageRepositoryInterface, MessagingUser, Conversation, Message } from './types';
import { normalizeId } from '@/utils/supabaseUtils';

/**
 * API functions for messaging functionality
 */
export const messagingRepository: MessageRepositoryInterface = {
  /**
   * Fetch messages between two users
   */
  getMessages: async (userId: string, partnerId: string): Promise<Message[]> => {
    try {
      console.log(`Fetching messages between ${userId} and ${partnerId}`);
      
      // Mock API call - in a real app, this would be a call to your backend
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return [
        {
          id: '1',
          sender_id: userId,
          receiver_id: partnerId,
          content: 'Hello, how are you?',
          created_at: new Date().toISOString(),
          read: true
        },
        {
          id: '2',
          sender_id: partnerId,
          receiver_id: userId,
          content: 'I am good, thanks for asking!',
          created_at: new Date().toISOString(),
          read: false
        }
      ];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },
  
  /**
   * Fetch all conversations for a user
   */
  getConversations: async (userId: string): Promise<Conversation[]> => {
    try {
      console.log(`Fetching conversations for user ${userId}`);
      
      // Mock API call - in a real app, this would be a call to your backend
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data with both new and backward compatibility formats
      return [
        {
          id: '123',
          otherUser: {
            id: '123',
            name: 'John Doe',
            profile_picture: 'https://example.com/avatar1.jpg'
          },
          lastMessage: {
            content: 'Hello, how are you?',
            timestamp: new Date().toISOString(),
            isRead: false,
            senderId: '123'
          },
          unreadCount: 2,
          // Backward compatibility properties
          userId: '123',
          userName: 'John Doe',
          userAvatar: 'https://example.com/avatar1.jpg',
          lastMessageTime: new Date().toISOString()
        },
        {
          id: '456',
          otherUser: {
            id: '456',
            name: 'Jane Smith',
            profile_picture: 'https://example.com/avatar2.jpg'
          },
          lastMessage: {
            content: 'Let\'s schedule a meeting tomorrow.',
            timestamp: new Date().toISOString(),
            isRead: true,
            senderId: '456'
          },
          unreadCount: 0,
          // Backward compatibility properties
          userId: '456',
          userName: 'Jane Smith',
          userAvatar: 'https://example.com/avatar2.jpg',
          lastMessageTime: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },
  
  /**
   * Send a message to another user
   */
  sendMessage: async (senderId: string, receiverId: string, content: string): Promise<Message | null> => {
    try {
      console.log(`Sending message from ${senderId} to ${receiverId}`);
      
      // Mock API call - in a real app, this would be a call to your backend
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return {
        id: Math.random().toString(36).substr(2, 9),
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        created_at: new Date().toISOString(),
        read: false
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  /**
   * Mark message as read
   */
  markAsRead: async (messageId: string): Promise<boolean> => {
    try {
      console.log(`Marking message as read: ${messageId}`);
      
      // Mock API call - in a real app, this would be a call to your backend
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return success
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },
  
  /**
   * Search for users
   */
  searchUsers: async (query: string): Promise<MessagingUser[]> => {
    try {
      console.log(`Searching users with query: ${query}`);
      
      // Mock API call - in a real app, this would be a call to your backend
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return [
        {
          id: '123',
          name: 'John Doe',
          profile_picture: 'https://example.com/avatar1.jpg',
          type: 'user'
        },
        {
          id: '456',
          name: 'Jane Smith',
          profile_picture: 'https://example.com/avatar2.jpg',
          type: 'expert'
        }
      ].filter(user => 
        user.name?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
};

// Helper function to send a message
export const sendMessage = async (
  currentUser: MessagingUser | null, 
  receiverId: string, 
  content: string
): Promise<Message | null> => {
  if (!currentUser || !currentUser.id) {
    console.error('Cannot send message: No current user');
    return null;
  }
  
  return messagingRepository.sendMessage(currentUser.id, receiverId, content);
};

// Helper function to mark conversation as read
export const markConversationAsRead = async (
  currentUser: MessagingUser | null,
  partnerId: string
): Promise<boolean> => {
  if (!currentUser || !currentUser.id) {
    console.error('Cannot mark conversation: No current user');
    return false;
  }
  
  // In a real implementation, this would mark all messages from partnerId as read
  // For now, we'll just return true
  return true;
};
