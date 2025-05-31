
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Pin, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const conversations: Conversation[] = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      clientAvatar: '/lovable-uploads/avatar1.jpg',
      lastMessage: 'Thank you for the session yesterday. I feel much better!',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
      isArchived: false
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      clientAvatar: '/lovable-uploads/avatar2.jpg',
      lastMessage: 'Can we reschedule our appointment for next week?',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 1,
      isOnline: false,
      isPinned: false,
      isArchived: false
    },
    {
      id: '3',
      clientName: 'Emily Davis',
      clientAvatar: '/lovable-uploads/avatar3.jpg',
      lastMessage: 'The breathing exercises are working great!',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      isOnline: true,
      isPinned: false,
      isArchived: false
    },
    {
      id: '4',
      clientName: 'Robert Wilson',
      clientAvatar: '/lovable-uploads/avatar4.jpg',
      lastMessage: 'See you in our next session.',
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      isArchived: true
    }
  ];

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
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
