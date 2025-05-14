
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useMessaging } from '@/hooks/messaging/useMessaging';
import { Conversation } from '@/hooks/messaging/types';

interface MessageListProps {
  onSelectConversation: (userId: string, userName: string) => void;
  selectedUserId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ 
  onSelectConversation, 
  selectedUserId 
}) => {
  const { 
    conversations, 
    loading,
    fetchConversations
  } = useMessaging();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No conversations yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      {conversations.map((conversation) => (
        <Card 
          key={conversation.id}
          className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
            selectedUserId === conversation.id ? 'bg-muted' : ''
          }`}
          onClick={() => onSelectConversation(conversation.id, conversation.name)}
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={conversation.profilePicture} />
              <AvatarFallback>
                {conversation.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h4 className="font-medium truncate">{conversation.name}</h4>
                {conversation.lastMessageDate && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(conversation.lastMessageDate), { addSuffix: true })}
                  </span>
                )}
              </div>
              
              {conversation.lastMessage && (
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
              )}
            </div>
            
            {(conversation.unreadCount && conversation.unreadCount > 0) && (
              <Badge variant="default" className="text-xs">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MessageList;
