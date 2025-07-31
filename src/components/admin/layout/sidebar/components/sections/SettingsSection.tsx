
import React from 'react';
import { Settings } from 'lucide-react';
import MenuSection from '../MenuSection';

interface SettingsSectionProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  hasSettingsPermission: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  activeTab,
  onTabChange,
  hasSettingsPermission
}) => {
  const items = [];
  
  if (hasSettingsPermission) {
    items.push({
      icon: Settings,
      label: "Admin Settings",
      isActive: activeTab === 'settings',
      onClick: () => onTabChange('settings')
    });
  }

  return (
    <MenuSection
      sectionLabel="Account"
      items={items}
      showSection={items.length > 0}
    />
  );
};

export default SettingsSection;
