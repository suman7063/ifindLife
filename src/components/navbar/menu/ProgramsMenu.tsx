
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

const ProgramsMenu = () => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Programs</NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-[220px]">
        <ul className="grid w-full gap-1 p-2">
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/programs" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md font-medium text-left"
              >
                All Programs
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/programs-for-business" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Programs for Business
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/issue-based-sessions" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Issue Based Sessions
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default ProgramsMenu;
