
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { toast } from 'sonner';

const SidebarLogout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useUnifiedAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/expert-login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="p-4 mt-auto">
      <Button
        variant="ghost"
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-5 w-5" />
        <span>Log Out</span>
      </Button>
    </div>
  );
};

export default SidebarLogout;
