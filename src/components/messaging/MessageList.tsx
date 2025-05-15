
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMessaging } from '@/hooks/messaging';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageListProps {
  userId: string;
  onSelectConversation: (userId: string, userName: string) => void;
  selectedUserId?: string;
}

type Conversation = {
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
};

const MessageList: React.FC<MessageListProps> = ({ userId, onSelectConversation, selectedUserId }) => {
  const { getConversations } = useMessaging();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const result = await getConversations(userId);
        setConversations(result || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchConversations();
    }
  }, [userId, getConversations]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-4 border-b">
        <h3 className="font-medium">Recent Conversations</h3>
      </div>
      
      <ScrollArea className="h-[500px]">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No conversations yet
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.userId}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-100 mb-1 ${
                  selectedUserId === conversation.userId ? 'bg-gray-100' : ''
                }`}
                onClick={() => onSelectConversation(conversation.userId, conversation.userName)}
              >
                <Avatar>
                  <AvatarImage src="" alt={conversation.userName} />
                  <AvatarFallback>{getInitials(conversation.userName)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium truncate">{conversation.userName}</h4>
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
                
                {conversation.unread > 0 && (
                  <div className="bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unread}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default MessageList;
