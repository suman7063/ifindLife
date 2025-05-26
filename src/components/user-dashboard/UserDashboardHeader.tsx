
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const UserDashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user profile from users table
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setUser(profile || { 
            name: session.user.user_metadata?.name || 'User',
            email: session.user.email 
          });
        }
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
      navigate('/user-login');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome back, {user?.name || user?.email || 'User'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">
              {user?.name || 'User'}
            </span>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UserDashboardHeader;
