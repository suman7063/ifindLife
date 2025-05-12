
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

const ServicesMenu = () => {
  const navigate = useNavigate();
  
  // Handle navigation with scroll to top
  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Services</NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-[220px]">
        <ul className="grid w-full gap-1 p-2">
          <li>
            <NavigationMenuLink asChild>
              <button 
                onClick={() => handleNavigation('/services')}
                className="block w-full p-2 text-sm hover:bg-accent rounded-md font-medium text-left"
              >
                All Services
              </button>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <button 
                onClick={() => handleNavigation('/services/mindful-listening')}
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Heart2Heart Listening Sessions
              </button>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <button 
                onClick={() => handleNavigation('/services/therapy-sessions')}
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Therapy Sessions
              </button>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <button
                onClick={() => handleNavigation('/services/guided-meditations')}
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Guided Meditations
              </button>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <button
                onClick={() => handleNavigation('/services/offline-retreats')}
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Offline Retreats
              </button>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <button
                onClick={() => handleNavigation('/services/life-coaching')}
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Life Coaching
              </button>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default ServicesMenu;
