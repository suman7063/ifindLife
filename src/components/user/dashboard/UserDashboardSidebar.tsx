
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { UserProfile } from '@/types/supabase/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import {
  Home,
  User,
  Wallet,
  Calendar,
  Star,
  MessageSquare,
  Award,
  LogOut
} from 'lucide-react';

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
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/user-dashboard',
    },
    {
      title: 'Profile',
      icon: User,
      path: '/user-dashboard/profile',
    },
    {
      title: 'Wallet',
      icon: Wallet,
      path: '/user-dashboard/wallet',
    },
    {
      title: 'Consultations',
      icon: Calendar,
      path: '/user-dashboard/consultations',
    },
    {
      title: 'Favorites',
      icon: Star,
      path: '/user-dashboard/favorites',
    },
    {
      title: 'Reviews',
      icon: MessageSquare,
      path: '/user-dashboard/reviews',
    },
    {
      title: 'Referrals',
      icon: Award,
      path: '/user-dashboard/referrals',
    },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="py-4">
        <div className="flex items-center px-2">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={user?.profile_picture || ''} alt={user?.name || 'User'} />
            <AvatarFallback>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{user?.name || 'User'}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={currentPath === item.path}
                tooltip={item.title}
              >
                <Link to={item.path}>
                  <item.icon className="mr-2" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className={cn(
            "flex w-full items-center gap-2 rounded-md p-2 text-left text-sm",
            "hover:bg-accent hover:text-accent-foreground transition-colors"
          )}
        >
          <LogOut size={18} />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserDashboardSidebar;
