
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
              <a 
                href="https://learn.ifindlife.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Wellness Seeker
              </a>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/programs-for-academic-institutes" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Academic Institute
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/programs-for-business" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Business
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default ProgramsMenu;
