
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface ExpertImageProps {
  profilePicture?: string;
  name?: string;
  className?: string;
}

const ExpertImage: React.FC<ExpertImageProps> = ({ profilePicture, name, className }) => {
  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'EA';

  return (
    <Avatar className={className || "h-10 w-10"}>
      <AvatarImage src={profilePicture || ''} alt={name || 'Expert'} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

export default ExpertImage;
