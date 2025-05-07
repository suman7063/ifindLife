
import React from 'react';
import { SidebarMenu } from "@/components/ui/sidebar";
import AdminSidebarMenuItem from './SidebarMenuItem';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Calendar, 
  LifeBuoy, 
  Award, 
  Shield, 
  Settings,
  HelpCircle
} from 'lucide-react';

interface SidebarMenuItemsProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  isSuperAdmin: boolean;
  userPermissions?: Record<string, boolean>;
}

const SidebarMenuItems: React.FC<SidebarMenuItemsProps> = ({
  activeTab,
  onTabChange,
  isSuperAdmin,
  userPermissions = {}
}) => {
  // Define menu items with their properties and permission requirements
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      tooltip: 'Dashboard Overview',
      permission: null // Always visible
    },
    {
      id: 'experts',
      label: 'Experts',
      icon: Users,
      tooltip: 'Manage Experts',
      permission: 'experts'
    },
    {
      id: 'expertApprovals',
      label: 'Expert Approvals',
      icon: CheckSquare,
      tooltip: 'Expert Approval Requests',
      permission: 'expertApprovals'
    },
    {
      id: 'services',
      label: 'Services',
      icon: Briefcase,
      tooltip: 'Manage Services',
      permission: 'services'
    },
    {
      id: 'herosection',
      label: 'Hero Section',
      icon: FileText,
      tooltip: 'Edit Hero Section',
      permission: 'herosection'
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      icon: MessageSquare,
      tooltip: 'Manage Testimonials',
      permission: 'testimonials'
    },
    {
      id: 'programs',
      label: 'Programs',
      icon: Calendar,
      tooltip: 'Manage Programs',
      permission: 'programs'
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: LifeBuoy,
      tooltip: 'Manage Sessions',
      permission: 'sessions'
    },
    {
      id: 'referrals',
      label: 'Referrals',
      icon: Award,
      tooltip: 'Manage Referrals',
      permission: 'referrals'
    },
    {
      id: 'help',
      label: 'Help Tickets',
      icon: HelpCircle,
      tooltip: 'Manage Help Tickets',
      permission: 'contact'
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: FileText,
      tooltip: 'Manage Blog Content',
      permission: 'blog'
    },
    {
      id: 'contact',
      label: 'Contact Submissions',
      icon: MessageSquare,
      tooltip: 'View Contact Submissions',
      permission: 'contact'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      tooltip: 'Admin Settings',
      permission: 'settings'
    }
  ];

  // Super admin specific menu item
  const superAdminItem = {
    id: 'adminUsers',
    label: 'Admin Users',
    icon: Shield,
    tooltip: 'Manage Admin Users',
    permission: 'adminUsers'
  };

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter(item => 
    item.permission === null || 
    userPermissions[item.permission as keyof typeof userPermissions] || 
    isSuperAdmin
  );

  return (
    <SidebarMenu>
      {visibleMenuItems.map(item => (
        <AdminSidebarMenuItem
          key={item.id}
          label={item.label}
          icon={item.icon}
          isActive={activeTab === item.id}
          onClick={() => onTabChange(item.id)}
          tooltip={item.tooltip}
        />
      ))}
      
      {isSuperAdmin && (
        <AdminSidebarMenuItem
          label={superAdminItem.label}
          icon={superAdminItem.icon}
          isActive={activeTab === superAdminItem.id}
          onClick={() => onTabChange(superAdminItem.id)}
          tooltip={superAdminItem.tooltip}
        />
      )}
    </SidebarMenu>
  );
};

export default SidebarMenuItems;
