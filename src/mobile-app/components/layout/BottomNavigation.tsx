import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/mobile-app/app/' },
  { icon: Grid3X3, label: 'Services', path: '/mobile-app/app/services' },
  { icon: Users, label: 'Experts', path: '/mobile-app/app/experts' },
  { icon: User, label: 'Profile', path: '/mobile-app/app/profile' },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-white border-t border-border px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/mobile-app/app/' && location.pathname.startsWith(item.path));
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 h-auto ${
                isActive 
                  ? 'text-ifind-aqua' 
                  : 'text-muted-foreground hover:text-ifind-aqua'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};