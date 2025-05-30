
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
  // Fix boolean conversion for proper authentication check
  const isUserAuthenticated = Boolean(isAuthenticated);
  const isExpertAuthenticated = Boolean(hasExpertProfile);
  
  // User is authenticated if they have ANY valid authentication
  const hasAnyAuthentication = isUserAuthenticated || isExpertAuthenticated;
  
  console.log('LoginDropdown auth check:', {
    isAuthenticated,
    hasExpertProfile,
    isUserAuthenticated,
    isExpertAuthenticated,
    hasAnyAuthentication,
    shouldShowLogin: !hasAnyAuthentication
  });
  
  // If user has any authentication, don't show login dropdown
  if (hasAnyAuthentication) {
    console.log('LoginDropdown: User has authentication, not showing dropdown');
    return null;
  }
  
  console.log('LoginDropdown: No authentication found, showing login dropdown');
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium">
            Login
          </NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[220px] bg-white border border-gray-200 shadow-lg z-50">
            <ul className="grid w-full gap-1 p-2">
              <li>
                <NavigationMenuLink 
                  asChild
                  className="block w-full p-3 text-sm rounded-md text-left hover:bg-gray-100 transition-colors"
                >
                  <Link to="/user-login" className="flex items-center">
                    User Login
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink 
                  asChild
                  className="block w-full p-3 text-sm rounded-md text-left hover:bg-gray-100 transition-colors"
                >
                  <Link to="/expert-login" className="flex items-center">
                    Expert Login
                  </Link>
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
