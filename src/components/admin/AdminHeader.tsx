
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  onLogout: () => void;
  toggleSidebar?: () => void;  // Added toggleSidebar as optional prop
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-ifind-teal text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {toggleSidebar && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-white/80" 
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">iFindLife Admin</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80"
            onClick={() => navigate('/')}
          >
            View Site
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-white/80"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
