
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

const ServicesMenu = () => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Services</NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-[220px]">
        <ul className="grid w-full gap-1 p-2">
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md font-medium"
              >
                All Services
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/therapy" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md"
              >
                Therapy Sessions
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/meditation" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md"
              >
                Guided Meditations
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/listening" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md"
              >
                Heart2Heart Listening
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/retreats" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md"
              >
                Offline Retreats
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/coaching" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md"
              >
                Life Coaching
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default ServicesMenu;
