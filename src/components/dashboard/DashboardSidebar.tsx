
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  Wallet, 
  Heart, 
  HelpCircle, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface DashboardSidebarProps {
  activeTab?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab }) => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.profile_picture} alt={userProfile?.name} />
            <AvatarFallback>{userProfile?.name ? getInitials(userProfile.name) : 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{userProfile?.name || 'User'}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">
              {userProfile?.email || ''}
            </span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <nav className="mt-2 flex-1 px-2 space-y-1">
          <Link to="/dashboard">
            <Button 
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
            >
              <Home className="mr-2 h-4 w-4" />
              Overview
            </Button>
          </Link>
          
          <Link to="/dashboard/appointments">
            <Button 
              variant={activeTab === 'appointments' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </Button>
          </Link>
          
          <Link to="/dashboard/messages">
            <Button 
              variant={activeTab === 'messages' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
          </Link>
          
          <Link to="/dashboard/wallet">
            <Button 
              variant={activeTab === 'wallet' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </Button>
          </Link>
          
          <Link to="/dashboard/favorites">
            <Button 
              variant={activeTab === 'favorites' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
            >
              <Heart className="mr-2 h-4 w-4" />
              Favorites
            </Button>
          </Link>
          
          <Link to="/dashboard/support">
            <Button 
              variant={activeTab === 'support' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Support
            </Button>
          </Link>
          
          <Link to="/dashboard/profile">
            <Button 
              variant={activeTab === 'profile' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
          
          <Link to="/dashboard/settings">
            <Button 
              variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>
      
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start text-gray-500"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
