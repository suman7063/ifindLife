
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  SidebarInset,
} from "@/components/ui/sidebar";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/admin-auth';
import AdminSidebar from './sidebar/AdminSidebar';
import RestoreSidebarButton from './sidebar/RestoreSidebarButton';
import { getTabTitle } from './utils/tabUtils';
import { AdminPermissions } from '@/contexts/admin-auth/types';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Main layout component for the admin dashboard
 */
const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ 
  children,
  activeTab,
  setActiveTab
}) => {
  const navigate = useNavigate();
  const { logout, isSuperAdmin, currentUser } = useAuth();
  
  const handleTabChange = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
      
      // Navigate to the appropriate route based on tab
      navigate(`/admin/${tab}`);
    }
  };
  
  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex-1 flex w-full pt-16"> {/* Added top padding to prevent header overlap */}
          <AdminSidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            onLogout={handleLogout}
            isSuperAdmin={isSuperAdmin}
            username={currentUser?.username || 'Admin'}
            userPermissions={currentUser?.permissions as Record<string, boolean>}
          />
          
          <SidebarInset className="relative">
            <div className="sticky top-0 z-10 flex items-center h-16 px-6 bg-background border-b">
              <h2 className="text-xl font-semibold">
                {getTabTitle(activeTab || 'overview')}
              </h2>
            </div>
            <div className="p-6">
              {children}
            </div>
          </SidebarInset>

          {/* Persistent toggle button that appears when sidebar is collapsed */}
          <RestoreSidebarButton />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboardLayout;
