
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/types/supabase/user';
import { adaptUserProfile } from '@/utils/adaptUserProfile';
import { getInitials } from '@/utils/getInitials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export interface UserDashboardLayoutProps {
  children: React.ReactNode;
  user: UserProfile | any; // More flexible typing to handle different user objects
  onLogout: () => void;
  isLoggingOut: boolean;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({
  children,
  user,
  onLogout,
  isLoggingOut = false
}) => {
  // Ensure the user profile has all required fields
  const adaptedUser = user ? adaptUserProfile(user) : { name: 'User', email: '' };
  const userName = adaptedUser?.name || user?.email || 'User';
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={adaptedUser?.profile_picture} alt={userName} />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{userName}</h1>
            <p className="text-muted-foreground">{adaptedUser?.email || user?.email || ''}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>

      {children}
    </div>
  );
};

export default UserDashboardLayout;
