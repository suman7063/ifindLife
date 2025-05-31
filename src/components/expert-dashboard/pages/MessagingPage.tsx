
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConversationList from './messaging/ConversationList';
import EnhancedMessageThread from './messaging/EnhancedMessageThread';
import RealTimeNotifications from './messaging/RealTimeNotifications';

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

const MessagingPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleStartVideoCall = () => {
    // Integration with video calling system
    console.log('Starting video call with', selectedConversation?.clientName);
  };

  const handleStartVoiceCall = () => {
    // Integration with voice calling system
    console.log('Starting voice call with', selectedConversation?.clientName);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with your clients in real-time
          </p>
        </div>
        <RealTimeNotifications />
      </div>
      
      <Tabs defaultValue="conversations" className="w-full">
        <TabsList>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Messages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations">
          <div className="h-[calc(100vh-200px)] flex gap-6">
            <div className="w-1/3">
              <ConversationList
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
              />
            </div>
            <div className="flex-1">
              {selectedConversation ? (
                <div className="h-full bg-white rounded-lg border">
                  <EnhancedMessageThread
                    clientId={selectedConversation.id}
                    clientName={selectedConversation.clientName}
                    clientAvatar={selectedConversation.clientAvatar}
                    isOnline={selectedConversation.isOnline}
                    lastSeen={selectedConversation.lastMessageTime}
                    onStartVideoCall={handleStartVideoCall}
                    onStartVoiceCall={handleStartVoiceCall}
                  />
                </div>
              ) : (
                <div className="h-full bg-white rounded-lg border flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p>Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-lg font-medium mb-2">Scheduled Messages</h3>
            <p>Schedule messages to be sent automatically</p>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-lg font-medium mb-2">Message Templates</h3>
            <p>Create and manage reusable message templates</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagingPage;
