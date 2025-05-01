
import React from 'react';
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';

interface AdminSidebarFooterProps {
  onLogout: () => void;
}

const AdminSidebarFooterComponent: React.FC<AdminSidebarFooterProps> = ({
  onLogout
}) => {
  return (
    <SidebarFooter className="border-t border-sidebar-border p-2">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLogout}
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
