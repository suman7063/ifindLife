
import React, { useState, useEffect, useRef } from 'react';
import { useMessaging } from '@/hooks/messaging/useMessaging';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Conversation, Message } from '@/hooks/messaging/types';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Send } from 'lucide-react';

const UserMessages: React.FC = () => {
  const {
    messages,
    conversations,
    currentConversation,
    loading,
    sending,
    fetchMessages,
    sendMessage,
    fetchConversations,
    setCurrentConversation
  } = useMessaging();
  
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentConversation) return;
    
    const success = await sendMessage(currentConversation, messageInput);
    if (success) {
      setMessageInput('');
    }
  };
  
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation.id);
    fetchMessages(conversation.id);
  };
  
  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-280px)] min-h-[500px]">
      {/* Conversations List */}
      <Card className="md:col-span-1 overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Conversations</CardTitle>
        </CardHeader>
        
        <CardContent className="overflow-y-auto flex-grow p-2">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No conversations yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <Button
                    variant={currentConversation === conversation.id ? "default" : "ghost"}
                    className={`w-full justify-start px-2 py-2 h-auto ${
                      currentConversation === conversation.id ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="flex items-center w-full">
                      <Avatar className="h-10 w-10 mr-2">
                        <AvatarImage src={conversation.profilePicture} alt={conversation.name} />
                        <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 truncate">
                        <p className="font-medium text-sm text-left truncate">{conversation.name}</p>
                        {conversation.lastMessage && (
                          <p className="text-xs truncate text-left opacity-70">
                            {conversation.lastMessage}
                          </p>
                        )}
                      </div>
                      {conversation.unreadCount ? (
                        <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-[1.25rem] flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="md:col-span-2 flex flex-col">
        {currentConversation ? (
          <>
            <CardHeader className="border-b pb-3">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage 
                    src={conversations.find(c => c.id === currentConversation)?.profilePicture} 
                    alt={conversations.find(c => c.id === currentConversation)?.name || ''} 
                  />
                  <AvatarFallback>
                    {getInitials(conversations.find(c => c.id === currentConversation)?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">
                  {conversations.find(c => c.id === currentConversation)?.name || 'Chat'}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isMine
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted rounded-bl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[60px] flex-grow"
                  disabled={sending}
                />
                <Button type="submit" size="icon" disabled={sending || !messageInput.trim()}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground p-4 text-center">
            <div>
              <p className="mb-2">Select a conversation to view messages</p>
              <p className="text-sm">Or start a new conversation with an expert</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserMessages;
