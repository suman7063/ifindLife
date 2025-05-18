
import React from 'react';
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarFooterProps {
  onLogout: () => void;
}

const AdminSidebarFooterComponent: React.FC<AdminSidebarFooterProps> = ({
  onLogout
}) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      toast.info('Logging out...');
      await onLogout();
      navigate('/logout', { state: { userType: 'admin' } });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };
  
  return (
    <SidebarFooter className="border-t border-sidebar-border p-2">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
        <ModeToggle />
      </div>
    </SidebarFooter>
  );
};

export default AdminSidebarFooterComponent;
