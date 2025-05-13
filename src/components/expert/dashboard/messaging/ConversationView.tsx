
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import { useUserAuth } from '@/hooks/user-auth';
import { useMessaging } from '@/hooks/messaging';
import { format } from 'date-fns';
import { Message } from '@/types/appointments';

interface ConversationViewProps {
  userId: string;
  userName: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ userId, userName }) => {
  const { currentUser } = useUserAuth();
  const { 
    messages, 
    fetchMessages, 
    sendMessage, 
    messagesLoading, 
    loading 
  } = useMessaging(currentUser);
  const [newMessage, setNewMessage] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentUser || !userId) return;
      await fetchMessages(userId);
    };
    
    loadMessages();
  }, [currentUser, userId, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser || !userId) return;
    
    await sendMessage(userId, newMessage.trim());
    setNewMessage('');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If the message is from today, show only the time
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'HH:mm');
    }
    
    // Otherwise show the date and time
    return format(date, 'MMM d, HH:mm');
  };

  // Function to get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!userId) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="py-3 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userProfile?.profile_picture} />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">Client</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm mt-1">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.sender_id === currentUser?.id;
              
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isCurrentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ConversationView;
