
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, LogOut, Wallet } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/getInitials';

interface MobileMenuFooterProps {
  isAuthenticated: boolean;
  hasExpertProfile: boolean;
  currentUser?: any;
  handleLogout: () => void;
  isLoggingOut: boolean;
  getDashboardLink: () => string;
}

const MobileMenuFooter: React.FC<MobileMenuFooterProps> = ({
  isAuthenticated,
  hasExpertProfile,
  currentUser,
  handleLogout,
  isLoggingOut,
  getDashboardLink
}) => {
  console.log('MobileMenuFooter state:', {
    isAuthenticated,
    hasExpertProfile,
    currentUser: !!currentUser
  });

  // If user is authenticated, show user info and logout
  if (isAuthenticated || hasExpertProfile) {
    const userName = currentUser?.name || '';
    const userEmail = currentUser?.email || '';
    const profilePicture = currentUser?.profile_picture || currentUser?.profilePicture || '';
    const walletBalance = currentUser?.wallet_balance || 0;
    const currency = currentUser?.currency || '₹';

    return (
      <div className="mt-auto pt-4">
        <Separator className="mb-4" />
        
        {/* User Info */}
        {currentUser && (
          <div className="flex items-center space-x-3 px-2 py-3 mb-4 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profilePicture} alt={userName || 'User'} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName ? getInitials(userName) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              {!hasExpertProfile && (
                <div className="flex items-center mt-1 text-xs text-green-600 font-medium">
                  <Wallet className="h-3 w-3 mr-1" />
                  {currency}{walletBalance.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to={getDashboardLink()}>
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    );
  }

  // If not authenticated, show login buttons
  return (
    <div className="mt-auto pt-4">
      <Separator className="mb-4" />
      <div className="space-y-2">
        <Button variant="default" className="w-full" asChild>
          <Link to="/user-login">User login/Signup</Link>
        </Button>
      </div>
    </div>
  );
};

export default MobileMenuFooter;
