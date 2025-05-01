
import React from 'react';
import { 
  Sidebar, 
  SidebarContent,
  useSidebar
} from "@/components/ui/sidebar";

import { 
  AdminSidebarHeader, 
  AdminSidebarFooter,
  SidebarMenuItems 
} from './components';

interface AdminSidebarProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isSuperAdmin: boolean;
  username: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  onTabChange,
  onLogout,
  isSuperAdmin,
  username
}) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <AdminSidebarHeader 
        username={username}
        onToggle={toggleSidebar}
      />

      <SidebarContent>
        <SidebarMenuItems
          activeTab={activeTab}
          onTabChange={onTabChange}
          isSuperAdmin={isSuperAdmin}
        />
      </SidebarContent>

      <AdminSidebarFooter onLogout={onLogout} />
    </Sidebar>
  );
};

export default AdminSidebar;
