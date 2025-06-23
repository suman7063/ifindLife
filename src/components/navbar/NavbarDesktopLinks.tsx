
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

  // FIXED: Ultra-stable memoization using only primitive values
  const authState = useMemo(() => {
    const isUserAuth = Boolean(isAuthenticated && !isLoading);
    const isExpertAuth = Boolean(enhancedAuth?.sessionType === 'expert' && enhancedAuth?.expert && !isLoading);
    const isAdminAuth = Boolean(enhancedAuth?.sessionType === 'admin' && enhancedAuth?.admin && !isLoading);
    const hasUser = Boolean(currentUser);
    const authLoading = Boolean(isLoading || enhancedAuth?.isLoading);

    return {
      isUserAuthenticated: isUserAuth,
      isExpertAuthenticated: isExpertAuth,
      isAdminAuthenticated: isAdminAuth,
      hasUserData: hasUser,
      isLoading: authLoading,
      sessionTypeValue: enhancedAuth?.sessionType || 'none'
    };
  }, [
    Boolean(isAuthenticated),
    Boolean(isLoading),
    enhancedAuth?.sessionType,
    Boolean(enhancedAuth?.expert),
    Boolean(enhancedAuth?.admin),
    Boolean(enhancedAuth?.isLoading),
    Boolean(currentUser)
  ]);

  // FIXED: Show loading state only briefly to prevent flicker
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

  // FIXED: Ultra-stable auth component determination
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
  }, [
    authState.isExpertAuthenticated,
    authState.isAdminAuthenticated,
    authState.isUserAuthenticated,
    authState.hasUserData,
    expertLogout,
    userLogout,
    isLoggingOut,
    currentUser
  ]);

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

// FIXED: Proper memoization with stable comparison
const NavbarDesktopLinks = memo(NavbarDesktopLinksComponent, (prevProps, nextProps) => {
  return (
    prevProps.isAuthenticated === nextProps.isAuthenticated &&
    prevProps.hasExpertProfile === nextProps.hasExpertProfile &&
    prevProps.sessionType === nextProps.sessionType &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.isLoggingOut === nextProps.isLoggingOut &&
    prevProps.currentUser?.email === nextProps.currentUser?.email
  );
});

export default NavbarDesktopLinks;
