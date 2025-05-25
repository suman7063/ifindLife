
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

const SupportMenu = () => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Support</NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-[220px]">
        <ul className="grid w-full gap-1 p-2">
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/contact" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Contact Us
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/faqs" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                FAQs
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/blog" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Blog
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/help" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
              >
                Help Center
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default SupportMenu;
