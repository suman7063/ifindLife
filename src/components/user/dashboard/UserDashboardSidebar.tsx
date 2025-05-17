
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { toast } from 'sonner';

interface UserDashboardSidebarProps {
  user: UserProfile | null;
  onLogout?: () => Promise<boolean>;
  isLoggingOut?: boolean;
  className?: string;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({ 
  user,
  onLogout,
  isLoggingOut = false,
  className
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // Add debug logging to see if user data is available
  console.log('UserDashboardSidebar rendering with user:', user?.name);
  
  const handleLogout = async () => {
    if (onLogout) {
      const success = await onLogout();
      if (success) {
        console.log('Sidebar: Logout successful, redirecting to home');
      }
    }
  };

  const handleHelpClick = () => {
    toast.info('Help section is coming soon!');
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
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
            to="/user-dashboard/settings" 
            active={currentPath === '/user-dashboard/settings'}
            icon={<Settings className="mr-2 h-4 w-4" />}
            label="Settings"
          />
          
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleHelpClick}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
        </div>
      </ScrollArea>
      
      <Separator />
      
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
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
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, active, icon, label }) => {
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
