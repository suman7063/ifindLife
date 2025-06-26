
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavbarUserAvatar from './NavbarUserAvatar';
import NavbarExpertMenu from './NavbarExpertMenu';
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ProgramsMenu, ServicesMenu, SupportMenu, LoginDropdown, AssessmentMenu } from './menu';

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
  console.log('NavbarDesktopLinks render with simplified auth state:', {
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
  const isExpertAuthenticated = Boolean(sessionType === 'expert' && hasExpertProfile);
  const hasUserData = Boolean(currentUser);

  // Determine which auth UI to show with priority logic
  let authComponent;
  if (isExpertAuthenticated) {
    console.log('NavbarDesktopLinks: Showing expert menu for authenticated expert');
    authComponent = <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />;
  } else if (isUserAuthenticated && hasUserData) {
    console.log('NavbarDesktopLinks: Showing user avatar for authenticated user');
    authComponent = <NavbarUserAvatar currentUser={currentUser} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
  } else {
    console.log('NavbarDesktopLinks: No authentication found, showing login dropdown');
    authComponent = <LoginDropdown 
      isAuthenticated={isUserAuthenticated || isExpertAuthenticated} 
      hasExpertProfile={isExpertAuthenticated} 
    />;
  }

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Button variant="ghost" asChild className="text-gray-700 hover:text-gray-900 font-medium">
        <Link to="/">Home</Link>
      </Button>
      
      <NavigationMenu>
        <NavigationMenuList>
          <ServicesMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      <NavigationMenu>
        <NavigationMenuList>
          <AssessmentMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      <NavigationMenu>
        <NavigationMenuList>
          <ProgramsMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      <Button variant="ghost" asChild className="text-gray-700 hover:text-gray-900 font-medium">
        <Link to="/experts">Experts</Link>
      </Button>
      
      <Button variant="ghost" asChild className="text-gray-700 hover:text-gray-900 font-medium">
        <Link to="/about">About Us</Link>
      </Button>
      
      <NavigationMenu>
        <NavigationMenuList>
          <SupportMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      {authComponent}
    </div>
  );
};

export default NavbarDesktopLinks;
