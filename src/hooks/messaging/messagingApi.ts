
import { Message, Conversation, MessagingUser } from './types';

// Mock data for testing
const mockUsers: MessagingUser[] = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/300?img=1', isOnline: true },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/300?img=2', isOnline: false },
  { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/300?img=3', isOnline: true },
  { id: '4', name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/300?img=4', isOnline: true },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How are you?',
    senderId: '1',
    receiverId: 'current-user',
    timestamp: '2023-05-10T10:30:00Z',
    isRead: true
  },
  {
    id: '2',
    content: 'I\'m good, thanks for asking!',
    senderId: 'current-user',
    receiverId: '1',
    timestamp: '2023-05-10T10:35:00Z',
    isRead: true
  },
  {
    id: '3',
    content: 'What are you up to today?',
    senderId: '1',
    receiverId: 'current-user',
    timestamp: '2023-05-10T10:40:00Z',
    isRead: false
  },
  {
    id: '4',
    content: 'Hi there!',
    senderId: '2',
    receiverId: 'current-user',
    timestamp: '2023-05-09T15:20:00Z',
    isRead: true
  },
  {
    id: '5',
    content: 'Do you have time for a quick call?',
    senderId: '2',
    receiverId: 'current-user',
    timestamp: '2023-05-09T15:25:00Z',
    isRead: false
  },
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://i.pravatar.cc/300?img=1',
    lastMessage: {
      content: 'What are you up to today?',
      timestamp: '2023-05-10T10:40:00Z',
      isRead: false,
      senderId: '1'
    },
    lastMessageTime: '2023-05-10T10:40:00Z',
    unreadCount: 1,
    otherUser: mockUsers[0]
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    userAvatar: 'https://i.pravatar.cc/300?img=2',
    lastMessage: {
      content: 'Do you have time for a quick call?',
      timestamp: '2023-05-09T15:25:00Z',
      isRead: false,
      senderId: '2'
    },
    lastMessageTime: '2023-05-09T15:25:00Z',
    unreadCount: 1,
    otherUser: mockUsers[1]
  },
];

// API Functions
export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  // In a real implementation, we would make API calls to fetch conversations
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockConversations);
    }, 500);
  });
};

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  // In a real implementation, we would make API calls to fetch messages
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredMessages = mockMessages.filter(
        (message) => message.senderId === conversationId || message.receiverId === conversationId
      );
      resolve(filteredMessages);
    }, 500);
  });
};

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string
): Promise<Message> => {
  // In a real implementation, we would make API calls to send a message
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        senderId,
        receiverId,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      resolve(newMessage);
    }, 300);
  });
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  // In a real implementation, we would make API calls to mark a message as read
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
};

export const markAllMessagesAsRead = async (conversationId: string): Promise<boolean> => {
  // In a real implementation, we would make API calls to mark all messages as read
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
};

export const fetchUsers = async (): Promise<MessagingUser[]> => {
  // In a real implementation, we would make API calls to fetch users
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 500);
  });
};

export const createConversation = async (
  userId: string, 
  otherUserId: string
): Promise<Conversation> => {
  // In a real implementation, we would make API calls to create a conversation
  return new Promise((resolve) => {
    setTimeout(() => {
      const otherUser = mockUsers.find(user => user.id === otherUserId);
      if (!otherUser) {
        throw new Error('User not found');
      }
      
      const conversation: Conversation = {
        id: Date.now().toString(),
        userId: otherUserId,
        userName: otherUser.name,
        userAvatar: otherUser.avatar,
        lastMessage: {
          content: '',
          timestamp: new Date().toISOString(),
          isRead: true,
          senderId: userId
        },
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        otherUser
      };
      
      resolve(conversation);
    }, 300);
  });
};
