/**
 * CallChat Component
 * Real-time chat component for use during Agora RTC calls
 * Uses Agora RTC SDK data streams (not a separate Chat SDK)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { sendChatMessage, setupChatMessageListener, type ChatMessage } from '@/utils/agoraService';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';

interface CallChatProps {
  visible: boolean;
  client: IAgoraRTCClient | null;
  userName: string;
  expertName: string;
  expertAvatar?: string;
}

const CallChat: React.FC<CallChatProps> = ({
  visible,
  client,
  userName,
  expertName,
  expertAvatar
}) => {
  const { user } = useSimpleAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Setup message listener when client is available (always listen, not just when visible)
  useEffect(() => {
    if (!client) return;

    const handleMessage = (message: ChatMessage) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    };

    const cleanup = setupChatMessageListener(client, handleMessage);

    return cleanup;
  }, [client]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !client || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const success = await sendChatMessage(client, messageContent, userName);
      
      if (!success) {
        toast.error('Failed to send message');
        setNewMessage(messageContent); // Restore message on error
      } else {
        // Optimistically add message to UI
        const optimisticMessage: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          senderId: client.uid || user?.id || 'unknown',
          senderName: userName,
          content: messageContent,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, optimisticMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const currentUserId = client?.uid || user?.id || 'unknown';

  return (
    <div className={`flex flex-col h-full max-h-[500px] ${!visible ? 'hidden' : ''}`}>
      {/* Chat Header */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={expertAvatar} />
            <AvatarFallback>{expertName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Chat</p>
            <p className="text-xs text-muted-foreground">Agora RTC Data Stream</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-sm text-muted-foreground text-center">
              No messages yet. Start the conversation!
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isMine = String(message.senderId) === String(currentUserId);
              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 ${
                      isMine
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    {!isMine && (
                      <p className="text-xs font-medium mb-1 opacity-80">
                        {message.senderName}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t p-3">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sending || !client || client.connectionState !== 'CONNECTED'}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || sending || !client || client.connectionState !== 'CONNECTED'}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CallChat;

