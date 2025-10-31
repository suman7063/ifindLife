import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  isMine: boolean;
}

interface ChatOnlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: string;
    name: string;
    profilePicture?: string;
    auth_id?: string;
  };
}

const ChatOnlyModal: React.FC<ChatOnlyModalProps> = ({
  isOpen,
  onClose,
  expert,
}) => {
  const { userProfile, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const userId = userProfile?.id;
  const expertAuthId = expert.auth_id || expert.id;

  // Load messages
  useEffect(() => {
    if (!isOpen || !userId || !expertAuthId) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        
        // Get messages where user is sender and expert is receiver, or vice versa
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${expertAuthId}),and(sender_id.eq.${expertAuthId},receiver_id.eq.${userId})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading messages:', error);
          return;
        }

        const formattedMessages = (data || []).map((msg) => ({
          ...msg,
          isMine: msg.sender_id === userId,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${userId}:${expertAuthId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${userId},receiver_id.eq.${expertAuthId}),and(sender_id.eq.${expertAuthId},receiver_id.eq.${userId}))`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          const formattedMsg = {
            ...newMsg,
            isMine: newMsg.sender_id === userId,
          };
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.find((m) => m.id === newMsg.id)) {
              return prev;
            }
            return [...prev, formattedMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, userId, expertAuthId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId || !expertAuthId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: expertAuthId,
          content: newMessage.trim(),
          read: false,
        });

      if (error) {
        throw error;
      }

      // Optimistically add message
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        sender_id: userId,
        receiver_id: expertAuthId,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        read: false,
        isMine: true,
      };
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={expert.profilePicture} alt={expert.name} />
                <AvatarFallback>{getInitials(expert.name)}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Chat with {expert.name}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">Expert is currently away</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Messages container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-muted/20"
        >
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      message.isMine
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-background border border-border rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isMine
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="border-t px-6 py-4 bg-background">
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 min-h-[60px] max-h-[120px] px-4 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="default"
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatOnlyModal;

