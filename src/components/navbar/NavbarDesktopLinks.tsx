
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
  // Convert undefined values to proper booleans for reliable checking
  const isUserAuthenticated = Boolean(isAuthenticated);
  const isExpertAuthenticated = Boolean(hasExpertProfile);
  const hasUserData = Boolean(currentUser);
  
  console.log('NavbarDesktopLinks render state:', {
    isAuthenticated,
    isUserAuthenticated,
    currentUser: !!currentUser,
    hasExpertProfile,
    isExpertAuthenticated,
    sessionType,
    authTypes: {
      isAuthenticatedType: typeof isAuthenticated,
      hasExpertProfileType: typeof hasExpertProfile
    }
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
      {isExpertAuthenticated ? (
        <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />
      ) : isUserAuthenticated && hasUserData ? (
        <NavbarUserAvatar 
          currentUser={currentUser} 
          onLogout={userLogout} 
          isLoggingOut={isLoggingOut} 
        />
      ) : (
        <LoginDropdown 
          isAuthenticated={isUserAuthenticated} 
          hasExpertProfile={isExpertAuthenticated} 
        />
      )}
    </div>
  );
};

export default NavbarDesktopLinks;
