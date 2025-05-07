
import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
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
      <SidebarMenuItem
        icon={<LayoutDashboard size={20} />}
        text="Overview"
        isActive={activeTab === 'overview'}
        onClick={() => onTabChange('overview')}
      />

      {/* Expert related menus */}
      {checkPermission('experts') && (
        <SidebarMenuItem
          icon={<Users size={20} />}
          text="Experts"
          isActive={activeTab === 'experts'}
          onClick={() => onTabChange('experts')}
        />
      )}
      
      {checkPermission('expertApprovals') && (
        <SidebarMenuItem
          icon={<UserCheck size={20} />}
          text="Expert Approvals"
          isActive={activeTab === 'expertApprovals'}
          onClick={() => onTabChange('expertApprovals')}
        />
      )}

      {/* Service related menus */}
      {checkPermission('services') && (
        <SidebarMenuItem
          icon={<FileText size={20} />}
          text="Services"
          isActive={activeTab === 'services'}
          onClick={() => onTabChange('services')}
        />
      )}

      {/* Content related menus */}
      {checkPermission('herosection') && (
        <SidebarMenuItem
          icon={<PanelLeft size={20} />}
          text="Hero Section"
          isActive={activeTab === 'herosection'}
          onClick={() => onTabChange('herosection')}
        />
      )}
      
      {checkPermission('testimonials') && (
        <SidebarMenuItem
          icon={<Star size={20} />}
          text="Testimonials"
          isActive={activeTab === 'testimonials'}
          onClick={() => onTabChange('testimonials')}
        />
      )}

      {/* Programs and sessions menus */}
      {checkPermission('programs') && (
        <SidebarMenuItem
          icon={<BookOpen size={20} />}
          text="Programs"
          isActive={activeTab === 'programs'}
          onClick={() => onTabChange('programs')}
        />
      )}
      
      {checkPermission('sessions') && (
        <SidebarMenuItem
          icon={<Bookmark size={20} />}
          text="Sessions"
          isActive={activeTab === 'sessions'}
          onClick={() => onTabChange('sessions')}
        />
      )}

      {/* Analytics and reporting */}
      {checkPermission('referrals') && (
        <SidebarMenuItem
          icon={<AtSign size={20} />}
          text="Referrals"
          isActive={activeTab === 'referrals'}
          onClick={() => onTabChange('referrals')}
        />
      )}
      
      {checkPermission('blog') && (
        <SidebarMenuItem
          icon={<MessageSquare size={20} />}
          text="Blog"
          isActive={activeTab === 'blog'}
          onClick={() => onTabChange('blog')}
        />
      )}

      {/* Communication */}
      {checkPermission('contact') && (
        <SidebarMenuItem
          icon={<Mail size={20} />}
          text="Contact Submissions"
          isActive={activeTab === 'contact'}
          onClick={() => onTabChange('contact')}
        />
      )}

      {/* Admin only menus */}
      {isSuperAdmin && (
        <SidebarMenuItem
          icon={<UserCog size={20} />}
          text="Admin Users"
          isActive={activeTab === 'adminUsers'}
          onClick={() => onTabChange('adminUsers')}
        />
      )}

      {/* Settings menu - usually accessible to all admins */}
      {checkPermission('settings') && (
        <SidebarMenuItem
          icon={<Settings size={20} />}
          text="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      )}
    </div>
  );
};

export default SidebarMenuItems;
