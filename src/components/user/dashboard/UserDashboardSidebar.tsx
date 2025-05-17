
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
  HelpCircle
} from 'lucide-react';

export interface UserDashboardSidebarProps {
  user: UserProfile;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({ user }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto hidden md:block">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profile_picture || ''} alt={user?.name || 'User'} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{user?.name || 'User'}</h3>
            <p className="text-sm text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
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
            href="/user-dashboard/favorites" 
            icon={<Heart className="h-5 w-5" />} 
            label="Favorites" 
            isActive={isActive('/user-dashboard/favorites')} 
          />
          <SidebarItem 
            href="/user-dashboard/programs" 
            icon={<BookOpen className="h-5 w-5" />} 
            label="My Programs" 
            isActive={isActive('/user-dashboard/programs')} 
          />
          <SidebarItem 
            href="/user-dashboard/messages" 
            icon={<MessageSquare className="h-5 w-5" />} 
            label="Messages" 
            isActive={isActive('/user-dashboard/messages')} 
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
