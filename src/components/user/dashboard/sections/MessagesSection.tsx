
import React from 'react';
import { UserProfile } from '@/types/database/unified';

interface MessagesSectionProps {
  user?: UserProfile;
}

const MessagesSection: React.FC<MessagesSectionProps> = ({ user }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
      <p className="text-muted-foreground mb-6">Manage your conversations</p>
      
      {/* Placeholder content */}
      <div className="bg-card border rounded-lg shadow p-8 text-center">
        <p className="text-lg mb-4">You have no messages yet.</p>
        <p className="text-muted-foreground">
          When you connect with experts, your conversations will appear here.
        </p>
      </div>
    </div>
  );
};

export default MessagesSection;
