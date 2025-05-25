
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
                className="block w-full p-2 text-sm hover:bg-accent rounded-md font-medium text-left"
              >
                All Services
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/therapy-sessions" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Therapy Sessions
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/guided-meditations" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Guided Meditations
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/mindful-listening" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Heart2Heart Listening
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/offline-retreats" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Offline Retreats
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services/life-coaching" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
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
