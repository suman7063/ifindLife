
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface ExpertHeaderProps {
  expert?: any; // Optional expert object
}

const ExpertHeader: React.FC<ExpertHeaderProps> = ({ expert: propExpert }) => {
  const { logout, expert } = useUnifiedAuth();
  const navigate = useNavigate();
  
  // Use provided expert or fallback to expert from unified auth context
  const displayExpert = propExpert || expert;
  
  // Generate proper initials from expert name
  const getInitials = (name?: string) => {
    if (!name) return 'E';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
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
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-semibold text-ifind-teal">Expert Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {displayExpert?.name || 'Expert'}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={displayExpert?.profile_picture} alt={displayExpert?.name} />
            <AvatarFallback className="bg-ifind-teal text-white">
              {getInitials(displayExpert?.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default ExpertHeader;
