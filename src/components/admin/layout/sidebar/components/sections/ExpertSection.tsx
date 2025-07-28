
import React from 'react';
import { Users, UserCheck, UserPlus, Grid, Settings } from 'lucide-react';
import MenuSection from '../MenuSection';

interface ExpertSectionProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  hasExpertsPermission: boolean;
  hasExpertApprovalsPermission: boolean;
}

const ExpertSection: React.FC<ExpertSectionProps> = ({
  activeTab,
  onTabChange,
  hasExpertsPermission,
  hasExpertApprovalsPermission
}) => {
  const items = [];
  
  // Expert Approval section
  if (hasExpertApprovalsPermission) {
    items.push({
      icon: UserCheck,
      label: "Expert Approvals",
      isActive: activeTab === 'expertApprovals',
      onClick: () => onTabChange('expertApprovals')
    });
  }
  
  // Expert Management section
  if (hasExpertsPermission) {
    items.push({
      icon: Users,
      label: "Expert Management",
      isActive: activeTab === 'experts-list',
      onClick: () => onTabChange('experts-list')
    });
  }
  
  // Create sections
  if (hasExpertsPermission) {
    items.push({
      icon: Grid,
      label: "Expert Categories",
      isActive: activeTab === 'expert-categories',
      onClick: () => onTabChange('expert-categories')
    });
    items.push({
      icon: Settings,
      label: "Expert Services",
      isActive: activeTab === 'expert-services',
      onClick: () => onTabChange('expert-services')
    });
  }

  return (
    <MenuSection
      sectionLabel="Expert Management"
      items={items}
      showSection={items.length > 0}
    />
  );
};

export default ExpertSection;
