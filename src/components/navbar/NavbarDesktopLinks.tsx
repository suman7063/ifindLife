
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavbarUserMenu from './NavbarUserMenu';
import NavbarExpertMenu from './NavbarExpertMenu';
import { UserProfile } from '@/types/supabase';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

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
          <NavigationMenuItem>
            <NavigationMenuTrigger>Programs</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[220px]">
              <ul className="grid w-full gap-1 p-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/programs-for-wellness-seekers" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Wellness Seekers
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/programs-for-academic-institutes" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Academic Institutes
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/programs-for-business" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Business
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Services Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[220px]">
              <ul className="grid w-full gap-1 p-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/services" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md font-medium"
                    >
                      All Services
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/services/therapy-sessions" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Therapy Sessions
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/services/guided-meditations" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Guided Meditations
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/services/mindful-listening" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Mindful Listening
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/services/offline-retreats" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Offline Retreats
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/services/life-coaching" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Life Coaching
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Support Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Support</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[220px]">
              <ul className="grid w-full gap-1 p-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/contact" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Contact Us
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/faqs" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      FAQs
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/blog" 
                      className="block w-full p-2 text-sm hover:bg-accent rounded-md"
                    >
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
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

// Extracted Login dropdown component
const LoginDropdown: React.FC<{ 
  isAuthenticated: boolean; 
  hasExpertProfile: boolean; 
}> = ({ 
  isAuthenticated, 
  hasExpertProfile 
}) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Login</NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[220px]">
            <ul className="grid w-full gap-1 p-2">
              <li>
                <NavigationMenuLink 
                  asChild
                  className={cn(
                    "block w-full p-2 text-sm rounded-md",
                    hasExpertProfile 
                      ? "text-muted cursor-not-allowed" 
                      : "hover:bg-accent"
                  )}
                  onClick={(e) => hasExpertProfile && e.preventDefault()}
                >
                  <Link to="/user-login">User Login</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink 
                  asChild
                  className={cn(
                    "block w-full p-2 text-sm rounded-md",
                    isAuthenticated 
                      ? "text-muted cursor-not-allowed" 
                      : "hover:bg-accent"
                  )}
                  onClick={(e) => isAuthenticated && e.preventDefault()}
                >
                  <Link to="/expert-login">Expert Login</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarDesktopLinks;
