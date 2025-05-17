
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/types/database/unified';
import { 
  Home, 
  Wallet, 
  CalendarDays, 
  MessageSquare, 
  Heart, 
  Settings, 
  HelpCircle,
  Users 
} from 'lucide-react';

interface UserDashboardSidebarProps {
  user: UserProfile | null;
  onLogout?: () => Promise<boolean> | void;
  isLoggingOut?: boolean;
  className?: string;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({ 
  user,
  className
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      <div className="p-4">
        <Link to="/user-dashboard" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profile_picture || ''} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{user?.name || 'User'}</span>
        </Link>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <SidebarLink 
            to="/user-dashboard" 
            active={currentPath === '/user-dashboard'}
            icon={<Home className="mr-2 h-4 w-4" />}
            label="Overview"
          />
          
          <SidebarLink 
            to="/user-dashboard/profile" 
            active={currentPath === '/user-dashboard/profile'}
            icon={<Settings className="mr-2 h-4 w-4" />}
            label="Profile Settings"
          />
          
          <SidebarLink 
            to="/user-dashboard/wallet" 
            active={currentPath === '/user-dashboard/wallet'}
            icon={<Wallet className="mr-2 h-4 w-4" />}
            label="Wallet"
          />
          
          <SidebarLink 
            to="/user-dashboard/appointments" 
            active={currentPath === '/user-dashboard/appointments'}
            icon={<CalendarDays className="mr-2 h-4 w-4" />}
            label="Appointments"
          />
          
          <SidebarLink 
            to="/user-dashboard/messages" 
            active={currentPath === '/user-dashboard/messages'}
            icon={<MessageSquare className="mr-2 h-4 w-4" />}
            label="Messages"
          />
          
          <SidebarLink 
            to="/user-dashboard/favorites" 
            active={currentPath === '/user-dashboard/favorites'}
            icon={<Heart className="mr-2 h-4 w-4" />}
            label="Favorites"
          />
          
          <SidebarLink 
            to="/user-dashboard/referrals" 
            active={currentPath === '/user-dashboard/referrals'}
            icon={<Users className="mr-2 h-4 w-4" />}
            label="Referrals"
          />
          
          <SidebarLink 
            to="/user-dashboard/security" 
            active={currentPath === '/user-dashboard/security'}
            icon={<Settings className="mr-2 h-4 w-4" />}
            label="Account Security"
          />
          
          <SidebarLink 
            to="/user-dashboard/help" 
            active={currentPath === '/user-dashboard/help'}
            icon={<HelpCircle className="mr-2 h-4 w-4" />}
            label="Help & Support"
          />
        </div>
      </ScrollArea>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, active, icon, label, onClick }) => {
  if (onClick) {
    return (
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start",
          active ? "bg-secondary" : "hover:bg-muted"
        )}
        onClick={onClick}
      >
        {icon}
        {label}
      </Button>
    );
  }
  
  return (
    <Button
      asChild
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start",
        active ? "bg-secondary" : "hover:bg-muted"
      )}
    >
      <Link to={to}>
        {icon}
        {label}
      </Link>
    </Button>
  );
};

export default UserDashboardSidebar;
