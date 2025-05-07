
import React from 'react';
import AdminSidebarMenuItem from './SidebarMenuItem';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  PanelLeft, 
  Settings,
  Star,
  UserCheck,
  BarChart,
  Ticket,
  BookOpen,
  Bookmark,
  AtSign,
  Mail,
  UserCog
} from 'lucide-react';
import { hasPermission } from '@/components/admin/utils/permissionUtils';

type SidebarMenuItemsProps = {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  isSuperAdmin: boolean;
  userPermissions?: Record<string, boolean>;
};

const SidebarMenuItems: React.FC<SidebarMenuItemsProps> = ({
  activeTab,
  onTabChange,
  isSuperAdmin,
  userPermissions = {}
}) => {
  // Helper function to check if user has a specific permission
  const checkPermission = (permission: string): boolean => {
    return isSuperAdmin || !!userPermissions[permission];
  };

  return (
    <div className="space-y-1">
      <AdminSidebarMenuItem
        icon={LayoutDashboard}
        label="Overview"
        isActive={activeTab === 'overview'}
        onClick={() => onTabChange('overview')}
      />

      {/* Expert related menus */}
      {checkPermission('experts') && (
        <AdminSidebarMenuItem
          icon={Users}
          label="Experts"
          isActive={activeTab === 'experts'}
          onClick={() => onTabChange('experts')}
        />
      )}
      
      {checkPermission('expertApprovals') && (
        <AdminSidebarMenuItem
          icon={UserCheck}
          label="Expert Approvals"
          isActive={activeTab === 'expertApprovals'}
          onClick={() => onTabChange('expertApprovals')}
        />
      )}

      {/* Service related menus */}
      {checkPermission('services') && (
        <AdminSidebarMenuItem
          icon={FileText}
          label="Services"
          isActive={activeTab === 'services'}
          onClick={() => onTabChange('services')}
        />
      )}

      {/* Content related menus */}
      {checkPermission('herosection') && (
        <AdminSidebarMenuItem
          icon={PanelLeft}
          label="Hero Section"
          isActive={activeTab === 'herosection'}
          onClick={() => onTabChange('herosection')}
        />
      )}
      
      {checkPermission('testimonials') && (
        <AdminSidebarMenuItem
          icon={Star}
          label="Testimonials"
          isActive={activeTab === 'testimonials'}
          onClick={() => onTabChange('testimonials')}
        />
      )}

      {/* Programs and sessions menus */}
      {checkPermission('programs') && (
        <AdminSidebarMenuItem
          icon={BookOpen}
          label="Programs"
          isActive={activeTab === 'programs'}
          onClick={() => onTabChange('programs')}
        />
      )}
      
      {checkPermission('sessions') && (
        <AdminSidebarMenuItem
          icon={Bookmark}
          label="Sessions"
          isActive={activeTab === 'sessions'}
          onClick={() => onTabChange('sessions')}
        />
      )}

      {/* Analytics and reporting */}
      {checkPermission('referrals') && (
        <AdminSidebarMenuItem
          icon={AtSign}
          label="Referrals"
          isActive={activeTab === 'referrals'}
          onClick={() => onTabChange('referrals')}
        />
      )}
      
      {checkPermission('blog') && (
        <AdminSidebarMenuItem
          icon={MessageSquare}
          label="Blog"
          isActive={activeTab === 'blog'}
          onClick={() => onTabChange('blog')}
        />
      )}

      {/* Communication */}
      {checkPermission('contact') && (
        <AdminSidebarMenuItem
          icon={Mail}
          label="Contact Submissions"
          isActive={activeTab === 'contact'}
          onClick={() => onTabChange('contact')}
        />
      )}

      {/* Admin only menus */}
      {isSuperAdmin && (
        <AdminSidebarMenuItem
          icon={UserCog}
          label="Admin Users"
          isActive={activeTab === 'adminUsers'}
          onClick={() => onTabChange('adminUsers')}
        />
      )}

      {/* Settings menu - usually accessible to all admins */}
      {checkPermission('settings') && (
        <AdminSidebarMenuItem
          icon={Settings}
          label="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      )}
    </div>
  );
};

export default SidebarMenuItems;
