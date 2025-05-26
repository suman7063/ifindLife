
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Heart, 
  CreditCard, 
  Settings,
  BarChart3,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UserDashboardSidebarProps {
  user?: any;
  onLogout?: () => Promise<boolean>;
  isLoggingOut?: boolean;
}

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

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({ 
  user, 
  onLogout, 
  isLoggingOut 
}) => {
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-sm">{user.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      )}

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
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      )}
    </aside>
  );
};

export default UserDashboardSidebar;
