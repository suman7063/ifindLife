
import React, { useState } from 'react';
import MessageList from '@/components/messaging/MessageList';
import MessageThread from '@/components/messaging/MessageThread';
import useMessaging from '@/hooks/messaging';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

const MessagingTab: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const { sendMessage } = useMessaging();
  const { expert } = useSimpleAuth();

  const handleSelectConversation = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

  const handleSendMessage = async (message: string) => {
    if (!expert?.auth_id || !selectedUserId) return;
    // Call sendMessage with two arguments (recipientId and message)
    await sendMessage(selectedUserId, message);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <MessageList 
            onSelectConversation={handleSelectConversation}
            selectedUserId={selectedUserId}
            userId={expert?.auth_id || ''} 
          />
        </div>
        <div className="md:w-2/3">
          {selectedUserId ? (
            <MessageThread
              userId={expert?.auth_id || ''}
              recipientId={selectedUserId}
              recipientName={selectedUserName}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingTab;
