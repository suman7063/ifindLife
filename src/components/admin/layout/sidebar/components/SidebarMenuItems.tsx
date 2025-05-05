
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
}

const SidebarMenuItems: React.FC<SidebarMenuItemsProps> = ({
  activeTab,
  onTabChange,
  isSuperAdmin
}) => {
  // Define menu items with their properties
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      tooltip: 'Dashboard Overview'
    },
    {
      id: 'experts',
      label: 'Experts',
      icon: Users,
      tooltip: 'Manage Experts'
    },
    {
      id: 'expertApprovals',
      label: 'Expert Approvals',
      icon: CheckSquare,
      tooltip: 'Expert Approval Requests'
    },
    {
      id: 'services',
      label: 'Services',
      icon: Briefcase,
      tooltip: 'Manage Services'
    },
    {
      id: 'herosection',
      label: 'Hero Section',
      icon: FileText,
      tooltip: 'Edit Hero Section'
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      icon: MessageSquare,
      tooltip: 'Manage Testimonials'
    },
    {
      id: 'programs',
      label: 'Programs',
      icon: Calendar,
      tooltip: 'Manage Programs'
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: LifeBuoy,
      tooltip: 'Manage Sessions'
    },
    {
      id: 'referrals',
      label: 'Referrals',
      icon: Award,
      tooltip: 'Manage Referrals'
    },
    {
      id: 'help',
      label: 'Help Tickets',
      icon: HelpCircle,
      tooltip: 'Manage Help Tickets'
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: FileText,
      tooltip: 'Manage Blog Content'
    },
    {
      id: 'contact',
      label: 'Contact Submissions',
      icon: MessageSquare,
      tooltip: 'View Contact Submissions'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      tooltip: 'Admin Settings'
    }
  ];

  // Super admin specific menu item
  const superAdminItem = {
    id: 'adminUsers',
    label: 'Admin Users',
    icon: Shield,
    tooltip: 'Manage Admin Users'
  };

  return (
    <SidebarMenu>
      {menuItems.map(item => (
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
