
import React from 'react';
import { Search } from 'lucide-react';
import MenuSection from '../MenuSection';

interface ContentSectionProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  hasContentPermission: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  activeTab,
  onTabChange,
  hasContentPermission
}) => {
  const items = [];
  
  if (hasContentPermission) {
    items.push({
      icon: Search,
      label: "Content Search",
      isActive: activeTab === 'content',
      onClick: () => onTabChange('content')
    });
  }

  return (
    <MenuSection
      sectionLabel="Content Management"
      items={items}
      showSection={items.length > 0}
    />
  );
};

export default ContentSection;
