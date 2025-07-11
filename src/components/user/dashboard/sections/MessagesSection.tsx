
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import UserMessaging from './UserMessaging';

interface MessagesSectionProps {
  user?: UserProfile;
}

const MessagesSection: React.FC<MessagesSectionProps> = ({ user }) => {
  return <UserMessaging />;
};

export default MessagesSection;
