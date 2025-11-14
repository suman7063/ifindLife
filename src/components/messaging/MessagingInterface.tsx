import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Video,
  MoreVertical,
  Circle
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { useMessaging, Message, Conversation } from '@/hooks/useMessaging';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MessagingInterfaceProps {
  onStartCall?: (expertId: string, type: 'audio' | 'video') => void;
  initialExpertId?: string;
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  onStartCall,
  initialExpertId
}) => {
  const { userProfile } = useSimpleAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(initialExpertId || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    messages,
    loading,
    sendingMessage,
    sendMessage,
    fetchMessages,
    markMessagesAsRead,
    startConversation
  } = useMessaging(userProfile?.id);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation, fetchMessages, markMessagesAsRead]);

  // Initialize conversation if expertId is provided
  useEffect(() => {
    if (initialExpertId && !loading && userProfile?.id && !selectedConversation) {
      console.log('Initializing conversation with expertId:', initialExpertId);
      const initializeConversation = async () => {
        try {
          // Start conversation - this will add expert to list if not exists
          const expertId = await startConversation(initialExpertId);
          console.log('startConversation returned:', expertId);
          
          if (expertId) {
            // Automatically select the conversation after it's created
            console.log('Selecting conversation:', expertId);
            setSelectedConversation(expertId);
          } else {
            console.log('startConversation returned null, trying to find existing conversation');
            // If startConversation returned null, try to find existing conversation
            // Find conversation - the expert_id might be the expert's id (not auth_id)
            const { data: expertData } = await supabase
              .from('expert_accounts')
              .select('id, auth_id')
              .or(`id.eq.${initialExpertId},auth_id.eq.${initialExpertId}`)
              .maybeSingle();
            
            console.log('Expert data lookup result:', expertData);
            
            if (expertData) {
              // Try to find conversation by expert's id or auth_id
              const conv = conversations.find(c => 
                c.expert_id === expertData.id || 
                c.expert_id === expertData.auth_id || 
                c.expert_id === initialExpertId
              );
              
              console.log('Found existing conversation:', conv);
              
              if (conv) {
                setSelectedConversation(conv.expert_id);
              } else {
                // If no conversation found, wait for conversations to load and try again
                console.log('No conversation found, will retry after conversations load');
              }
            } else {
              console.warn('Expert not found in database:', initialExpertId);
            }
          }
        } catch (error) {
          console.error('Error initializing conversation:', error);
        }
      };
      
      initializeConversation();
    }
  }, [initialExpertId, loading, userProfile?.id, startConversation, selectedConversation, conversations]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConversation || !newMessage.trim()) return;

    const success = await sendMessage(selectedConversation, newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd');
    }
  };

  const getPresenceStatus = (conversation: Conversation) => {
    if (!conversation.presence) return 'offline';
    return conversation.presence.status;
  };

  const getPresenceColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const selectedConversationData = conversations.find(c => c.expert_id === selectedConversation);
  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[520px]">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start chatting with an expert!</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.expert_id}
                    onClick={() => setSelectedConversation(conversation.expert_id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                      selectedConversation === conversation.expert_id 
                        ? 'bg-muted border border-primary/20' 
                        : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.expert_image} />
                        <AvatarFallback>
                          {conversation.expert_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Circle 
                        className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background rounded-full ${getPresenceColor(getPresenceStatus(conversation))}`}
                        fill="currentColor"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">
                          {conversation.expert_name}
                        </p>
                        {conversation.last_message && (
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(conversation.last_message.created_at)}
                          </span>
                        )}
                      </div>
                      
                      {conversation.last_message && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message.content}
                        </p>
                      )}
                    </div>
                    
                    {conversation.unread_count > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        {selectedConversationData ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversationData.expert_image} />
                      <AvatarFallback>
                        {selectedConversationData.expert_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Circle 
                      className={`absolute -bottom-1 -right-1 h-3 w-3 border-2 border-background rounded-full ${getPresenceColor(getPresenceStatus(selectedConversationData))}`}
                      fill="currentColor"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">{selectedConversationData.expert_name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {getPresenceStatus(selectedConversationData)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStartCall?.(selectedConversation!, 'audio')}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStartCall?.(selectedConversation!, 'video')}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {conversationMessages.map((message, index) => {
                    const isOwn = message.sender_id === userProfile?.id;
                    const showAvatar = index === 0 || 
                      conversationMessages[index - 1]?.sender_id !== message.sender_id;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className={`${showAvatar ? 'visible' : 'invisible'}`}>
                          <Avatar className="h-8 w-8">
                            {isOwn ? (
                              <AvatarFallback>
                                {userProfile?.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            ) : (
                              <>
                                <AvatarImage src={selectedConversationData.expert_image} />
                                <AvatarFallback>
                                  {selectedConversationData.expert_name.charAt(0)}
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                        </div>
                        
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
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sendingMessage}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || sendingMessage}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default MessagingInterface;