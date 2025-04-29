
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
              <li>
                <NavigationMenuLink 
                  asChild
                  className="block w-full p-2 text-sm rounded-md hover:bg-accent"
                >
                  <Link to="/admin-login">Admin Login</Link>
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
