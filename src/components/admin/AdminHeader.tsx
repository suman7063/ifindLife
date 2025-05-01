import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// This component is no longer used in the admin dashboard layout
// But we keep it for backward compatibility with other parts of the app
interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-ifind-teal text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">iFindLife Admin</h1>
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
