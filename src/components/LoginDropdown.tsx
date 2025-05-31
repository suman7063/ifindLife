
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useAuth } from '@/contexts/auth/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';

const LoginDropdown: React.FC = () => {
  const { isAuthenticated, isLoading, logout, role, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      showLogoutSuccessToast();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      showLogoutErrorToast();
    }
  };

  // Show appropriate loading state
  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  // If user is authenticated, show profile menu
  if (isAuthenticated) {
    const displayName = userProfile?.name || 'User';
    const dashboardLink = role === 'expert' ? '/expert-dashboard' : '/user-dashboard';
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{displayName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link to={dashboardLink}>Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Not authenticated - show login/signup buttons
  return (
    <div className="flex gap-2">
      <Link to="/user-login">
        <Button variant="outline" size="sm">Login</Button>
      </Link>
      <Link to="/user-signup">
        <Button variant="default" size="sm">Sign Up</Button>
      </Link>
    </div>
  );
};

export default LoginDropdown;
