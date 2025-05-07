
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MessageList from './messaging/MessageList';
import ConversationView from './messaging/ConversationView';

const MessagingTab: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
  
  const handleSelectConversation = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-lg font-medium">Conversations</h3>
          <MessageList 
            onSelectConversation={handleSelectConversation}
            selectedUserId={selectedUser?.id}
          />
        </div>
        
        <div className="md:col-span-2">
          <ConversationView 
            userId={selectedUser?.id || ''} 
            userName={selectedUser?.name || ''} 
          />
        </div>
      </div>
    </div>
  );
};

export default MessagingTab;
