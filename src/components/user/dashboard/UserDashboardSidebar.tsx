
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
  History
} from 'lucide-react';
import { format } from 'date-fns';

export interface UserDashboardSidebarProps {
  user: UserProfile;
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
  
  const isActive = (path: string) => {
    return location.pathname === path;
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
              <AvatarImage src={user?.profile_picture || ''} alt={user?.name || 'User'} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user?.name || 'User'}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
            </div>
          </div>
          
          {/* Wallet balance and date */}
          <div className="mt-2 text-sm">
            <div className="flex items-center text-green-600 font-medium">
              <Wallet className="h-4 w-4 mr-2" />
              Balance: {user?.currency || '$'}{user?.wallet_balance?.toFixed(2) || '0.00'}
            </div>
            <div className="text-muted-foreground mt-1">{today}</div>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem 
            href="/user-dashboard" 
            icon={<Home className="h-5 w-5" />} 
            label="Dashboard" 
            isActive={isActive('/user-dashboard')} 
          />
          <SidebarItem 
            href="/user-dashboard/profile" 
            icon={<User2 className="h-5 w-5" />} 
            label="My Profile" 
            isActive={isActive('/user-dashboard/profile')} 
          />
          <SidebarItem 
            href="/user-dashboard/wallet" 
            icon={<Wallet className="h-5 w-5" />} 
            label="Wallet" 
            isActive={isActive('/user-dashboard/wallet')} 
          />
          <SidebarItem 
            href="/user-dashboard/programs" 
            icon={<BookOpen className="h-5 w-5" />} 
            label="My Programs" 
            isActive={isActive('/user-dashboard/programs')} 
          />
          <SidebarItem 
            href="/user-dashboard/booking-history" 
            icon={<History className="h-5 w-5" />} 
            label="Booking History" 
            isActive={isActive('/user-dashboard/booking-history')} 
          />
          <SidebarItem 
            href="/user-dashboard/progress" 
            icon={<TrendingUp className="h-5 w-5" />} 
            label="Progress Tracking" 
            isActive={isActive('/user-dashboard/progress')} 
          />
          <SidebarItem 
            href="/user-dashboard/favorites" 
            icon={<Heart className="h-5 w-5" />} 
            label="Favorites" 
            isActive={isActive('/user-dashboard/favorites')} 
          />
          <SidebarItem 
            href="/user-dashboard/messages" 
            icon={<MessageSquare className="h-5 w-5" />} 
            label="Messages" 
            isActive={isActive('/user-dashboard/messages')} 
          />
          <SidebarItem 
            href="/user-dashboard/security" 
            icon={<Lock className="h-5 w-5" />} 
            label="Security" 
            isActive={isActive('/user-dashboard/security')} 
          />
          <SidebarItem 
            href="/user-dashboard/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            isActive={isActive('/user-dashboard/settings')} 
          />
          <SidebarItem 
            href="/user-dashboard/support" 
            icon={<HelpCircle className="h-5 w-5" />} 
            label="Support" 
            isActive={isActive('/user-dashboard/support')} 
          />

          {/* Add logout button if onLogout prop exists */}
          {onLogout && (
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
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

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label, isActive }) => {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start"
    >
      <Link to={href} className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </Link>
    </Button>
  );
};

export default UserDashboardSidebar;
