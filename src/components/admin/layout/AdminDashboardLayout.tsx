
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar 
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ModeToggle } from '@/components/ModeToggle';
import { useAuth } from '@/contexts/admin-auth';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Briefcase, 
  CheckSquare, 
  MessageSquare, 
  Calendar, 
  Shield, 
  LifeBuoy,
  LogOut,
  Award,
  Menu
} from 'lucide-react';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
}

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
    }
  };
  
  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/admin-login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          isSuperAdmin={isSuperAdmin}
          username={currentUser?.username || 'Admin'}
        />
        
        <SidebarInset className="relative">
          <div className="sticky top-0 z-10 flex items-center h-16 px-6 bg-background border-b">
            <SidebarTrigger className="mr-4" />
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
  );
};

// Helper function to get the title based on the active tab
const getTabTitle = (tab: string): string => {
  const titles: Record<string, string> = {
    overview: 'Dashboard Overview',
    experts: 'Experts Management',
    expertApprovals: 'Expert Approvals',
    services: 'Services Management',
    herosection: 'Hero Section Editor',
    testimonials: 'Testimonials Management',
    programs: 'Programs Management',
    sessions: 'Sessions Management',
    referrals: 'Referrals Management',
    blog: 'Blog Management',
    contact: 'Contact Submissions',
    adminUsers: 'Admin Users Management',
    settings: 'Admin Settings'
  };
  
  return titles[tab] || 'Admin Dashboard';
};

// This component handles the persistent sidebar restore button
const RestoreSidebarButton = () => {
  const { state, toggleSidebar } = useSidebar();
  
  if (state === 'expanded') {
    // Don't show the button when sidebar is already visible
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 left-4 z-50 rounded-full shadow-md border-slate-200"
      onClick={toggleSidebar}
      title="Show sidebar"
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Show sidebar</span>
    </Button>
  );
};

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
      <SidebarHeader className="border-b border-border">
        <div className="flex flex-col p-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-sidebar-foreground">iFindLife Admin</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={toggleSidebar}
            >
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Logged in as: {username}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'overview'} 
              onClick={() => onTabChange('overview')}
              tooltip="Dashboard Overview"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Overview</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'experts'} 
              onClick={() => onTabChange('experts')}
              tooltip="Manage Experts"
            >
              <Users className="h-4 w-4" />
              <span>Experts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'expertApprovals'} 
              onClick={() => onTabChange('expertApprovals')}
              tooltip="Expert Approval Requests"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Expert Approvals</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'services'} 
              onClick={() => onTabChange('services')}
              tooltip="Manage Services"
            >
              <Briefcase className="h-4 w-4" />
              <span>Services</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'herosection'} 
              onClick={() => onTabChange('herosection')}
              tooltip="Edit Hero Section"
            >
              <FileText className="h-4 w-4" />
              <span>Hero Section</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'testimonials'} 
              onClick={() => onTabChange('testimonials')}
              tooltip="Manage Testimonials"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Testimonials</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'programs'} 
              onClick={() => onTabChange('programs')}
              tooltip="Manage Programs"
            >
              <Calendar className="h-4 w-4" />
              <span>Programs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'sessions'} 
              onClick={() => onTabChange('sessions')}
              tooltip="Manage Sessions"
            >
              <LifeBuoy className="h-4 w-4" />
              <span>Sessions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'referrals'} 
              onClick={() => onTabChange('referrals')}
              tooltip="Manage Referrals"
            >
              <Award className="h-4 w-4" />
              <span>Referrals</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'blog'} 
              onClick={() => onTabChange('blog')}
              tooltip="Manage Blog Content"
            >
              <FileText className="h-4 w-4" />
              <span>Blog</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'contact'} 
              onClick={() => onTabChange('contact')}
              tooltip="View Contact Submissions"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Contact Submissions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isSuperAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === 'adminUsers'} 
                onClick={() => onTabChange('adminUsers')}
                tooltip="Manage Admin Users"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'settings'} 
              onClick={() => onTabChange('settings')}
              tooltip="Admin Settings"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

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
    </Sidebar>
  );
};

export default AdminDashboardLayout;
