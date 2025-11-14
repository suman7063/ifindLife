/**
 * CallChat Component
 * Real-time chat component for use during Agora RTC calls
 * Uses Agora RTC SDK data streams (not a separate Chat SDK)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    <div className={`flex flex-col h-full min-h-0 bg-gradient-to-b from-background via-background to-muted/20 ${!visible ? 'hidden' : ''}`}>
      {/* Stylish Chat Header */}
      <div className="px-4 py-3.5 border-b bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 shadow-md">
              <AvatarImage src={expertAvatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                {expertName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Chat</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live messaging
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area with Gradient Background */}
      <div className="flex-1 min-h-0 px-4 py-4 bg-gradient-to-b from-background to-muted/10 overflow-y-auto overflow-x-hidden">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-2">
                <Send className="h-6 w-6 text-primary/60" />
              </div>
              <p className="text-sm font-medium text-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isMine = String(message.senderId) === String(currentUserId);
              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className="flex flex-col max-w-[75%]">
                    {!isMine && (
                      <p className="text-xs font-medium text-muted-foreground mb-1 px-1">
                        {message.senderName}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-lg ${
                        isMine
                          ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md'
                          : 'bg-gradient-to-br from-card to-muted/50 text-foreground border border-border/50 rounded-bl-md shadow-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1.5 ${
                          isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Stylish Message Input */}
      <form onSubmit={handleSendMessage} className="border-t bg-gradient-to-r from-background via-muted/30 to-background p-3 backdrop-blur-sm flex-shrink-0">
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 pr-10 bg-background/80 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={sending || !client || client.connectionState !== 'CONNECTED'}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || sending || !client || client.connectionState !== 'CONNECTED'}
            className="bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CallChat;

