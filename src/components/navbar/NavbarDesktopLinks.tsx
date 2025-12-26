
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import NavbarUserAvatar from './NavbarUserAvatar';
import NavbarExpertMenu from './NavbarExpertMenu';
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ProgramsMenu, ServicesMenu, SupportMenu, AssessmentMenu, ExpertsMenu } from './menu';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NavbarDesktopLinksProps {
  isAuthenticated: boolean;
  currentUser: any;
  hasExpertProfile: boolean;
  userLogout: () => Promise<boolean>;
  expertLogout: () => Promise<boolean>;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  isLoggingOut: boolean;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({
  isAuthenticated,
  currentUser,
  hasExpertProfile,
  userLogout,
  expertLogout,
  sessionType,
  isLoggingOut
}) => {
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, userProfile } = useSimpleAuth();
  const userId = user?.id || userProfile?.id;

  // Fetch unread count
  React.useEffect(() => {
    if (!userId || !isAuthenticated) return;

    const fetchUnreadCount = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (!error && data !== null) {
        setUnreadCount(data.length || 0);
      }
    };

    fetchUnreadCount();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`notification-count-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isAuthenticated]);

  // NavbarDesktopLinks render state

  // Determine authentication UI to show
  let authComponent;
  
  if (isAuthenticated) {
    if (sessionType === 'expert' && hasExpertProfile) {
      // Rendering expert menu
      authComponent = <NavbarExpertMenu onLogout={expertLogout} isLoggingOut={isLoggingOut} />;
    } else if (sessionType === 'user' || currentUser) {
      // Rendering user avatar for user session
      authComponent = <NavbarUserAvatar currentUser={currentUser || { name: 'User', email: '' }} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
    } else {
      // Authenticated but profile not loaded yet - show basic avatar
      // Rendering basic user avatar (profile loading)
      authComponent = <NavbarUserAvatar currentUser={{ name: 'User', email: '' }} onLogout={userLogout} isLoggingOut={isLoggingOut} />;
    }
  } else {
    // Rendering user login/signup link
    authComponent = (
      <Button asChild variant="outline">
        <Link to="/user-login">User login/Signup</Link>
      </Button>
    );
  }

  // Final auth component decision made

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Button variant="ghost" asChild className="text-gray-700 hover:text-gray-900 font-medium">
        <Link to="/">Home</Link>
      </Button>
      
      <NavigationMenu>
        <NavigationMenuList>
          <ServicesMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      <NavigationMenu>
        <NavigationMenuList>
          <AssessmentMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      <NavigationMenu>
        <NavigationMenuList>
          <ProgramsMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      <NavigationMenu>
        <NavigationMenuList>
          <ExpertsMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      <Button variant="ghost" asChild className="text-gray-700 hover:text-gray-900 font-medium">
        <Link to="/about">About Us</Link>
      </Button>
      
      <NavigationMenu>
        <NavigationMenuList>
          <SupportMenu />
        </NavigationMenuList>
      </NavigationMenu>
      
      {isAuthenticated && (
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-700 hover:text-gray-900"
          onClick={() => setNotificationDrawerOpen(true)}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      )}
      
      {authComponent}
      
      {isAuthenticated && (
        <NotificationDrawer
          open={notificationDrawerOpen}
          onOpenChange={setNotificationDrawerOpen}
          unreadCount={unreadCount}
        />
      )}
    </div>
  );
};

export default NavbarDesktopLinks;
