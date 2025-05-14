
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useMessaging } from '@/hooks/messaging';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  onSelectConversation: (userId: string, userName: string) => void;
  selectedUserId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ onSelectConversation, selectedUserId }) => {
  const { expertProfile } = useAuth();
  
  // Use the messaging hook with proper typing
  const { 
    conversations, 
    refreshConversations, 
    loading 
  } = useMessaging(expertProfile ? {
    id: expertProfile?.id?.toString() || '',
    name: expertProfile?.name || 'Expert',
    profile_picture: expertProfile?.profile_picture
  } : null);

  useEffect(() => {
    if (expertProfile) {
      refreshConversations();
    }
  }, [expertProfile, refreshConversations]);

  // Function to get initials for the avatar
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
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm mt-1">Your conversations with clients will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card 
          key={conversation.userId}
          className={`hover:bg-accent/10 transition-colors cursor-pointer ${
            selectedUserId === conversation.userId ? 'border-primary' : ''
          }`}
          onClick={() => onSelectConversation(conversation.userId, conversation.userName)}
        >
          <CardContent className="p-3 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.userAvatar} />
              <AvatarFallback>{getInitials(conversation.userName)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-medium truncate">{conversation.userName}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage?.content || ''}</p>
                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="ml-2 h-5 min-w-5 px-1.5">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MessageList;
