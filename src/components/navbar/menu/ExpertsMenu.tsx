import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

const ExpertsMenu = () => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Experts</NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-[220px]">
        <ul className="grid w-full gap-1 p-2">
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/expert-login" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md font-medium text-left"
              >
                Sign in/Sign Up
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/find-right-expert" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Find the Right Expert
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default ExpertsMenu;