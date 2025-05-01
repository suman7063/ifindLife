
import React from 'react';
import { SidebarHeader } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

interface AdminSidebarHeaderProps {
  username: string;
  onToggle: () => void;
}

const AdminSidebarHeaderComponent: React.FC<AdminSidebarHeaderProps> = ({
  username,
  onToggle
}) => {
  return (
    <SidebarHeader className="border-b border-border">
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-sidebar-foreground">iFindLife Admin</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={onToggle}
          >
            <LayoutDashboard className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Logged in as: {username}
        </div>
      </div>
    </SidebarHeader>
  );
};

export default AdminSidebarHeaderComponent;
