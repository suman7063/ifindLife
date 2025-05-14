
import { useState, useEffect, useCallback } from 'react';
import { fetchConversations, fetchMessages, sendMessage, markAllMessagesAsRead, fetchUsers, createConversation } from './messagingApi';
import { Message, Conversation, MessagingUser } from './types';

export const useMessaging = (currentUserId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<MessagingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations for the current user
  const getConversations = useCallback(async () => {
    if (!currentUserId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchConversations(currentUserId);
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Fetch messages for a specific conversation
  const getMessages = useCallback(async (conversationId: string) => {
    if (!currentUserId || !conversationId) return;
    
    setMessageLoading(true);
    setError(null);
    
    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
      
      // Mark messages as read
      await markAllMessagesAsRead(conversationId);
      
      // Update conversation unread count
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setMessageLoading(false);
    }
  }, [currentUserId]);

  // Select a conversation to display
  const selectConversation = useCallback((conversation: Conversation) => {
    setCurrentConversation(conversation);
    getMessages(conversation.id);
  }, [getMessages]);

  // Send a new message
  const sendNewMessage = useCallback(async (content: string) => {
    if (!currentUserId || !currentConversation) return;
    
    try {
      const newMessage = await sendMessage(currentUserId, currentConversation.userId, content);
      
      // Update messages state
      setMessages(prev => [...prev, newMessage]);
      
      // Update conversation last message
      const updatedConversation = {
        ...currentConversation,
        lastMessage: {
          content,
          timestamp: newMessage.timestamp,
          isRead: false,
          senderId: currentUserId
        },
        lastMessageTime: newMessage.timestamp
      };
      
      setCurrentConversation(updatedConversation);
      
      // Update conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id ? updatedConversation : conv
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      return false;
    }
  }, [currentUserId, currentConversation]);

  // Fetch available users for starting new conversations
  const getUsers = useCallback(async () => {
    if (!currentUserId) return;
    
    try {
      const usersData = await fetchUsers();
      // Convert to the correct type by mapping users
      const typedUsers: MessagingUser[] = usersData.map(user => ({
        id: String(user.id), // Ensure id is a string
        name: user.name,
        avatar: user.avatar,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        role: user.role
      }));
      setUsers(typedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    }
  }, [currentUserId]);

  // Start a new conversation with a user
  const startConversation = useCallback(async (otherUserId: string) => {
    if (!currentUserId) return;
    
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => conv.userId === otherUserId);
      
      if (existingConversation) {
        selectConversation(existingConversation);
        return;
      }
      
      // Create new conversation
      const newConversation = await createConversation(currentUserId, otherUserId);
      
      // Update conversations list
      setConversations(prev => [...prev, newConversation]);
      
      // Select the new conversation
      selectConversation(newConversation);
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Failed to start conversation. Please try again.');
    }
  }, [currentUserId, conversations, selectConversation]);

  // Load conversations when component mounts
  useEffect(() => {
    if (currentUserId) {
      getConversations();
    }
  }, [currentUserId, getConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    users,
    loading,
    messageLoading,
    error,
    selectConversation,
    sendMessage: sendNewMessage,
    getUsers,
    startConversation,
    refreshConversations: getConversations
  };
};

export default useMessaging;
