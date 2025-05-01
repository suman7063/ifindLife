
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
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
  Award
} from 'lucide-react';

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

export default AdminSidebar;
