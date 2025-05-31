
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Search, Send, Phone, Video } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const MessagingPage = () => {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [messageInput, setMessageInput] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      lastMessage: 'Thank you for the session today. It was really helpful.',
      timestamp: '2 hours ago',
      unreadCount: 2,
      avatar: '/placeholder.svg',
      isOnline: true
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      lastMessage: 'Can we reschedule our appointment for next week?',
      timestamp: '1 day ago',
      unreadCount: 0,
      avatar: '/placeholder.svg',
      isOnline: false
    },
    {
      id: '3',
      clientName: 'Emma Davis',
      lastMessage: 'I have some questions about the exercises you recommended.',
      timestamp: '2 days ago',
      unreadCount: 1,
      avatar: '/placeholder.svg',
      isOnline: true
    }
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: '1',
      sender: 'client',
      content: 'Hi Dr. Smith, I wanted to follow up on our last session.',
      timestamp: '10:30 AM'
    },
    {
      id: '2',
      sender: 'expert',
      content: 'Hello Sarah! I\'m glad to hear from you. How have you been feeling since our last conversation?',
      timestamp: '10:35 AM'
    },
    {
      id: '3',
      sender: 'client',
      content: 'Much better actually. I\'ve been practicing the breathing exercises you taught me.',
      timestamp: '10:37 AM'
    },
    {
      id: '4',
      sender: 'expert',
      content: 'That\'s wonderful to hear! Consistency is key with those exercises. Have you noticed any particular situations where they\'ve been most helpful?',
      timestamp: '10:40 AM'
    },
    {
      id: '5',
      sender: 'client',
      content: 'Yes, especially during work meetings when I start feeling anxious. Thank you for the session today. It was really helpful.',
      timestamp: '2 hours ago'
    }
  ];

  const selectedClient = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending logic here
      setMessageInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search conversations..." className="pl-10 w-64" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Conversations
            </CardTitle>
            <CardDescription>Your client conversations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2 p-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id 
                        ? 'bg-primary/10 border-primary border' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} alt={conversation.clientName} />
                          <AvatarFallback>
                            {conversation.clientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate">{conversation.clientName}</h3>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedClient ? (
            <>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedClient.avatar} alt={selectedClient.clientName} />
                      <AvatarFallback>
                        {selectedClient.clientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedClient.clientName}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedClient.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'expert' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === 'expert'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'expert' ? 'text-primary-foreground/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagingPage;
