
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SidebarProvider, 
  SidebarInset,
} from "@/components/ui/sidebar";
import { toast } from 'sonner';
import { useSecureAdminAuth } from '@/contexts/SecureAdminAuth';
import AdminSidebar from './sidebar/AdminSidebar';
import RestoreSidebarButton from './sidebar/RestoreSidebarButton';
import { getTabTitle } from './utils/tabUtils';
import { getUserPermissions } from '../utils/permissionUtils';
import { Badge } from '@/components/ui/badge';

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
  const location = useLocation();
  const adminAuth = useSecureAdminAuth();
  const { logout } = adminAuth || {};
  const currentUser = adminAuth?.admin;
  
  const handleTabChange = (tab: string) => {
        
    if (setActiveTab) {
      setActiveTab(tab);
    }
    
    // Navigate to the appropriate route based on tab
    const newPath = `/admin/${tab}`;

    navigate(newPath);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Check if current user is a super admin (simplified for clean auth)
  const userIsSuperAdmin = currentUser?.role === 'superadmin';

  // Get user permissions for display (simplified for clean auth)
  const userPermissions = {};

  // Get current tab from URL if activeTab is not provided
  const currentTab = activeTab || location.pathname.split('/')[2] || 'overview';

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex-1 flex w-full"> 
          <AdminSidebar 
            activeTab={currentTab} 
            onTabChange={handleTabChange}
            onLogout={handleLogout}
            isSuperAdmin={userIsSuperAdmin}
            username={currentUser?.username || currentUser?.id || 'Admin'}
            userPermissions={userPermissions}
          />
          
          <SidebarInset className="relative w-full">
            <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-background border-b">
              <h2 className="text-xl font-semibold">
                {getTabTitle(currentTab)}
              </h2>
              
              {/* Display user role badge */}
              <div className="flex items-center gap-2">
                {userIsSuperAdmin ? (
                  <Badge variant="default" className="bg-green-600">Super Admin</Badge>
                ) : (
                  <Badge variant="outline">{currentUser?.role || 'Admin'}</Badge>
                )}
              </div>
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
