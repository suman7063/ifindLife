
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface ExpertHeaderProps {
  expert?: any;
}

const ExpertHeader: React.FC<ExpertHeaderProps> = ({ expert: propExpert }) => {
  const { logout, expert } = useUnifiedAuth();
  const navigate = useNavigate();
  
  // Use provided expert or fallback to expert from unified auth context
  const displayExpert = propExpert || expert;
  
  // Generate proper initials from expert name - Fix Issue 2
  const getInitials = (name?: string) => {
    if (!name || typeof name !== 'string') return 'EX';
    
    const trimmedName = name.trim();
    if (!trimmedName) return 'EX';
    
    const nameParts = trimmedName.split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) return 'EX';
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
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
  
  const expertName = displayExpert?.name || displayExpert?.full_name || 'Expert';
  const expertEmail = displayExpert?.email || displayExpert?.contact_email || '';
  const expertInitials = getInitials(expertName);
  
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-semibold text-ifind-teal">Expert Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back, {expertName}</p>
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
          <div className="text-right text-sm hidden md:block">
            <p className="font-medium">{expertName}</p>
            {expertEmail && <p className="text-gray-500">{expertEmail}</p>}
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src={displayExpert?.profile_picture || displayExpert?.image_url} alt={expertName} />
            <AvatarFallback className="bg-ifind-teal text-white">
              {expertInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default ExpertHeader;
