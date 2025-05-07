
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useUserAuth } from '@/hooks/user-auth';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender_name: string;
  sender_avatar?: string;
}

interface MessageListProps {
  onSelectConversation: (userId: string, userName: string) => void;
  selectedUserId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ onSelectConversation, selectedUserId }) => {
  const { currentUser } = useUserAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Get all messages where the expert is either the sender or receiver
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*, sender:sender_id(name, profile_picture), receiver:receiver_id(name, profile_picture)')
          .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
          .order('created_at', { ascending: false });
        
        if (messagesError) throw messagesError;
        
        // Group by conversation (unique users)
        const conversationMap = new Map();
        
        messages?.forEach(message => {
          const otherUserId = message.sender_id === currentUser.id ? message.receiver_id : message.sender_id;
          const otherUser = message.sender_id === currentUser.id ? message.receiver : message.sender;
          
          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              userId: otherUserId,
              userName: otherUser?.name || 'User',
              userAvatar: otherUser?.profile_picture,
              lastMessage: message.content,
              lastMessageTime: message.created_at,
              unreadCount: message.receiver_id === currentUser.id && !message.read ? 1 : 0
            });
          } else if (new Date(message.created_at) > new Date(conversationMap.get(otherUserId).lastMessageTime)) {
            // Update last message if this one is newer
            const conversation = conversationMap.get(otherUserId);
            conversation.lastMessage = message.content;
            conversation.lastMessageTime = message.created_at;
            if (message.receiver_id === currentUser.id && !message.read) {
              conversation.unreadCount += 1;
            }
          } else if (message.receiver_id === currentUser.id && !message.read) {
            // Count other unread messages
            conversationMap.get(otherUserId).unreadCount += 1;
          }
        });
        
        // Convert map to array and sort by last message time
        const sortedConversations = Array.from(conversationMap.values())
          .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
        
        setConversations(sortedConversations);
      } catch (err: any) {
        console.error('Error fetching conversations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${currentUser?.id}`
      }, () => {
        fetchConversations();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

  // Function to get initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading conversations: {error}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm mt-1">Your conversations with clients will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card 
          key={conversation.userId}
          className={`hover:bg-accent/10 transition-colors cursor-pointer ${
            selectedUserId === conversation.userId ? 'border-primary' : ''
          }`}
          onClick={() => onSelectConversation(conversation.userId, conversation.userName)}
        >
          <CardContent className="p-3 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.userAvatar} />
              <AvatarFallback>{getInitials(conversation.userName)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-medium truncate">{conversation.userName}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="ml-2 h-5 min-w-5 px-1.5">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MessageList;
