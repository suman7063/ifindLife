
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import UserDashboardSidebar from './UserDashboardSidebar';
import { Card } from '@/components/ui/card';
import {
  BellIcon,
  LogOutIcon,
  User2Icon,
  WalletIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UserDashboard: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    logout,
  } = useUserAuth();
  
  // Fix the handleLogout function to return a boolean Promise
  const handleLogout = async (): Promise<boolean> => {
    try {
      await logout();
      toast.success('Successfully logged out');
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
      return false;
    }
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
            <p>Please log in to access your dashboard.</p>
            <Button className="mt-4" asChild>
              <a href="/user-login">Login</a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.profile_picture || ''} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{currentUser.name}</h2>
              <div className="text-sm text-muted-foreground">
                {format(new Date(), 'MMMM d, yyyy')}
              </div>
              <div className="text-sm font-medium">
                Wallet Balance: ${currentUser.wallet_balance?.toFixed(2) || '0.00'}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 -ml-2 mt-1 flex items-center gap-1"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <UserDashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
