
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavbarUserAvatar from './NavbarUserAvatar';
import NavbarExpertMenu from './NavbarExpertMenu';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
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
  // Get unified auth state for more accurate authentication checks
  const unifiedAuth = useAuth();

  // Enhanced authentication detection with multiple indicators
  const isUserAuthenticated = React.useMemo(() => {
    console.log('🔒 NavbarDesktopLinks enhanced auth check:', {
      unifiedIsAuthenticated: Boolean(unifiedAuth.isAuthenticated),
      unifiedSessionType: unifiedAuth.sessionType,
      unifiedHasUser: Boolean(unifiedAuth.user),
      unifiedIsLoading: Boolean(unifiedAuth.isLoading),
      propsIsAuthenticated: Boolean(isAuthenticated),
      hasCurrentUser: Boolean(currentUser),
      hasExpertProfile: Boolean(hasExpertProfile),
      sessionType,
      localStorageSession: localStorage.getItem('sessionType')
    });
    
    // Check multiple authentication indicators
    const authIndicators = [
      unifiedAuth.isAuthenticated,
      Boolean(unifiedAuth.user),
      Boolean(unifiedAuth.sessionType),
      Boolean(localStorage.getItem('sessionType')),
      isAuthenticated,
      Boolean(currentUser)
    ];
    
    const authCount = authIndicators.filter(Boolean).length;
    console.log('🔒 Auth indicators count:', authCount, 'of', authIndicators.length);
    
    // Require at least 3 indicators for high confidence
    const isHighConfidenceAuth = authCount >= 3;
    
    // Special case: if unified auth shows authenticated with user and session type
    const isUnifiedAuthConfident = Boolean(
      unifiedAuth.isAuthenticated && 
      unifiedAuth.user && 
      unifiedAuth.sessionType
    );
    
    const finalDecision = isHighConfidenceAuth || isUnifiedAuthConfident;
    
    console.log('🔒 Final navbar auth decision:', {
      isHighConfidenceAuth,
      isUnifiedAuthConfident,
      finalDecision
    });
    
    return finalDecision;
  }, [
    unifiedAuth.isAuthenticated, 
    unifiedAuth.user, 
    unifiedAuth.sessionType, 
    unifiedAuth.isLoading,
    isAuthenticated, 
    currentUser, 
    hasExpertProfile, 
    sessionType
  ]);

  // Listen for auth state updates
  React.useEffect(() => {
    const handleAuthStateUpdate = (event: CustomEvent) => {
      console.log('🔄 Navbar received auth state update:', event.detail);
      // Force component re-render by updating a local timestamp
      // This will trigger the useMemo recalculation
    };

    window.addEventListener('auth-state-updated', handleAuthStateUpdate as EventListener);
    
    return () => {
      window.removeEventListener('auth-state-updated', handleAuthStateUpdate as EventListener);
    };
  }, []);

  // Don't show loading state here - let the parent handle it
  if (unifiedAuth.isLoading) {
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
        
        <div className="px-3 py-2 text-gray-500">Loading...</div>
      </div>
    );
  }

  // Determine which auth UI to show with enhanced priority logic
  let authComponent;
  const isExpertAuthenticated = Boolean(unifiedAuth.sessionType === 'expert' && unifiedAuth.expertProfile);
  
  if (isExpertAuthenticated) {
    console.log('NavbarDesktopLinks: Showing expert menu for authenticated expert');
    authComponent = <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />;
  } else if (isUserAuthenticated) {
    console.log('NavbarDesktopLinks: Showing user avatar for authenticated user');
    const userForAvatar = currentUser || {
      name: unifiedAuth.userProfile?.name || 'User',
      email: unifiedAuth.user?.email || '',
      id: unifiedAuth.user?.id || ''
    };
    authComponent = <NavbarUserAvatar currentUser={userForAvatar} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
  } else {
    console.log('NavbarDesktopLinks: No authentication found, showing login dropdown');
    authComponent = <LoginDropdown 
      isAuthenticated={false}
      hasExpertProfile={false} 
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
