
import React from 'react';
import { AtSign, Mail, Users } from 'lucide-react';
import MenuSection from '../MenuSection';

interface CommunicationSectionProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  hasReferralsPermission: boolean;
  hasContactPermission: boolean;
  hasWaitlistPermission?: boolean;
}

const CommunicationSection: React.FC<CommunicationSectionProps> = ({
  activeTab,
  onTabChange,
  hasReferralsPermission,
  hasContactPermission,
  hasWaitlistPermission = true
}) => {
  const items = [];
  
  if (hasWaitlistPermission) {
    items.push({
      icon: Users,
      label: "Souli Waitlist",
      isActive: activeTab === 'waitlist',
      onClick: () => onTabChange('waitlist')
    });
  }
  
  if (hasReferralsPermission) {
    items.push({
      icon: AtSign,
      label: "Referrals",
      isActive: activeTab === 'referrals',
      onClick: () => onTabChange('referrals')
    });
  }
  
  if (hasContactPermission) {
    items.push({
      icon: Mail,
      label: "Contact Submissions",
      isActive: activeTab === 'contact',
      onClick: () => onTabChange('contact')
    });
  }

  return (
    <MenuSection
      sectionLabel="Communication"
      items={items}
      showSection={items.length > 0}
    />
  );
};

export default CommunicationSection;
