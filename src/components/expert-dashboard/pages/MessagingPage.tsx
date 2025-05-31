
import React from 'react';
import EnhancedMessagingPage from './messaging/EnhancedMessagingPage';

const MessagingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with your clients in real-time
        </p>
      </div>
      
      <EnhancedMessagingPage />
    </div>
  );
};

export default MessagingPage;
