
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavbarUserMenu from './NavbarUserMenu';
import NavbarExpertMenu from './NavbarExpertMenu';
import { UserProfile } from '@/types/supabase';

interface NavbarDesktopLinksProps {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  hasExpertProfile: boolean;
  userLogout: () => Promise<void>;
  expertLogout: () => Promise<void>;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({
  isAuthenticated,
  currentUser,
  hasExpertProfile,
  userLogout,
  expertLogout
}) => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <Button variant="ghost" asChild>
        <Link to="/">Home</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/experts">Experts</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/programs">Programs</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/about">About</Link>
      </Button>
      <Button variant="ghost">Blog</Button>
      
      {hasExpertProfile ? (
        <NavbarExpertMenu onLogout={expertLogout} />
      ) : (
        <Button variant="ghost" asChild>
          <Link to="/expert-login" className="text-ifind-teal">
            <UserPlus className="h-4 w-4 mr-1" /> Expert Portal
          </Link>
        </Button>
      )}
      
      {isAuthenticated ? (
        <NavbarUserMenu currentUser={currentUser} onLogout={userLogout} />
      ) : (
        <Button variant="ghost" asChild>
          <Link to="/user-login" className="text-ifind-teal">
            <User className="h-4 w-4 mr-1" /> Login
          </Link>
        </Button>
      )}
    </div>
  );
};

export default NavbarDesktopLinks;
