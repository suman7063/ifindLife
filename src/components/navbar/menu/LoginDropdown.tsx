
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
  console.log('LoginDropdown: Auth state check:', {
    isAuthenticated,
    hasExpertProfile,
    shouldShow: !isAuthenticated
  });

  // Only show login dropdown when user is NOT authenticated
  if (isAuthenticated) {
    console.log('LoginDropdown: User is authenticated, hiding login dropdown');
    return null;
  }
  
  console.log('LoginDropdown: User not authenticated, showing login dropdown');
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 font-medium">
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
