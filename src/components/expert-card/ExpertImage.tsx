
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/getInitials';

export interface ExpertImageProps {
  profilePicture?: string;
  name?: string;
  className?: string;
}

const ExpertImage: React.FC<ExpertImageProps> = ({ profilePicture, name, className }) => {
  const initials = getInitials(name || '');

  return (
    <Avatar className={className || "h-10 w-10"}>
      <AvatarImage src={profilePicture || ''} alt={name || 'Expert'} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default ExpertImage;
