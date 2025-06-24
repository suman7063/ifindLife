
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavbarUserAvatar from './NavbarUserAvatar';
import NavbarExpertMenu from './NavbarExpertMenu';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
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
  // Get enhanced unified auth state for more accurate authentication checks
  const enhancedAuth = useEnhancedUnifiedAuth();

  // Enhanced logging for debugging
  console.log('NavbarDesktopLinks render with enhanced unified auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    hasCurrentUser: Boolean(currentUser),
    hasExpertProfile: Boolean(hasExpertProfile),
    sessionType,
    isLoggingOut,
    // Enhanced auth state
    enhancedIsAuthenticated: Boolean(enhancedAuth.isAuthenticated),
    enhancedSessionType: enhancedAuth.sessionType,
    enhancedIsLoading: Boolean(enhancedAuth.isLoading),
    enhancedHasExpert: Boolean(enhancedAuth.expert),
    enhancedHasAdmin: Boolean(enhancedAuth.admin),
    enhancedHasUser: Boolean(enhancedAuth.user),
    currentUserEmail: currentUser?.email || 'null',
    timestamp: new Date().toISOString()
  });

  // Convert to proper booleans for reliable checking
  const isUserAuthenticated = Boolean(isAuthenticated);
  const isExpertAuthenticated = Boolean(enhancedAuth.sessionType === 'expert' && enhancedAuth.expert);
  const isAdminAuthenticated = Boolean(enhancedAuth.sessionType === 'admin' && enhancedAuth.admin);
  const hasUserData = Boolean(currentUser);

  // Don't show loading state here - let the parent handle it
  if (enhancedAuth.isLoading) {
    return <div className="hidden md:flex items-center space-x-4">
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
        
        <div className="px-3 py-2 text-gray-500">Loading...</div>
      </div>;
  }

  // Determine which auth UI to show with priority logic
  let authComponent;
  if (isExpertAuthenticated) {
    console.log('NavbarDesktopLinks: Showing expert menu for authenticated expert');
    authComponent = <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />;
  } else if (isAdminAuthenticated || (isUserAuthenticated && hasUserData)) {
    console.log('NavbarDesktopLinks: Showing user avatar for authenticated user/admin');
    authComponent = <NavbarUserAvatar currentUser={currentUser} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
  } else {
    console.log('NavbarDesktopLinks: No authentication found, showing login dropdown');
    authComponent = <LoginDropdown 
      isAuthenticated={isUserAuthenticated || isExpertAuthenticated || isAdminAuthenticated} 
      hasExpertProfile={isExpertAuthenticated} 
    />;
  }

  return <div className="hidden md:flex items-center space-x-4">
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
    </div>;
};

export default NavbarDesktopLinks;
