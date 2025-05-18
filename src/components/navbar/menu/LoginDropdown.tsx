
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

interface LoginDropdownProps { 
  isAuthenticated: boolean; 
  hasExpertProfile: boolean; 
}

const LoginDropdown: React.FC<LoginDropdownProps> = ({ 
  isAuthenticated, 
  hasExpertProfile 
}) => {
  // If user is authenticated in any way, don't show login dropdown
  if (isAuthenticated || hasExpertProfile) {
    return null;
  }
  
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
                  className="block w-full p-2 text-sm rounded-md text-left hover:bg-accent"
                >
                  <Link to="/user-login">User Login</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink 
                  asChild
                  className="block w-full p-2 text-sm rounded-md text-left hover:bg-accent"
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

export default LoginDropdown;
