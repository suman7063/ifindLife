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
  { icon: Users, label: 'Experts', path: '/mobile-app/app/experts' },
  { icon: Grid3X3, label: 'Services', path: '/mobile-app/app/services' },
  { icon: User, label: 'Profile', path: '/mobile-app/app/profile' },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50 pb-safe">
      <div className="max-w-sm mx-auto flex items-center justify-around px-4 py-2 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/mobile-app/app/' && location.pathname.startsWith(item.path));
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              aria-label={`Navigate to ${item.label}`}
              className={`flex flex-col items-center gap-1 p-2 h-auto focus-visible:ring-2 focus-visible:ring-ifind-teal rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-ifind-aqua' 
                  : 'text-muted-foreground hover:text-ifind-aqua'
              }`}
            >
              <item.icon className={`h-5 w-5 transition-all duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};