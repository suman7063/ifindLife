
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Heart, 
  CreditCard, 
  Settings,
  BarChart3 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Overview',
    href: '/user-dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Programs',
    href: '/user-dashboard/programs',
    icon: BookOpen,
  },
  {
    name: 'Bookings',
    href: '/user-dashboard/bookings',
    icon: Calendar,
  },
  {
    name: 'Favorites',
    href: '/user-dashboard/favorites',
    icon: Heart,
  },
  {
    name: 'Progress',
    href: '/user-dashboard/progress',
    icon: BarChart3,
  },
  {
    name: 'Billing',
    href: '/user-dashboard/billing',
    icon: CreditCard,
  },
  {
    name: 'Settings',
    href: '/user-dashboard/settings',
    icon: Settings,
  },
];

const UserDashboardSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/user-dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ifind-teal text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default UserDashboardSidebar;
