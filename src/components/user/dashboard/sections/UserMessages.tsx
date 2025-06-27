
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Conversation } from '@/hooks/messaging/types';
import { useConversations } from '@/hooks/messaging/useConversations';
import { adaptConversation } from '@/utils/userProfileAdapter';
import { format } from 'date-fns';

const formatMessageDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 3600 * 24));

  if (diffDays < 1) {
    return format(date, 'h:mm a');
  } else if (diffDays < 7) {
    return format(date, 'EEE');
  } else {
    return format(date, 'MMM d');
  }
};

const UserMessages: React.FC = () => {
  const { user } = useAuth();
  const { conversations, selectConversation, selectedConversation: selectedConversationId, fetchConversations } = useConversations();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchConversations();
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [fetchConversations]);

  const conversationItem = (conversation: Conversation) => {
    const adaptedConversation = adaptConversation(conversation);
    return (
      <div
        key={adaptedConversation.id}
        className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer ${
          selectedConversationId === adaptedConversation.id 
            ? 'bg-ifind-purple/10' 
            : 'hover:bg-gray-100'
        }`}
        onClick={() => selectConversation(adaptedConversation.id)}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={adaptedConversation.profilePicture || '/placeholder-user.jpg'} 
            alt={adaptedConversation.name} 
          />
          <AvatarFallback>{adaptedConversation.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <p className="font-medium truncate">{adaptedConversation.name}</p>
            <span className="text-xs text-gray-500">
              {formatMessageDate(adaptedConversation.lastMessageDate)}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {adaptedConversation.lastMessage || 'No messages yet'}
          </p>
        </div>
        {adaptedConversation.unreadCount && adaptedConversation.unreadCount > 0 ? (
          <Badge variant="default" className="bg-ifind-purple h-5 min-w-[20px] flex items-center justify-center">
            {adaptedConversation.unreadCount}
          </Badge>
        ) : null}
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Loading messages...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Messages</h3>
      <div className="space-y-3">
        {conversations.length > 0 ? (
          conversations.map(conversationItem)
        ) : (
          <div className="text-gray-500">No conversations yet.</div>
        )}
      </div>
    </div>
  );
};

export default UserMessages;
