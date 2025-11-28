
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExternalLink, LayoutDashboard, LogOut } from 'lucide-react';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useNavigate } from 'react-router-dom';

const ExpertHeader: React.FC = () => {
  const { expert, logout, refreshProfiles, user } = useSimpleAuth();
  const navigate = useNavigate();
  const [imageKey, setImageKey] = useState(0);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Listen for profile image updates
  useEffect(() => {
    const handleProfileUpdate = async (event: CustomEvent) => {
      console.log('ExpertHeader: Profile image update received', event.detail);
      if (user?.id) {
        await refreshProfiles(user.id);
        setImageKey(prev => prev + 1); // Force re-render
      }
    };

    window.addEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);

    return () => {
      window.removeEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);
    };
  }, [user?.id, refreshProfiles]);

  const handleLogout = async () => {
    try {
      await logout();
      showLogoutSuccessToast();
      navigate('/expert-login');
    } catch (error) {
      console.error('Logout error:', error);
      showLogoutErrorToast();
    }
  };

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Expert Dashboard</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Expert Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2">
                <Avatar className="h-8 w-8" key={imageKey}>
                  <AvatarImage 
                    src={expert?.profile_picture || expert?.profilePicture || ''} 
                    alt={expert?.name || 'Expert'}
                    key={`${expert?.profile_picture || expert?.profilePicture || ''}-${imageKey}`}
                  />
                  <AvatarFallback className="bg-primary text-white text-sm">
                    {getInitials(expert?.name || 'E')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:block">
                  {expert?.name || 'Expert'}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {expert?.name || 'Expert'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {expert?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center cursor-pointer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Main Website
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/expert-dashboard" className="flex items-center cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ExpertHeader;
