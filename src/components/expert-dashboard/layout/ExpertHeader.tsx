
import React from 'react';
import { Bell, HelpCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

interface ExpertHeaderProps {
  expert?: any; // Made expert optional to fix the build error
}

const ExpertHeader: React.FC<ExpertHeaderProps> = ({ expert }) => {
  const { logout, expertProfile } = useAuth();
  const navigate = useNavigate();
  
  // Use expertProfile if expert is not provided
  const displayExpert = expert || expertProfile;
  
  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        toast.success('Successfully logged out');
        navigate('/');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-semibold text-ifind-teal">Expert Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {displayExpert?.name || 'Expert'}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Bell size={20} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-600">
          <HelpCircle size={20} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Settings size={20} />
        </Button>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={displayExpert?.avatar_url} alt={displayExpert?.name} />
            <AvatarFallback className="bg-ifind-teal text-white">
              {displayExpert?.name?.charAt(0) || 'E'}
            </AvatarFallback>
          </Avatar>
          
          <Button variant="outline" onClick={handleLogout} size="sm">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ExpertHeader;
