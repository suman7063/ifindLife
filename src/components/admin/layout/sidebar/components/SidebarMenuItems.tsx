
import React from 'react';
import {
  OverviewSection,
  AnalyticsSection,
  ContentSection,
  ExpertSection,
  ContentManagementSection,
  CommunicationSection,
  UserManagementSection,
  SettingsSection
} from './sections';

type SidebarMenuItemsProps = {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  isSuperAdmin: boolean;
  userPermissions?: Record<string, boolean>;
};

/**
 * SidebarMenuItems component renders all menu sections
 * using smaller, focused components for better maintainability
 */
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
    <div className="space-y-4">
      <OverviewSection 
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      <AnalyticsSection
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasAnalyticsPermission={checkPermission('analytics')}
        hasReportsPermission={checkPermission('reports')}
      />

      <ContentSection
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasContentPermission={checkPermission('content')}
      />

      <ExpertSection
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasExpertsPermission={checkPermission('experts')}
        hasExpertApprovalsPermission={checkPermission('expertApprovals')}
      />

      <ContentManagementSection
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasTestimonialsPermission={checkPermission('testimonials')}
        hasProgramsPermission={checkPermission('programs')}
        hasSessionsPermission={checkPermission('sessions')}
        hasBlogPermission={checkPermission('blog')}
      />

      <CommunicationSection
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasReferralsPermission={checkPermission('referrals')}
        hasContactPermission={checkPermission('contact')}
      />

      <UserManagementSection
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasUsersPermission={checkPermission('users')}
        isSuperAdmin={isSuperAdmin}
      />

      <SettingsSection
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasSettingsPermission={true}
      />
    </div>
  );
};

export default SidebarMenuItems;
