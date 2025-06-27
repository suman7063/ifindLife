
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
  // Enhanced auth state logging for debugging
  console.log('LoginDropdown: EXACT AUTH CONDITIONS ANALYSIS:', {
    isAuthenticated: Boolean(isAuthenticated),
    hasExpertProfile: Boolean(hasExpertProfile),
    authType: typeof isAuthenticated,
    expertType: typeof hasExpertProfile,
    // Log the EXACT condition that LoginDropdown uses
    exactCondition: Boolean(isAuthenticated) || Boolean(hasExpertProfile),
    individualChecks: {
      booleanAuth: Boolean(isAuthenticated),
      booleanExpert: Boolean(hasExpertProfile)
    },
    timestamp: new Date().toISOString()
  });

  // Check multiple authentication criteria - user has ANY valid authentication
  const hasAnyAuthentication = Boolean(isAuthenticated) || Boolean(hasExpertProfile);
  
  console.log('LoginDropdown: WORKING LOGIC BREAKDOWN:', { 
    hasAnyAuthentication,
    shouldShowLogin: !hasAnyAuthentication,
    finalDecision: hasAnyAuthentication ? 'HIDE_LOGIN' : 'SHOW_LOGIN',
    // This is the EXACT logic that works
    workingCondition: `Boolean(${isAuthenticated}) || Boolean(${hasExpertProfile}) = ${hasAnyAuthentication}`
  });
  
  // If user has any authentication, don't show login dropdown
  if (hasAnyAuthentication) {
    console.log('LoginDropdown: User has authentication, hiding login dropdown');
    return null;
  }
  
  console.log('LoginDropdown: No authentication found, showing login dropdown');
  
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
