
import React, { useMemo, memo } from 'react';
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
  isLoading?: boolean;
}

const NavbarDesktopLinksComponent: React.FC<NavbarDesktopLinksProps> = ({
  isAuthenticated,
  currentUser,
  hasExpertProfile,
  userLogout,
  expertLogout,
  sessionType,
  isLoggingOut,
  isLoading = false
}) => {
  // Get enhanced unified auth state for more accurate authentication checks
  const enhancedAuth = useEnhancedUnifiedAuth();

  // Memoize auth state to prevent unnecessary re-renders
  const authState = useMemo(() => {
    const isUserAuthenticated = Boolean(isAuthenticated && !isLoading);
    const isExpertAuthenticated = Boolean(enhancedAuth.sessionType === 'expert' && enhancedAuth.expert && !isLoading);
    const isAdminAuthenticated = Boolean(enhancedAuth.sessionType === 'admin' && enhancedAuth.admin && !isLoading);
    const hasUserData = Boolean(currentUser);

    return {
      isUserAuthenticated,
      isExpertAuthenticated,
      isAdminAuthenticated,
      hasUserData,
      isLoading: isLoading || enhancedAuth.isLoading
    };
  }, [isAuthenticated, isLoading, enhancedAuth.sessionType, enhancedAuth.expert, enhancedAuth.admin, enhancedAuth.isLoading, currentUser]);

  // Enhanced logging for debugging
  console.log('NavbarDesktopLinks optimized render with auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    hasCurrentUser: Boolean(currentUser),
    hasExpertProfile: Boolean(hasExpertProfile),
    sessionType,
    isLoggingOut,
    isLoading,
    // Enhanced auth state
    enhancedIsAuthenticated: Boolean(enhancedAuth.isAuthenticated),
    enhancedSessionType: enhancedAuth.sessionType,
    enhancedIsLoading: Boolean(enhancedAuth.isLoading),
    // Computed auth state
    computedAuthState: authState,
    currentUserEmail: currentUser?.email || 'null',
    timestamp: new Date().toISOString()
  });

  // Show loading state to prevent premature "no auth" flash
  if (authState.isLoading) {
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
        
        <div className="px-3 py-2 text-gray-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  // Memoize auth component determination
  const authComponent = useMemo(() => {
    if (authState.isExpertAuthenticated) {
      console.log('NavbarDesktopLinks: Showing expert menu for authenticated expert');
      return <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />;
    } else if (authState.isAdminAuthenticated || (authState.isUserAuthenticated && authState.hasUserData)) {
      console.log('NavbarDesktopLinks: Showing user avatar for authenticated user/admin');
      return <NavbarUserAvatar currentUser={currentUser} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
    } else {
      console.log('NavbarDesktopLinks: No authentication found, showing login dropdown');
      return <LoginDropdown 
        isAuthenticated={authState.isUserAuthenticated || authState.isExpertAuthenticated || authState.isAdminAuthenticated} 
        hasExpertProfile={authState.isExpertAuthenticated} 
      />;
    }
  }, [authState, expertLogout, isLoggingOut, userLogout, currentUser]);

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

// Export memoized component to prevent unnecessary re-renders
const NavbarDesktopLinks = memo(NavbarDesktopLinksComponent);

export default NavbarDesktopLinks;
