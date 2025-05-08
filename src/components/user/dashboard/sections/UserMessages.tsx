
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  Send, 
  Loader2 
} from 'lucide-react';
import { useMessaging } from '@/hooks/messaging';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface UserMessagesProps {
  user: UserProfile | null;
}

const UserMessages: React.FC<UserMessagesProps> = ({ user }) => {
  const { 
    messages, 
    conversations, 
    fetchConversations, 
    fetchMessages, 
    sendMessage,
    messagesLoading,
    conversationsLoading 
  } = useMessaging(user);

  const [selectedConversation, setSelectedConversation] = useState<{
    userId: string;
    userName: string;
  } | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Load conversations when component mounts
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (user && selectedConversation) {
      fetchMessages(selectedConversation.userId);
    }
  }, [user, selectedConversation, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;
    
    await sendMessage(selectedConversation.userId, newMessage);
    setNewMessage('');
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (conversationsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Messages</h2>
          <p className="text-muted-foreground">Your conversations with experts</p>
        </div>
        
        <Card className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Messages</h2>
        <p className="text-muted-foreground">
          Your conversations with experts and support
        </p>
      </div>
      
      {conversations.length === 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Inbox</CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>You don't have any messages yet</p>
              <p className="mt-2">Messages from experts and support will appear here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      className={`p-3 rounded-md cursor-pointer ${
                        selectedConversation?.userId === conversation.userId
                          ? 'bg-accent'
                          : 'hover:bg-accent/40'
                      }`}
                      onClick={() => setSelectedConversation({
                        userId: conversation.userId,
                        userName: conversation.userName
                      })}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={conversation.userAvatar} />
                          <AvatarFallback>{getInitials(conversation.userName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="font-medium truncate">{conversation.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(conversation.lastMessageTime), 'MMM d')}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Thread */}
          <div className="md:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle>
                  {selectedConversation ? selectedConversation.userName : 'Select a conversation'}
                </CardTitle>
              </CardHeader>
              <Separator />
              {selectedConversation ? (
                <>
                  <CardContent className="flex-1 overflow-y-auto pt-4">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No messages yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isFromUser = message.sender_id === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  isFromUser
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-accent'
                                }`}
                              >
                                <p className="break-words">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {format(new Date(message.created_at), 'p')}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                  Select a conversation to start messaging
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMessages;
