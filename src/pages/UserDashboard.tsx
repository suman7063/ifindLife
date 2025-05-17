
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '@/modules/authentication';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';
import UserDashboardSidebar from '@/components/user/dashboard/UserDashboardSidebar';
import DashboardContent from '@/components/user/dashboard/DashboardContent';

const UserDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log('UserDashboardPage: Checking authentication status...');
        const result = await authenticate.checkSession();
        
        if (!result.isAuthenticated) {
          console.log('UserDashboardPage: No active session found, redirecting to login');
          navigate('/user-login');
          return;
        }
        
        // In a real app, we would fetch user profile data from backend
        // For now, we'll create a simple user object
        setUser({
          id: 'user-1',
          name: 'John Doe',
          email: 'user@example.com',
          role: 'user',
          profile_picture: null
        });
      } catch (error) {
        console.error('UserDashboardPage: Error checking authentication:', error);
        toast.error('Authentication error. Please login again.');
        navigate('/user-login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('UserDashboardPage: Logging out...');
      const result = await authenticate.logout();
      
      if (result.success) {
        toast.success('Logged out successfully');
        navigate('/user-login', { replace: true });
        return true;
      } else {
        console.error('UserDashboardPage: Logout failed:', result.error);
        toast.error('Logout failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('UserDashboardPage: Error during logout:', error);
      toast.error('An error occurred during logout');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:block w-64 border-r border-border">
        <UserDashboardSidebar 
          user={user} 
          onLogout={handleLogout} 
          isLoggingOut={isLoading} 
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <DashboardContent currentUser={user} />
      </div>
    </div>
  );
};

export default UserDashboardPage;
