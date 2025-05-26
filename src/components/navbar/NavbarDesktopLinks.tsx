
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavbarUserAvatar from './NavbarUserAvatar';
import NavbarExpertMenu from './NavbarExpertMenu';
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ProgramsMenu, ServicesMenu, SupportMenu, LoginDropdown } from './menu';

interface NavbarDesktopLinksProps {
  isAuthenticated: boolean;
  currentUser: any;
  hasExpertProfile: boolean;
  userLogout: () => Promise<boolean>;
  expertLogout: () => Promise<boolean>;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  isLoggingOut: boolean;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({
  isAuthenticated,
  currentUser,
  hasExpertProfile,
  userLogout,
  expertLogout,
  sessionType,
  isLoggingOut
}) => {
  console.log('NavbarDesktopLinks render state:', {
    isAuthenticated,
    currentUser: !!currentUser,
    hasExpertProfile,
    sessionType
  });
  
  return (
    <div className="hidden md:flex items-center space-x-1">
      <Button variant="ghost" asChild>
        <Link to="/">Home</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/about">About</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/experts">Experts</Link>
      </Button>
      
      <NavigationMenu>
        <NavigationMenuList>
          <ProgramsMenu />
          <ServicesMenu />
          <SupportMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      {/* Show appropriate authentication UI based on state */}
      {hasExpertProfile ? (
        <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />
      ) : isAuthenticated && currentUser ? (
        <NavbarUserAvatar 
          currentUser={currentUser} 
          onLogout={userLogout} 
          isLoggingOut={isLoggingOut} 
        />
      ) : (
        <LoginDropdown 
          isAuthenticated={isAuthenticated} 
          hasExpertProfile={hasExpertProfile} 
        />
      )}
    </div>
  );
};

export default NavbarDesktopLinks;
