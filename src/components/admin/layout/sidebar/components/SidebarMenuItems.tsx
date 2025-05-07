
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
        icon={<LayoutDashboard className="h-5 w-5" />}
        text="Overview"
        isActive={activeTab === 'overview'}
        onClick={() => onTabChange('overview')}
      />

      {/* Expert related menus */}
      {checkPermission('experts') && (
        <SidebarMenuItem
          icon={<Users className="h-5 w-5" />}
          text="Experts"
          isActive={activeTab === 'experts'}
          onClick={() => onTabChange('experts')}
        />
      )}
      
      {checkPermission('expertApprovals') && (
        <SidebarMenuItem
          icon={<UserCheck className="h-5 w-5" />}
          text="Expert Approvals"
          isActive={activeTab === 'expertApprovals'}
          onClick={() => onTabChange('expertApprovals')}
        />
      )}

      {/* Service related menus */}
      {checkPermission('services') && (
        <SidebarMenuItem
          icon={<FileText className="h-5 w-5" />}
          text="Services"
          isActive={activeTab === 'services'}
          onClick={() => onTabChange('services')}
        />
      )}

      {/* Content related menus */}
      {checkPermission('herosection') && (
        <SidebarMenuItem
          icon={<PanelLeft className="h-5 w-5" />}
          text="Hero Section"
          isActive={activeTab === 'herosection'}
          onClick={() => onTabChange('herosection')}
        />
      )}
      
      {checkPermission('testimonials') && (
        <SidebarMenuItem
          icon={<Star className="h-5 w-5" />}
          text="Testimonials"
          isActive={activeTab === 'testimonials'}
          onClick={() => onTabChange('testimonials')}
        />
      )}

      {/* Programs and sessions menus */}
      {checkPermission('programs') && (
        <SidebarMenuItem
          icon={<BookOpen className="h-5 w-5" />}
          text="Programs"
          isActive={activeTab === 'programs'}
          onClick={() => onTabChange('programs')}
        />
      )}
      
      {checkPermission('sessions') && (
        <SidebarMenuItem
          icon={<Bookmark className="h-5 w-5" />}
          text="Sessions"
          isActive={activeTab === 'sessions'}
          onClick={() => onTabChange('sessions')}
        />
      )}

      {/* Analytics and reporting */}
      {checkPermission('referrals') && (
        <SidebarMenuItem
          icon={<AtSign className="h-5 w-5" />}
          text="Referrals"
          isActive={activeTab === 'referrals'}
          onClick={() => onTabChange('referrals')}
        />
      )}
      
      {checkPermission('blog') && (
        <SidebarMenuItem
          icon={<MessageSquare className="h-5 w-5" />}
          text="Blog"
          isActive={activeTab === 'blog'}
          onClick={() => onTabChange('blog')}
        />
      )}

      {/* Communication */}
      {checkPermission('contact') && (
        <SidebarMenuItem
          icon={<Mail className="h-5 w-5" />}
          text="Contact Submissions"
          isActive={activeTab === 'contact'}
          onClick={() => onTabChange('contact')}
        />
      )}

      {/* Admin only menus */}
      {isSuperAdmin && (
        <SidebarMenuItem
          icon={<UserCog className="h-5 w-5" />}
          text="Admin Users"
          isActive={activeTab === 'adminUsers'}
          onClick={() => onTabChange('adminUsers')}
        />
      )}

      {/* Settings menu - usually accessible to all admins */}
      {checkPermission('settings') && (
        <SidebarMenuItem
          icon={<Settings className="h-5 w-5" />}
          text="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      )}
    </div>
  );
};

export default SidebarMenuItems;
