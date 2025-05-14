
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { formatRelative } from 'date-fns';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useMessaging } from '@/hooks/messaging';

interface ConversationViewProps {
  userId: string;
  userName: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ userId, userName }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { expertProfile } = useAuth();
  
  // Use the messaging hook with proper typing
  const {
    messages,
    sendMessage,
    refreshMessages,
    loading,
    messageLoading
  } = useMessaging(expertProfile ? {
    id: expertProfile?.id?.toString() || '',
    name: expertProfile?.name || 'Expert',
    profile_picture: expertProfile?.profile_picture
  } : null);

  useEffect(() => {
    if (userId && expertProfile) {
      refreshMessages();
    }
  }, [userId, expertProfile, refreshMessages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message);
    setMessage('');
  };

  if (!userId) {
    return (
      <Card className="h-[calc(100vh-16rem)]">
        <CardContent className="flex items-center justify-center h-full text-center p-6">
          <div>
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-muted-foreground mt-1">Choose a client from the list to view your conversation</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-16rem)] flex flex-col">
      <CardHeader className="border-b px-4 py-3">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-base font-medium">{userName}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-center">
            <div>
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm mt-1">Start the conversation by sending a message</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === expertProfile?.id?.toString() ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    msg.senderId === expertProfile?.id?.toString()
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatRelative(new Date(msg.timestamp), new Date())}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-2">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={messageLoading}
          />
          <Button type="submit" disabled={!message.trim() || messageLoading}>
            {messageLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ConversationView;
