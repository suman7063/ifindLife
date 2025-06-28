
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavbarUserMenu from './NavbarUserMenu';

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

  // Get display name with better fallback logic
  const getDisplayName = () => {
    if (currentUser?.name) return currentUser.name;
    if (currentUser?.user_metadata?.full_name) return currentUser.user_metadata.full_name;
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'User';
  };

  // Get initials with improved logic
  const getInitials = () => {
    const name = getDisplayName();
    const words = name.split(' ').filter(word => word.length > 0);
    
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    } else if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  // Create enhanced user object for the menu
  const enhancedUser = currentUser ? {
    ...currentUser,
    displayName: getDisplayName(),
    initials: getInitials(),
    profile_picture: currentUser.profile_picture || currentUser.user_metadata?.avatar_url || ''
  } : {
    displayName: 'User',
    initials: 'U',
    profile_picture: '',
    email: ''
  };

  return (
    <NavbarUserMenu 
      currentUser={enhancedUser} 
      onLogout={onLogout}
      isLoggingOut={isLoggingOut}
    />
  );
};

export default NavbarUserAvatar;
