
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavbarUserAvatar from './NavbarUserAvatar';
import NavbarExpertMenu from './NavbarExpertMenu';
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ProgramsMenu, ServicesMenu, SupportMenu, AssessmentMenu, ExpertsMenu } from './menu';

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
  // NavbarDesktopLinks render state

  // Determine authentication UI to show
  let authComponent;
  
  if (isAuthenticated) {
    if (sessionType === 'expert' && hasExpertProfile) {
      // Rendering expert menu
      authComponent = <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />;
    } else if (sessionType === 'user' || currentUser) {
      // Rendering user avatar for user session
      authComponent = <NavbarUserAvatar currentUser={currentUser || { name: 'User', email: '' }} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
    } else {
      // Authenticated but profile not loaded yet - show basic avatar
      // Rendering basic user avatar (profile loading)
      authComponent = <NavbarUserAvatar currentUser={{ name: 'User', email: '' }} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
    }
  } else {
    // Rendering user login/signup link
    authComponent = (
      <Button asChild variant="outline">
        <Link to="/user-login">User login/Signup</Link>
      </Button>
    );
  }

  // Final auth component decision made

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
      
      <NavigationMenu>
        <NavigationMenuList>
          <ExpertsMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
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
