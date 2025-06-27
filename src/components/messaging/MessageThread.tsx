import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import useMessaging from '@/hooks/messaging';
import { Message } from '@/types/database/unified';

interface MessageThreadProps {
  userId: string;
  recipientId: string;
  recipientName: string;
  onSendMessage: (message: string) => Promise<void>;
}

const MessageThread: React.FC<MessageThreadProps> = ({ 
  userId, 
  recipientId, 
  recipientName, 
  onSendMessage 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getMessages } = useMessaging();

  useEffect(() => {
    const loadMessages = async () => {
      if (!userId || !recipientId) return;
      try {
        setLoading(true);
        const fetchedMessages = await getMessages(userId, recipientId);
        setMessages(fetchedMessages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [userId, recipientId, getMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await onSendMessage(newMessage);
      // Optimistically update the UI
      const newMsg: Message = {
        id: Date.now().toString(),
        sender_id: userId,
        receiver_id: recipientId,
        content: newMessage,
        read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isMine: true
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage src="" alt={recipientName} />
          <AvatarFallback>{getInitials(recipientName)}</AvatarFallback>
        </Avatar>
        <h3 className="font-medium">{recipientName}</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender_id === userId
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === userId
                      ? 'text-primary-foreground/70'
                      : 'text-gray-500'
                  }`}>
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t flex gap-2">
        <Textarea
          placeholder="Type a message..."
          className="min-h-[60px]"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          className="self-end"
          disabled={!newMessage.trim()}
          onClick={handleSendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default MessageThread;
