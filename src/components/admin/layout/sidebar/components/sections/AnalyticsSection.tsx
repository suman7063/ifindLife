
import React from 'react';
import { LineChart, FilePieChart } from 'lucide-react';
import MenuSection from '../MenuSection';

interface AnalyticsSectionProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  hasAnalyticsPermission: boolean;
  hasReportsPermission: boolean;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  activeTab,
  onTabChange,
  hasAnalyticsPermission,
  hasReportsPermission
}) => {
  const items = [];
  
  if (hasAnalyticsPermission) {
    items.push({
      icon: LineChart,
      label: "Analytics",
      isActive: activeTab === 'analytics',
      onClick: () => onTabChange('analytics')
    });
  }
  
  if (hasReportsPermission) {
    items.push({
      icon: FilePieChart,
      label: "Reports",
      isActive: activeTab === 'reports',
      onClick: () => onTabChange('reports')
    });
  }

  return (
    <MenuSection
      sectionLabel="Analytics & Reporting"
      items={items}
      showSection={items.length > 0}
    />
  );
};

export default AnalyticsSection;
