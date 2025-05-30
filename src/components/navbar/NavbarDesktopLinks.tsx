
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
  // Enhanced logging for debugging
  console.log('NavbarDesktopLinks render with enhanced state:', {
    isAuthenticated: Boolean(isAuthenticated),
    hasCurrentUser: Boolean(currentUser),
    hasExpertProfile: Boolean(hasExpertProfile),
    sessionType,
    isLoggingOut,
    currentUserEmail: currentUser?.email || 'null',
    timestamp: new Date().toISOString()
  });

  // Convert to proper booleans for reliable checking
  const isUserAuthenticated = Boolean(isAuthenticated);
  const isExpertAuthenticated = Boolean(hasExpertProfile);
  const hasUserData = Boolean(currentUser);
  
  // Wait for auth to finish loading if needed
  if (sessionType === undefined) {
    console.log('NavbarDesktopLinks: Session type undefined, showing loading state');
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
        
        <div className="px-3 py-2 text-gray-500">Loading...</div>
      </div>
    );
  }
  
  // Determine which auth UI to show with priority logic
  let authComponent;
  
  if (isExpertAuthenticated) {
    console.log('NavbarDesktopLinks: Showing expert menu for authenticated expert');
    authComponent = <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />;
  } else if (isUserAuthenticated && hasUserData) {
    console.log('NavbarDesktopLinks: Showing user avatar for authenticated user');
    authComponent = <NavbarUserAvatar 
      currentUser={currentUser} 
      onLogout={userLogout} 
      isLoggingOut={isLoggingOut} 
    />;
  } else {
    console.log('NavbarDesktopLinks: No authentication found, showing login dropdown');
    authComponent = <LoginDropdown 
      isAuthenticated={isUserAuthenticated} 
      hasExpertProfile={isExpertAuthenticated} 
    />;
  }
  
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
      
      {authComponent}
    </div>
  );
};

export default NavbarDesktopLinks;
