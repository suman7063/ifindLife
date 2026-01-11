
import React from 'react';
import { AtSign, Mail, Users, FileText, Newspaper } from 'lucide-react';
import MenuSection from '../MenuSection';

interface CommunicationSectionProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  hasReferralsPermission: boolean;
  hasContactPermission: boolean;
  hasProgramsInquiryPermission?: boolean;
  hasNewsletterPermission?: boolean;
}

const CommunicationSection: React.FC<CommunicationSectionProps> = ({
  activeTab,
  onTabChange,
  hasReferralsPermission,
  hasContactPermission,
  hasProgramsInquiryPermission = true, // Default to true for super admin
  hasNewsletterPermission = true, // Default to true for super admin
}) => {
  const items = [];
  
  if (hasProgramsInquiryPermission) {
    items.push({
      icon: FileText,
      label: "Programs Inquiry",
      isActive: activeTab === 'programs-inquiry',
      onClick: () => onTabChange('programs-inquiry')
    });
  }
  
  if (hasNewsletterPermission) {
    items.push({
      icon: Newspaper,
      label: "Newsletter Subscribers",
      isActive: activeTab === 'newsletter',
      onClick: () => onTabChange('newsletter')
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
