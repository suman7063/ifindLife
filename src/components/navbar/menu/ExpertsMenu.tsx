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
                to="/experts" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md font-medium text-left"
              >
                All Experts
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/experts/listening-volunteer" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Listening Volunteers
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/experts/listening-expert" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Listening Experts
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/experts/mindfulness-expert" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Mindfulness Experts
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/experts/life-coach" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Life Coaches
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/experts/spiritual-mentor" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Spiritual Mentors
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default ExpertsMenu;