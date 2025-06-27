
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
  console.log('NavbarDesktopLinks detailed render state:', {
    isAuthenticated,
    sessionType,
    hasCurrentUser: !!currentUser,
    hasExpertProfile,
    userEmail: currentUser?.email,
    currentUserName: currentUser?.name,
    renderingDecision: 'about to decide what to render'
  });

  // Determine authentication UI to show
  let authComponent;
  
  if (isAuthenticated) {
    if (sessionType === 'expert' && hasExpertProfile) {
      console.log('NavbarDesktopLinks: Rendering expert menu');
      authComponent = <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />;
    } else if (sessionType === 'user' || currentUser) {
      console.log('NavbarDesktopLinks: Rendering user avatar for user session or existing currentUser');
      authComponent = <NavbarUserAvatar currentUser={currentUser || { name: 'User', email: '' }} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
    } else {
      // Authenticated but profile not loaded yet - show basic avatar
      console.log('NavbarDesktopLinks: Rendering basic user avatar (profile loading)');
      authComponent = <NavbarUserAvatar currentUser={{ name: 'User', email: '' }} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
    }
  } else {
    console.log('NavbarDesktopLinks: Rendering login dropdown - user not authenticated');
    authComponent = <LoginDropdown 
      isAuthenticated={false} 
      hasExpertProfile={false} 
    />;
  }

  console.log('NavbarDesktopLinks: Final auth component decision made, rendering navbar');

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
