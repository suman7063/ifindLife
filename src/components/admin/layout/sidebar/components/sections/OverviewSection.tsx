
import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import MenuSection from '../MenuSection';

interface OverviewSectionProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const items = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      isActive: activeTab === 'overview',
      onClick: () => onTabChange('overview')
    }
  ];

  return (
    <MenuSection 
      items={items} 
      showSection={true} 
    />
  );
};

export default OverviewSection;
