
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import NavbarUserMenu from './NavbarUserMenu';
import { getInitials } from '@/utils/getInitials';

interface NavbarUserAvatarProps {
  currentUser: any; // Accept any profile type for flexibility
  onLogout: () => Promise<boolean>;
  isLoggingOut: boolean;
}

const NavbarUserAvatar: React.FC<NavbarUserAvatarProps> = ({ 
  currentUser, 
  onLogout,
  isLoggingOut 
}) => {
  if (!currentUser) {
    return null;
  }

  // Get profile picture from either format
  const profilePicture = currentUser.profile_picture || 
    currentUser.profilePicture || '';
  
  // Get name from either format
  const userName = currentUser.name || '';

  return (
    <NavbarUserMenu 
      currentUser={currentUser} 
      onLogout={onLogout}
      isLoggingOut={isLoggingOut}
    />
  );
};

export default NavbarUserAvatar;
