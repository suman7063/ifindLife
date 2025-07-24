
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

const SupportMenu = () => {
  const handleLinkClick = () => {
    // Scroll to top when navigating
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

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
                onClick={handleLinkClick}
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
                onClick={handleLinkClick}
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
                onClick={handleLinkClick}
              >
                Blog
              </Link>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/referral-program" 
                className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
                onClick={handleLinkClick}
              >
                Referral Program
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default SupportMenu;
