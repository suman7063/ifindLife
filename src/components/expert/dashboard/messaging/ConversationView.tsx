
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useMessaging } from '@/hooks/messaging';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { adaptMessage } from '@/utils/userProfileAdapter';

interface ConversationViewProps {
  userId: string;
  userName?: string;
  userAvatar?: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  userId,
  userName = 'User',
  userAvatar
}) => {
  const { user } = useAuth();
  const { 
    messages: messagesList, 
    loading,
    fetchMessages: getMessagesList, 
    sendMessage 
  } = useMessaging();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages for this conversation when userId changes
  useEffect(() => {
    if (userId && user?.id) {
      getMessagesList(userId);
    }
  }, [userId, user?.id, getMessagesList]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesList]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() && user?.id && userId) {
      sendMessage(userId, newMessage);
      setNewMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-3/4 ml-auto" />
        <Skeleton className="h-24 w-3/4" />
        <Skeleton className="h-24 w-3/4 ml-auto" />
      </div>
    );
  }
  
  if (!userId || !messagesList || messagesList.length === 0) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-8">
        <p className="text-muted-foreground text-center">
          {!userId ? 'Select a conversation to start messaging' : 'No messages yet. Start a conversation!'}
        </p>
        {userId && (
          <div className="mt-auto w-full">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Filter messages for the current conversation
  const conversationMessages = messagesList.filter(
    msg => (msg.sender_id === userId && msg.receiver_id === user?.id) || 
           (msg.sender_id === user?.id && msg.receiver_id === userId)
  );
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.map((message) => {
          const adaptedMessage = adaptMessage(message, user?.id);
          const isOwnMessage = adaptedMessage.isMine || message.sender_id === user?.id;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex max-w-[80%]">
                {!isOwnMessage && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <Card
                    className={`px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {message.content}
                  </Card>
                  <div
                    className={`text-xs text-muted-foreground mt-1 ${
                      isOwnMessage ? 'text-right' : ''
                    }`}
                  >
                    {adaptedMessage.timestamp 
                      ? format(adaptedMessage.timestamp, 'p') 
                      : format(new Date(message.created_at), 'p')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
