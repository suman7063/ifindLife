
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/types/supabase';
import { 
  Home, 
  Wallet, 
  CalendarDays, 
  MessageSquare, 
  Heart, 
  Settings, 
  HelpCircle,
  LogOut,
  Users 
} from 'lucide-react';

interface UserDashboardSidebarProps {
  user: UserProfile | null;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({ 
  user,
  onLogout,
  isLoggingOut = false
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="border-r h-full flex flex-col">
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
          <SidebarLink to="/user-dashboard" active={currentPath === '/user-dashboard'}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </SidebarLink>
          
          <SidebarLink to="/user-dashboard/wallet" active={currentPath === '/user-dashboard/wallet'}>
            <Wallet className="mr-2 h-4 w-4" />
            Wallet
          </SidebarLink>
          
          <SidebarLink to="/user-dashboard/appointments" active={currentPath === '/user-dashboard/appointments'}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Appointments
          </SidebarLink>
          
          <SidebarLink to="/user-dashboard/messages" active={currentPath === '/user-dashboard/messages'}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </SidebarLink>
          
          <SidebarLink to="/user-dashboard/favorites" active={currentPath === '/user-dashboard/favorites'}>
            <Heart className="mr-2 h-4 w-4" />
            Favorites
          </SidebarLink>
          
          <SidebarLink to="/user-dashboard/referrals" active={currentPath === '/user-dashboard/referrals'}>
            <Users className="mr-2 h-4 w-4" />
            Referrals
          </SidebarLink>
          
          <SidebarLink to="/user-dashboard/settings" active={currentPath === '/user-dashboard/settings'}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </SidebarLink>
          
          <SidebarLink to="/faq" active={currentPath === '/faq'}>
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </SidebarLink>
        </div>
      </ScrollArea>
      
      <Separator />
      
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </Button>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, active, children }) => {
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
        {children}
      </Link>
    </Button>
  );
};

export default UserDashboardSidebar;
