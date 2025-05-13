import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { useUserAuth } from '@/hooks/user-auth';
import { useMessaging } from '@/hooks/messaging';
import { useNavigate } from 'react-router-dom';

const UserMessages: React.FC = () => {
  const { currentUser } = useUserAuth();
  const { loadConversations, conversations, isLoadingConversations } = useMessaging(currentUser);
  const navigate = useNavigate();
  const [totalUnread, setTotalUnread] = useState(0);
  
  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser, loadConversations]);
  
  useEffect(() => {
    // Calculate total unread messages
    const unreadCount = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
    setTotalUnread(unreadCount);
  }, [conversations]);
  
  // Function to get initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleViewAllMessages = () => {
    navigate('/messages');
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Recent Messages
          {totalUnread > 0 && (
            <Badge variant="destructive" className="ml-2">
              {totalUnread} new
            </Badge>
          )}
        </CardTitle>
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoadingConversations ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.slice(0, 3).map((conversation) => (
              <div key={conversation.id} className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarImage src={conversation.userAvatar} />
                  <AvatarFallback>{getInitials(conversation.userName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{conversation.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="ml-2 h-5 min-w-5 px-1.5">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              size="sm"
              onClick={handleViewAllMessages}
            >
              View all messages
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserMessages;
