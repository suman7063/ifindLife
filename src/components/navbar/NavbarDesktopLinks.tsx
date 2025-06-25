
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
  const unifiedAuth = useAuth();

  console.log('NavbarDesktopLinks: Auth state comparison:', {
    unifiedAuth: {
      isAuthenticated: Boolean(unifiedAuth.isAuthenticated),
      sessionType: unifiedAuth.sessionType,
      hasUser: Boolean(unifiedAuth.user),
      hasUserProfile: Boolean(unifiedAuth.userProfile),
      hasExpertProfile: Boolean(unifiedAuth.expertProfile),
      userProfileName: unifiedAuth.userProfile?.name,
      expertProfileName: unifiedAuth.expertProfile?.name
    },
    props: {
      isAuthenticated: Boolean(isAuthenticated),
      sessionType,
      hasCurrentUser: Boolean(currentUser),
      hasExpertProfile: Boolean(hasExpertProfile)
    }
  });

  // Use unified auth as primary source
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

  // Determine authentication state and UI
  let authComponent;
  
  if (unifiedAuth.isAuthenticated && unifiedAuth.sessionType === 'expert' && unifiedAuth.expertProfile) {
    console.log('NavbarDesktopLinks: Showing expert menu');
    authComponent = <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />;
  } else if (unifiedAuth.isAuthenticated && unifiedAuth.userProfile) {
    console.log('NavbarDesktopLinks: Showing user avatar');
    
    // Create user data for avatar with proper fallbacks
    const userForAvatar = {
      name: unifiedAuth.userProfile.name || 'User',
      email: unifiedAuth.userProfile.email || unifiedAuth.user?.email || '',
      id: unifiedAuth.userProfile.id || unifiedAuth.user?.id || '',
      avatar_url: unifiedAuth.userProfile.profile_picture
    };
    
    console.log('NavbarDesktopLinks: User avatar data:', userForAvatar);
    
    authComponent = <NavbarUserAvatar currentUser={userForAvatar} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
  } else {
    console.log('NavbarDesktopLinks: Showing login dropdown');
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
