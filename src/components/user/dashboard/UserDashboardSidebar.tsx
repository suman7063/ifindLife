
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserProfile } from '@/types/database/unified';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User2, 
  Wallet, 
  Heart, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  LogOut,
  Lock,
  Calendar,
  TrendingUp,
  History,
  Star
} from 'lucide-react';
import { format } from 'date-fns';

export interface UserDashboardSidebarProps {
  user?: UserProfile;
  onLogout?: () => Promise<boolean>;
  isLoggingOut?: boolean;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({ 
  user,
  onLogout,
  isLoggingOut = false
}) => {
  const location = useLocation();
  const today = format(new Date(), 'EEEE, MMMM do');
  
  // Get display name with fallbacks
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Get initials
  const getInitials = () => {
    const name = getDisplayName();
    const words = name.split(' ').filter(word => word.length > 0);
    
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    } else if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  // Navigation items with proper paths
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/user-dashboard', exact: true },
    { icon: User2, label: 'My Profile', path: '/user-dashboard/profile' },
    { icon: Wallet, label: 'Rewards', path: '/user-dashboard/wallet' },
    { icon: BookOpen, label: 'My Programs', path: '/user-dashboard/programs' },
    { icon: History, label: 'Booking History', path: '/user-dashboard/booking-history' },
    { icon: TrendingUp, label: 'Progress Tracking', path: '/user-dashboard/progress' },
    { icon: Heart, label: 'Favorites', path: '/user-dashboard/favorites' },
    { icon: Star, label: 'Reviews & Ratings', path: '/user-dashboard/reviews' },
    { icon: MessageSquare, label: 'Messages', path: '/user-dashboard/messages' },
    { icon: Lock, label: 'Security', path: '/user-dashboard/security' },
    { icon: Settings, label: 'Settings', path: '/user-dashboard/settings' },
    { icon: HelpCircle, label: 'Support', path: '/user-dashboard/support' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        {/* User profile section with wallet balance and date */}
        <div className="flex flex-col mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.profile_picture || ''} alt={getDisplayName()} />
              <AvatarFallback className="bg-purple-100 text-purple-700 text-lg font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{getDisplayName()}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
            </div>
          </div>
          
          {/* Reward balance and date */}
          <div className="mt-2 text-sm">
            <div className="flex items-center text-green-600 font-medium">
              <Wallet className="h-4 w-4 mr-2" />
              Reward Points: {user?.reward_points || 0}
            </div>
            <div className="text-muted-foreground mt-1">{today}</div>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.path, item.exact);
            
            return (
              <Button
                key={item.path}
                asChild
                variant={active ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link to={item.path} className="flex items-center">
                  <span className="mr-3">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}

          {/* Add logout button if onLogout prop exists */}
          {onLogout && (
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 mt-4"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </Button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default UserDashboardSidebar;
