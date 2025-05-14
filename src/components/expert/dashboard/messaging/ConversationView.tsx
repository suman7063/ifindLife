
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useMessaging } from '@/hooks/messaging/useMessaging';
import { format } from 'date-fns';

interface ConversationViewProps {
  userId: string;
  userName: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ userId, userName }) => {
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    messages, 
    loading, 
    sending,
    fetchMessages, 
    sendMessage 
  } = useMessaging();

  useEffect(() => {
    if (userId) {
      fetchMessages(userId);
    }
  }, [userId, fetchMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !userId) return;
    
    const success = await sendMessage(userId, messageContent);
    if (success) {
      setMessageContent('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!userId) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <p className="text-center text-muted-foreground">
            Select a conversation to start messaging
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b bg-muted/30 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className="font-medium">{userName}</h3>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Start a conversation with {userName}
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender_id === userId ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`rounded-lg p-3 max-w-[75%] ${
                      message.sender_id === userId 
                        ? 'bg-muted text-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 ${message.sender_id === userId ? 'text-muted-foreground' : 'text-primary-foreground/80'}`}>
                      {message.created_at && format(new Date(message.created_at), 'p')}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea 
            placeholder={`Message ${userName}...`}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={handleKeyPress}
            className="resize-none"
            disabled={sending}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!messageContent.trim() || sending}
            className="px-3"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ConversationView;
