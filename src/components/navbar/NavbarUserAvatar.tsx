
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import NavbarUserMenu from './NavbarUserMenu';
import { getInitials } from '@/utils/getInitials';

interface NavbarUserAvatarProps {
  currentUser: any;
  onLogout: () => Promise<boolean>;
  isLoggingOut: boolean;
}

const NavbarUserAvatar: React.FC<NavbarUserAvatarProps> = ({ 
  currentUser, 
  onLogout,
  isLoggingOut 
}) => {
  console.log('NavbarUserAvatar: Rendering with user:', {
    hasUser: !!currentUser,
    userName: currentUser?.name,
    userEmail: currentUser?.email
  });

  // Always show the avatar when this component is rendered
  // If no currentUser, show a default user
  const displayUser = currentUser || {
    name: 'User',
    email: '',
    profile_picture: ''
  };

  return (
    <NavbarUserMenu 
      currentUser={displayUser} 
      onLogout={onLogout}
      isLoggingOut={isLoggingOut}
    />
  );
};

export default NavbarUserAvatar;
