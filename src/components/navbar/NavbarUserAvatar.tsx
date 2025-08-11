
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
    userEmail: currentUser?.email,
    profilePicture: currentUser?.profile_picture
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
    // First check if we have a user name
    if (currentUser?.name) {
      const words = currentUser.name.split(' ').filter(word => word.length > 0);
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      } else if (words.length === 1 && words[0].length >= 2) {
        return words[0].slice(0, 2).toUpperCase();
      }
    }
    
    // Fallback to email if no name
    if (currentUser?.email) {
      const emailPrefix = currentUser.email.split('@')[0];
      const words = emailPrefix.split(/[._-]/).filter(word => word.length > 0);
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      } else if (words.length === 1 && words[0].length >= 2) {
        return words[0].slice(0, 2).toUpperCase();
      }
      return emailPrefix.slice(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  // Get profile picture with proper fallback
  const getProfilePicture = () => {
    // Check multiple possible profile picture fields
    return currentUser?.profile_picture || 
           currentUser?.profilePicture || 
           currentUser?.user_metadata?.avatar_url || 
           '';
  };

  // Create enhanced user object for the menu
  const enhancedUser = currentUser ? {
    ...currentUser,
    displayName: getDisplayName(),
    initials: getInitials(),
    profile_picture: getProfilePicture()
  } : {
    displayName: 'User',
    initials: 'U',
    profile_picture: '',
    email: ''
  };

  console.log('NavbarUserAvatar: Enhanced user data:', {
    displayName: enhancedUser.displayName,
    initials: enhancedUser.initials,
    profile_picture: enhancedUser.profile_picture
  });

  return (
    <NavbarUserMenu 
      currentUser={enhancedUser} 
      onLogout={onLogout}
      isLoggingOut={isLoggingOut}
    />
  );
};

export default NavbarUserAvatar;
