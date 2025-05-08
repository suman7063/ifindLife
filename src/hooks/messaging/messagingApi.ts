import { MessagingRepository, MessagingUser, Conversation, Message } from './types';
import { Message as AppointmentMessage } from '@/types/appointments';

/**
 * API functions for messaging functionality
 */
export const messagingRepository: MessagingRepository = {
  /**
   * Fetch messages between two users
   */
  fetchMessages: async (userId: string, partnerId: string): Promise<AppointmentMessage[]> => {
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
  fetchConversations: async (userId: string): Promise<Conversation[]> => {
    try {
      console.log(`Fetching conversations for user ${userId}`);
      
      // Mock API call - in a real app, this would be a call to your backend
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return [
        {
          userId: '123',
          userName: 'John Doe',
          userAvatar: 'https://example.com/avatar1.jpg',
          lastMessage: 'Hello, how are you?',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 2
        },
        {
          userId: '456',
          userName: 'Jane Smith',
          userAvatar: 'https://example.com/avatar2.jpg',
          lastMessage: 'Let\'s schedule a meeting tomorrow.',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0
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
   * Mark all messages in a conversation as read
   */
  markConversationAsRead: async (userId: string, partnerId: string): Promise<boolean> => {
    try {
      console.log(`Marking conversation as read between ${userId} and ${partnerId}`);
      
      // Mock API call - in a real app, this would be a call to your backend
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return success
      return true;
    } catch (error) {
      console.error('Error marking conversation as read:', error);
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
  
  return messagingRepository.markConversationAsRead(currentUser.id, partnerId);
};
