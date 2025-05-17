
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { adaptUserProfile } from '@/utils/adaptUserProfile';
import { getInitials } from '@/utils/getInitials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Wallet, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export interface UserDashboardLayoutProps {
  children: React.ReactNode;
  user: UserProfile | any;
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
  const adaptedUser = adaptUserProfile(user);
  const userName = adaptedUser?.name || adaptedUser?.email || 'User';
  const today = format(new Date(), 'EEEE, MMMM do');
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">{userName}</h1>
          <p className="text-muted-foreground">{adaptedUser?.email || ''}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm text-muted-foreground">{today}</p>
          <div className="flex items-center gap-2 mt-1">
            <Wallet className="h-4 w-4 text-green-600" />
            <p className="font-medium text-green-600">
              Balance: {adaptedUser?.currency || '₹'}{adaptedUser?.wallet_balance?.toFixed(2) || '0.00'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLogout}
            disabled={isLoggingOut}
            className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 -mr-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>

      {children}
    </div>
  );
};

export default UserDashboardLayout;
