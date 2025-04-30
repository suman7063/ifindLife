
import React from 'react';
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
  UserCog
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
        <SidebarInset className="p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
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
              isActive={activeTab === 'experts'} 
              onClick={() => onTabChange('experts')}
            >
              <Users className="h-4 w-4" />
              <span>Experts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'expertApprovals'} 
              onClick={() => onTabChange('expertApprovals')}
            >
              <CheckSquare className="h-4 w-4" />
              <span>Expert Approvals</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'services'} 
              onClick={() => onTabChange('services')}
            >
              <Briefcase className="h-4 w-4" />
              <span>Services</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'herosection'} 
              onClick={() => onTabChange('herosection')}
            >
              <FileText className="h-4 w-4" />
              <span>Hero Section</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'testimonials'} 
              onClick={() => onTabChange('testimonials')}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Testimonials</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'programs'} 
              onClick={() => onTabChange('programs')}
            >
              <Calendar className="h-4 w-4" />
              <span>Programs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'sessions'} 
              onClick={() => onTabChange('sessions')}
            >
              <LifeBuoy className="h-4 w-4" />
              <span>Sessions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'referrals'} 
              onClick={() => onTabChange('referrals')}
            >
              <Users className="h-4 w-4" />
              <span>Referrals</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'blog'} 
              onClick={() => onTabChange('blog')}
            >
              <FileText className="h-4 w-4" />
              <span>Blog</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={activeTab === 'contact'} 
              onClick={() => onTabChange('contact')}
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
