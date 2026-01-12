
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { useUnifiedServices } from '@/hooks/useUnifiedServices';

const ServicesMenu = () => {
  const { services, loading } = useUnifiedServices();
  const location = useLocation();
  const isServicesPage = location.pathname === '/services';
  
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Services</NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-[220px]">
        <ul className="grid w-full gap-1 p-2">
          <li>
            <NavigationMenuLink asChild>
              <Link 
                to="/services" 
                className={`block w-full p-2 text-sm hover:bg-accent rounded-md text-left ${
                  isServicesPage ? 'bg-accent font-medium' : ''
                }`}
              >
                All Services
              </Link>
            </NavigationMenuLink>
          </li>
          {loading ? (
            <li className="p-2 text-sm text-muted-foreground">Loading...</li>
          ) : (
            services.map((service) => (
              <li key={service.id}>
                <NavigationMenuLink asChild>
                  <Link 
                    to={`/services/${service.slug}`} 
                    className="block w-full p-2 text-sm hover:bg-accent rounded-md text-left"
                  >
                    {service.name}
                  </Link>
                </NavigationMenuLink>
              </li>
            ))
          )}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default ServicesMenu;
