
import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, User, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";
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
    <div className="hidden md:flex items-center space-x-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
              For Individuals
            </NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[320px] p-4">
              <div className="grid gap-4">
                <Link to="/services" className="block p-3 hover:bg-accent rounded-md">
                  <div className="font-medium mb-1">Our Services</div>
                  <p className="text-sm text-muted-foreground">Browse our therapy and wellness services</p>
                </Link>
                <Link to="/mental-health-assessment" className="block p-3 hover:bg-accent rounded-md">
                  <div className="font-medium mb-1">Mental Health Assessment</div>
                  <p className="text-sm text-muted-foreground">Take our free mental health assessment</p>
                </Link>
                <Link to="/programs-for-wellness-seekers" className="block p-3 hover:bg-accent rounded-md">
                  <div className="font-medium mb-1">Wellness Programs</div>
                  <p className="text-sm text-muted-foreground">Explore our wellness programs</p>
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
              For Organizations
            </NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[320px] p-4">
              <div className="grid gap-4">
                <Link to="/programs-for-business" className="block p-3 hover:bg-accent rounded-md">
                  <div className="font-medium mb-1">For Businesses</div>
                  <p className="text-sm text-muted-foreground">Corporate wellness solutions</p>
                </Link>
                <Link to="/programs-for-academic-institutes" className="block p-3 hover:bg-accent rounded-md">
                  <div className="font-medium mb-1">For Academic Institutes</div>
                  <p className="text-sm text-muted-foreground">Support for students and staff</p>
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
              Resources
            </NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[320px] p-4">
              <div className="grid gap-4">
                <Link to="/blog" className="block p-3 hover:bg-accent rounded-md">
                  <div className="font-medium mb-1">Blog</div>
                  <p className="text-sm text-muted-foreground">Mental health insights and tips</p>
                </Link>
                <Link to="/about" className="block p-3 hover:bg-accent rounded-md">
                  <div className="font-medium mb-1">About Us</div>
                  <p className="text-sm text-muted-foreground">Learn about our mission and team</p>
                </Link>
                <Link to="/contact" className="block p-3 hover:bg-accent rounded-md">
                  <div className="font-medium mb-1">Contact</div>
                  <p className="text-sm text-muted-foreground">Get in touch with us</p>
                </Link>
                <Link to="/faqs" className="block p-3 hover:bg-accent rounded-md">
                  <div className="font-medium mb-1">FAQs</div>
                  <p className="text-sm text-muted-foreground">Common questions answered</p>
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {hasExpertProfile ? (
        <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />
      ) : isAuthenticated ? (
        <NavbarUserMenu currentUser={currentUser} onLogout={userLogout} isLoggingOut={isLoggingOut} />
      ) : (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/user-login">
              <User className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link to="/user-login?register=true">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NavbarDesktopLinks;
