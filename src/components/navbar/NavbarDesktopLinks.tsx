
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavbarUserMenu from './NavbarUserMenu';
import NavbarExpertMenu from './NavbarExpertMenu';
import { UserProfile } from '@/types/supabase/user';
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ProgramsMenu, ServicesMenu, SupportMenu, LoginDropdown } from './menu';

interface NavbarDesktopLinksProps {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
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
          {/* Programs Dropdown */}
          <ProgramsMenu />

          {/* Services Dropdown */}
          <ServicesMenu />

          {/* Support Dropdown */}
          <SupportMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      {/* Login or User Menu */}
      {hasExpertProfile ? (
        <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />
      ) : isAuthenticated && sessionType === 'user' ? (
        <NavbarUserMenu currentUser={currentUser} onLogout={userLogout} isLoggingOut={isLoggingOut} />
      ) : (
        <LoginDropdown 
          isAuthenticated={isAuthenticated} 
          hasExpertProfile={hasExpertProfile} 
        />
      )}
    </div>
  );
};

export default NavbarDesktopLinks;
