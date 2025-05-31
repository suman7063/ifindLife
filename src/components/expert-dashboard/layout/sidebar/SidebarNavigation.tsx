
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigationItems } from './navigationConfig';
import SidebarNavItem from './SidebarNavItem';

const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  
  // Function to check if a path is active - improved logic
  const isActive = (path: string) => {
    if (path === "/expert/dashboard") {
      return location.pathname === "/expert/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="space-y-2">
        {navigationItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            href={item.href}
            icon={<item.icon className="h-5 w-5" />}
            isActive={isActive(item.href) && (item.href === "/expert/dashboard" ? location.pathname === "/expert/dashboard" : true)}
            badge={item.badge}
          >
            {item.label}
          </SidebarNavItem>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SidebarNavigation;
