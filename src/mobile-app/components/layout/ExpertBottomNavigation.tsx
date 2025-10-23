import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, DollarSign, User } from 'lucide-react';

export const ExpertBottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/mobile-app/expert-app'
    },
    {
      icon: Calendar,
      label: 'Appointments',
      path: '/mobile-app/expert-app/appointments'
    },
    {
      icon: DollarSign,
      label: 'Earnings',
      path: '/mobile-app/expert-app/earnings'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/mobile-app/expert-app/profile'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/mobile-app/expert-app') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
      <div className="max-w-sm mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                active 
                  ? 'text-ifind-teal' 
                  : 'text-muted-foreground hover:text-ifind-charcoal'
              }`}
            >
              <Icon className={`h-6 w-6 mb-1 transition-all duration-200 ${
                active ? 'scale-110' : ''
              }`} />
              <span className={`text-xs font-medium ${
                active ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
