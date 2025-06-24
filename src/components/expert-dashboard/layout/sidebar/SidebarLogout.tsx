
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SidebarLogout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('Sidebar logout initiated');
      
      const success = await logout();
      
      if (success) {
        toast.success('Logged out successfully');
        navigate('/expert-login');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
    >
      {isLoggingOut ? (
        <Loader2 className="h-5 w-5 mr-3 animate-spin" />
      ) : (
        <LogOut className="h-5 w-5 mr-3" />
      )}
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </Button>
  );
};

export default SidebarLogout;
