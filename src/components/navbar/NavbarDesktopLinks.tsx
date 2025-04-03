
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const NavbarDesktopLinks = () => {
  const location = useLocation();
  
  // Helper to check if a path is currently active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              isActive('/') && "bg-muted text-primary"
            )}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className={isActive('/programs') ? "bg-muted text-primary" : ""}>
            Programs
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid grid-cols-1 gap-3 p-4 w-[220px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/programs-for-wellness" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">For Wellness Seekers</div>
                    <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
                      Personal mental health programs
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/programs-for-academic-institutes" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">For Academic Institutes</div>
                    <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
                      Programs for schools and colleges
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/programs-for-business" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">For Businesses</div>
                    <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
                      Corporate wellness solutions
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/services">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              isActive('/services') && "bg-muted text-primary"
            )}>
              Services
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/experts">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              isActive('/experts') && "bg-muted text-primary"
            )}>
              Experts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/mental-health-assessment">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              isActive('/mental-health-assessment') && "bg-muted text-primary"
            )}>
              Assessment
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={
            isActive('/contact') || isActive('/faq') || isActive('/about') 
              ? "bg-muted text-primary" 
              : ""
          }>
            Support
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid grid-cols-1 gap-3 p-4 w-[220px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/contact" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Contact Us</div>
                    <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
                      Get in touch with our team
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/faq" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">FAQ</div>
                    <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
                      Frequently asked questions
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/about" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">About Us</div>
                    <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
                      Learn about our mission
                    </p>
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

export default NavbarDesktopLinks;
