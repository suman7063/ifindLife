
import React from 'react';
import { Users, UserCheck } from 'lucide-react';
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
  
  if (hasExpertsPermission) {
    items.push({
      icon: Users,
      label: "Expert Approvals",
      isActive: activeTab === 'experts',
      onClick: () => onTabChange('experts')
    });
    items.push({
      icon: Users,
      label: "Experts List",
      isActive: activeTab === 'experts-list',
      onClick: () => onTabChange('experts-list')
    });
  }
  
  if (hasExpertApprovalsPermission) {
    items.push({
      icon: UserCheck,
      label: "Expert Approvals",
      isActive: activeTab === 'expertApprovals',
      onClick: () => onTabChange('expertApprovals')
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
