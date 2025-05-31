
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExternalLink, LayoutDashboard, LogOut } from 'lucide-react';
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';
import { useNavigate } from 'react-router-dom';

const ExpertHeader: React.FC = () => {
  const { expert, logout } = useUnifiedAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
          {/* Double the logo size */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
              alt="iFindLife" 
              className="h-28 transform scale-150 origin-left" 
            />
          </Link>
          <div className="border-l h-8 mx-2"></div>
          <h2 className="text-xl font-semibold">Expert Dashboard</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Expert Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={expert?.profile_picture || ''} 
                    alt={expert?.name || 'Expert'} 
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
                  iFindLife Website
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
