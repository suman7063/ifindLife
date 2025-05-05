
import React from 'react';
import { Sidebar, SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar';
import { 
  User, 
  Home, 
  Settings, 
  CalendarDays, 
  Heart, 
  LogOut, 
  CreditCard, 
  Bookmark,
  UserPlus 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { UserProfile } from '@/types/supabase/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UserDashboardSidebarProps {
  user: UserProfile | null;
  onLogout: () => Promise<boolean>;
  isLoggingOut: boolean;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({
  user,
  onLogout,
  isLoggingOut
}) => {
  return (
    <Sidebar>
      <div className="px-4 py-6 flex-1">
        <div className="flex items-center gap-3 mb-8">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profile_picture || ''} alt={user?.name || 'User'} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <h2 className="text-lg font-semibold truncate">{user?.name || 'User'}</h2>
            <p className="text-sm text-muted-foreground truncate">{user?.email || 'Loading...'}</p>
          </div>
        </div>
        
        <SidebarMenu>
          <SidebarMenuButton asChild icon={<Home className="h-5 w-5" />}>
            <NavLink to="/user-dashboard" end={true} className={({isActive}) => isActive ? 'font-semibold text-primary' : ''}>
              Dashboard
            </NavLink>
          </SidebarMenuButton>
          
          <SidebarMenuButton asChild icon={<CalendarDays className="h-5 w-5" />}>
            <NavLink to="/user-dashboard/appointments" className={({isActive}) => isActive ? 'font-semibold text-primary' : ''}>
              Appointments
            </NavLink>
          </SidebarMenuButton>
          
          <SidebarMenuButton asChild icon={<CreditCard className="h-5 w-5" />}>
            <NavLink to="/user-dashboard/wallet" className={({isActive}) => isActive ? 'font-semibold text-primary' : ''}>
              Wallet
            </NavLink>
          </SidebarMenuButton>
          
          <SidebarMenuButton asChild icon={<Bookmark className="h-5 w-5" />}>
            <NavLink to="/user-dashboard/purchases" className={({isActive}) => isActive ? 'font-semibold text-primary' : ''}>
              Purchases
            </NavLink>
          </SidebarMenuButton>
          
          <SidebarMenuButton asChild icon={<Heart className="h-5 w-5" />}>
            <NavLink to="/user-dashboard/favorites" className={({isActive}) => isActive ? 'font-semibold text-primary' : ''}>
              Favorites
            </NavLink>
          </SidebarMenuButton>

          <SidebarMenuButton asChild icon={<UserPlus className="h-5 w-5" />}>
            <NavLink to="/user-dashboard/referrals" className={({isActive}) => isActive ? 'font-semibold text-primary' : ''}>
              Referrals
            </NavLink>
          </SidebarMenuButton>
          
          <SidebarMenuButton asChild icon={<Settings className="h-5 w-5" />}>
            <NavLink to="/user-dashboard/settings" className={({isActive}) => isActive ? 'font-semibold text-primary' : ''}>
              Settings
            </NavLink>
          </SidebarMenuButton>
          
          <SidebarMenuButton asChild icon={<User className="h-5 w-5" />}>
            <NavLink to="/user-dashboard/profile" className={({isActive}) => isActive ? 'font-semibold text-primary' : ''}>
              Profile
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenu>
      </div>
      
      <div className="px-4 py-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2" 
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </Button>
      </div>
    </Sidebar>
  );
};

export default UserDashboardSidebar;
