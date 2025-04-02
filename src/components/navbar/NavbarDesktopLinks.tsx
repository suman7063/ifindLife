
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
  userLogout: () => Promise<boolean>;
  expertLogout: () => Promise<boolean>;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  isLoggingOut: boolean;
}

const NavbarDesktopLinksDropdown: React.FC<{title: string}> = ({ title }) => {
  return (
    <div className="group relative">
      <Button variant="ghost" className="flex items-center gap-1">
        {title}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </Button>
      <div className="absolute left-0 top-full z-50 mt-1 hidden w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block">
        <div className="py-1">
          {title === "Programs" && (
            <>
              <Link to="/programs-for-wellness-seekers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Wellness Seekers</Link>
              <Link to="/programs-for-academic-institutes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Academic Institutes</Link>
              <Link to="/programs-for-business" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Business</Link>
            </>
          )}
          {title === "Services" && (
            <>
              <Link to="/services/therapy-sessions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Therapy Sessions</Link>
              <Link to="/services/guided-meditations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Guided Meditations</Link>
              <Link to="/services/mindful-listening" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mindful Listening</Link>
              <Link to="/services/offline-retreats" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Offline Retreats</Link>
              <Link to="/services/life-coaching" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Life Coaching</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

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
        <Link to="/experts">Experts</Link>
      </Button>
      <NavbarDesktopLinksDropdown title="Programs" />
      <NavbarDesktopLinksDropdown title="Services" />
      <Button variant="ghost" asChild>
        <Link to="/about">About</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/blog">Blog</Link>
      </Button>
      
      {hasExpertProfile ? (
        <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />
      ) : (
        <Button variant="ghost" asChild>
          <Link to="/expert-login" className="text-ifind-teal">
            <UserPlus className="h-4 w-4 mr-1" /> Expert Portal
          </Link>
        </Button>
      )}
      
      {isAuthenticated ? (
        <NavbarUserMenu currentUser={currentUser} onLogout={userLogout} isLoggingOut={isLoggingOut} />
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
