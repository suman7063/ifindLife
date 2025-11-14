
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Pin, Archive, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  clientName: string;
  clientAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isArchived: boolean;
}

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedConversationId
}) => {
  const { expert } = useSimpleAuth();
  const expertId = expert?.auth_id || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations from database
  useEffect(() => {
    if (!expertId) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        setLoading(true);
        
        // Get all messages where expert is sender or receiver
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${expertId},receiver_id.eq.${expertId}`)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        // Group messages by user (the other participant)
        const conversationsMap = new Map<string, {
          userId: string;
          messages: any[];
          unreadCount: number;
          lastMessage: any;
        }>();

        messagesData?.forEach((message) => {
          // Get the user ID (the other party, not the expert)
          const userId = message.sender_id === expertId ? message.receiver_id : message.sender_id;
          
          if (!conversationsMap.has(userId)) {
            conversationsMap.set(userId, {
              userId,
              messages: [],
              unreadCount: 0,
              lastMessage: message
            });
          }

          const conv = conversationsMap.get(userId)!;
          conv.messages.push(message);

          // Update last message if this is more recent
          if (new Date(message.created_at) > new Date(conv.lastMessage.created_at)) {
            conv.lastMessage = message;
          }

          // Count unread messages (messages sent to expert that are unread)
          if (message.receiver_id === expertId && !message.read) {
            conv.unreadCount++;
          }
        });

        // Get user details for each conversation
        const userIds = Array.from(conversationsMap.keys());
        if (userIds.length > 0) {
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('id, name, profile_picture')
            .in('id', userIds);

          if (usersError) throw usersError;

          // Build conversations list
          const conversationsList: Conversation[] = [];

          conversationsMap.forEach((conv, userId) => {
            const userInfo = usersData?.find(user => user.id === userId);

            if (userInfo) {
              conversationsList.push({
                id: userId,
                clientName: userInfo.name || 'Unknown User',
                clientAvatar: userInfo.profile_picture || '',
                lastMessage: conv.lastMessage.content,
                lastMessageTime: new Date(conv.lastMessage.created_at),
                unreadCount: conv.unreadCount,
                isOnline: false, // TODO: Add user presence tracking
                isPinned: false,
                isArchived: false
              });
            }
          });

          // Sort by last message time
          conversationsList.sort((a, b) => 
            b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
          );

          setConversations(conversationsList);
        } else {
          setConversations([]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to load conversations');
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel(`expert-conversations:${expertId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${expertId}`,
        },
        async () => {
          // Refresh conversations when new message arrives
          try {
            const { data: messagesData, error: messagesError } = await supabase
              .from('messages')
              .select('*')
              .or(`sender_id.eq.${expertId},receiver_id.eq.${expertId}`)
              .order('created_at', { ascending: false });

            if (messagesError) return;

            const conversationsMap = new Map<string, {
              userId: string;
              messages: any[];
              unreadCount: number;
              lastMessage: any;
            }>();

            messagesData?.forEach((message) => {
              const userId = message.sender_id === expertId ? message.receiver_id : message.sender_id;
              
              if (!conversationsMap.has(userId)) {
                conversationsMap.set(userId, {
                  userId,
                  messages: [],
                  unreadCount: 0,
                  lastMessage: message
                });
              }

              const conv = conversationsMap.get(userId)!;
              conv.messages.push(message);

              if (new Date(message.created_at) > new Date(conv.lastMessage.created_at)) {
                conv.lastMessage = message;
              }

              if (message.receiver_id === expertId && !message.read) {
                conv.unreadCount++;
              }
            });

            const userIds = Array.from(conversationsMap.keys());
            if (userIds.length > 0) {
              const { data: usersData } = await supabase
                .from('users')
                .select('id, name, profile_picture')
                .in('id', userIds);

              const conversationsList: Conversation[] = [];

              conversationsMap.forEach((conv, userId) => {
                const userInfo = usersData?.find(user => user.id === userId);

                if (userInfo) {
                  conversationsList.push({
                    id: userId,
                    clientName: userInfo.name || 'Unknown User',
                    clientAvatar: userInfo.profile_picture || '',
                    lastMessage: conv.lastMessage.content,
                    lastMessageTime: new Date(conv.lastMessage.created_at),
                    unreadCount: conv.unreadCount,
                    isOnline: false,
                    isPinned: false,
                    isArchived: false
                  });
                }
              });

              conversationsList.sort((a, b) => 
                b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
              );

              setConversations(conversationsList);
            }
          } catch (error) {
            console.error('Error refreshing conversations:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [expertId]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchiveFilter = showArchived ? conv.isArchived : !conv.isArchived;
    return matchesSearch && matchesArchiveFilter;
  });

  const sortedConversations = filteredConversations.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Messages</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={showArchived ? "default" : "outline"}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="h-4 w-4 mr-1" />
              {showArchived ? 'Active' : 'Archived'}
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {loading ? (
            <div className="flex justify-center items-center h-[600px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
              <p className="text-lg font-medium mb-2">No conversations yet</p>
              <p className="text-sm">Messages from users will appear here</p>
            </div>
          ) : (
            <div className="space-y-1">
              {sortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.clientAvatar} />
                      <AvatarFallback>
                        {conversation.clientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.clientName}
                        </h4>
                        {conversation.isPinned && (
                          <Pin className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="h-5 min-w-5 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
