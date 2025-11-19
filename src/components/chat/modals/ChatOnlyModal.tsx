import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, Circle } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { toast } from 'sonner';

interface ChatOnlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: string;
    auth_id?: string;
    name: string;
    profile_picture?: string;
  };
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

const ChatOnlyModal: React.FC<ChatOnlyModalProps> = ({
  isOpen,
  onClose,
  expert
}) => {
  const { user } = useSimpleAuth();
  const userId = user?.id;
  const expertAuthId = expert.auth_id;
  const { getExpertPresence } = useExpertPresence();
  const presence = getExpertPresence(expertAuthId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    if (!isOpen || !userId || !expertAuthId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${expertAuthId}),and(sender_id.eq.${expertAuthId},receiver_id.eq.${userId})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Method 1: Real-time subscription with simple filter
    const channel = supabase
      .channel(`chat-${userId}-${expertAuthId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          console.log('📨 Real-time message received:', newMsg);
          
          // Only add if it's from this expert
          if (newMsg.sender_id === expertAuthId) {
            setMessages(prev => {
              if (prev.find(m => m.id === newMsg.id)) {
                return prev;
              }
              console.log('✅ Adding expert message:', newMsg.content);
              const updated = [...prev, newMsg];
              return updated.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('🔔 Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to messages');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error, will use polling fallback');
        }
      });

    // Method 2: Polling as fallback (check for new messages every 2 seconds)
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${expertAuthId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${expertAuthId})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Polling error:', error);
          return;
        }

        if (data && data.length > 0) {
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newMessages = data.filter(msg => !existingIds.has(msg.id));
            
            if (newMessages.length > 0) {
              console.log(`🔄 Polling found ${newMessages.length} new message(s)`);
              const updated = [...prev, ...newMessages];
              return updated.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => {
      console.log('🧹 Cleaning up subscriptions');
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [isOpen, userId, expertAuthId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (!isOpen || !userId || !expertAuthId || messages.length === 0) return;

    const markAsRead = async () => {
      const unreadIds = messages
        .filter(msg => msg.receiver_id === userId && msg.sender_id === expertAuthId && !msg.read)
        .map(msg => msg.id);

      if (unreadIds.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadIds);
      }
    };

    markAsRead();
  }, [isOpen, userId, expertAuthId, messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId || !expertAuthId || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: expertAuthId,
          content: messageContent,
          read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Message will be added via real-time subscription, but add optimistically for immediate feedback
      setMessages(prev => {
        if (prev.find(m => m.id === data.id)) return prev;
        const updated = [...prev, data];
        return updated.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const getPresenceStatus = () => {
    if (!presence) return 'offline';
    return presence.status;
  };

  const getPresenceColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col p-0" hideCloseButton>
        <DialogHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={expert.profile_picture} />
                  <AvatarFallback>
                    {expert.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Circle 
                  className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background rounded-full ${getPresenceColor(getPresenceStatus())}`}
                  fill="currentColor"
                />
              </div>
              <div>
                <DialogTitle className="text-lg">{expert.name}</DialogTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {getPresenceStatus()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p className="mb-2">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwn = message.sender_id === userId;
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={expert.profile_picture} />
                        <AvatarFallback>
                          {expert.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] ${isOwn ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block px-3 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatMessageTime(message.created_at)}
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
        <div className="border-t px-4 py-3">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sending}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatOnlyModal;

