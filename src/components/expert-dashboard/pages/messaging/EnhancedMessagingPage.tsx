
import React, { useState } from 'react';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';

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

const EnhancedMessagingPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      <div className="w-1/3">
        <ConversationList
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
        />
      </div>
      <div className="flex-1">
        {selectedConversation ? (
          <div className="h-full bg-white rounded-lg border">
            <MessageThread
              clientId={selectedConversation.id}
              clientName={selectedConversation.clientName}
              clientAvatar={selectedConversation.clientAvatar}
              isOnline={selectedConversation.isOnline}
              lastSeen={selectedConversation.lastMessageTime}
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
  );
};

export default EnhancedMessagingPage;
