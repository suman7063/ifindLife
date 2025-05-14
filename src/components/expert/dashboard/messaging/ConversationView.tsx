
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useMessaging } from '@/hooks/useMessaging';
import { Message } from '@/types/database/unified';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { messages, sendMessage, loading } = useMessaging(userId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      sendMessage(newMessage);
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
  
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-8">
        <p className="text-muted-foreground text-center">
          No messages yet. Start a conversation!
        </p>
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
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          // Handle both snake_case and camelCase properties
          const senderId = message.senderId || message.sender_id;
          const isOwnMessage = senderId === user?.id;
          const messageDate = message.createdAt || message.created_at;
          
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
                    {messageDate && format(new Date(messageDate), 'p')}
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
