
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navigationItems } from './navigationConfig';
import SidebarNavItem from './SidebarNavItem';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';

const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUnifiedAuth();
  
  // Function to check if a path is active - improved logic
  const isActive = (path: string) => {
    if (path === "/expert-dashboard") {
      return location.pathname === "/expert-dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showLogoutSuccessToast();
      navigate('/expert-login');
    } catch (error) {
      console.error('Logout error:', error);
      showLogoutErrorToast();
    }
  };

  const handleItemClick = (href: string) => {
    if (href === '/logout') {
      handleLogout();
    } else {
      navigate(href);
    }
  };

  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="space-y-2">
        {navigationItems.map((item) => (
          <div
            key={item.href}
            onClick={() => handleItemClick(item.href)}
            className={`cursor-pointer ${item.href === '/logout' ? 'text-red-500 hover:text-red-600' : ''}`}
          >
            <SidebarNavItem
              href={item.href}
              icon={<item.icon className="h-5 w-5" />}
              isActive={isActive(item.href)}
              badge={item.badge}
            >
              {item.name}
            </SidebarNavItem>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SidebarNavigation;
