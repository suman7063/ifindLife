
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile,
  CheckCheck,
  Clock
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

const EnhancedMessagingSystem: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      participantId: 'user1',
      participantName: 'Sarah Johnson',
      participantAvatar: '/lovable-uploads/avatar1.jpg',
      lastMessage: 'Thank you for the session today, it was really helpful!',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: 'm1',
          senderId: 'user1',
          content: 'Hi Dr. Smith, I wanted to follow up on our session yesterday.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'read',
          type: 'text'
        },
        {
          id: 'm2',
          senderId: 'expert',
          content: 'Hello Sarah! Of course, I\'m glad to hear from you. How are you feeling today?',
          timestamp: new Date(Date.now() - 90 * 60 * 1000),
          status: 'read',
          type: 'text'
        },
        {
          id: 'm3',
          senderId: 'user1',
          content: 'Thank you for the session today, it was really helpful!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: 'delivered',
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      participantId: 'user2',
      participantName: 'Michael Chen',
      participantAvatar: '/lovable-uploads/avatar2.jpg',
      lastMessage: 'Can we reschedule tomorrow\'s appointment?',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: false,
      messages: [
        {
          id: 'm4',
          senderId: 'user2',
          content: 'Can we reschedule tomorrow\'s appointment?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'delivered',
          type: 'text'
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'expert',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: new Date()
            }
          : conv
      )
    );

    setSelectedConversation(prev =>
      prev ? { ...prev, messages: [...prev.messages, message] } : null
    );

    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg border overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.participantAvatar} />
                      <AvatarFallback>
                        {conversation.participantName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.participantName}</h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedConversation.participantAvatar} />
                    <AvatarFallback>
                      {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedConversation.participantName}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedConversation.isOnline ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Session</DropdownMenuItem>
                    <DropdownMenuItem>Block User</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'expert' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.senderId === 'expert'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${
                        message.senderId === 'expert' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className={`text-xs ${
                          message.senderId === 'expert' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                        {message.senderId === 'expert' && getMessageStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="border-none bg-transparent focus-visible:ring-0 px-0"
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} size="icon" className="rounded-full">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMessagingSystem;
