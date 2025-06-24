
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { LayoutDashboard, User, Calendar, DollarSign, Settings } from 'lucide-react';

const SidebarContent: React.FC = () => {
  const { expertProfile } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/expert-dashboard' },
    { icon: User, label: 'Profile', path: '/expert-dashboard/profile' },
    { icon: Calendar, label: 'Appointments', path: '/expert-dashboard/appointments' },
    { icon: DollarSign, label: 'Earnings', path: '/expert-dashboard/earnings' },
    { icon: Settings, label: 'Settings', path: '/expert-dashboard/settings' },
  ];

  return (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarContent;
