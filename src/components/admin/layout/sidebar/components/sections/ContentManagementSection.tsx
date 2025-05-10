
import React from 'react';
import { FileText, PanelLeft, Star, BookOpen, Bookmark, MessageSquare } from 'lucide-react';
import MenuSection from '../MenuSection';

interface ContentManagementSectionProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  hasServicesPermission: boolean;
  hasHeroSectionPermission: boolean;
  hasTestimonialsPermission: boolean;
  hasProgramsPermission: boolean;
  hasSessionsPermission: boolean;
  hasBlogPermission: boolean;
}

const ContentManagementSection: React.FC<ContentManagementSectionProps> = ({
  activeTab,
  onTabChange,
  hasServicesPermission,
  hasHeroSectionPermission,
  hasTestimonialsPermission,
  hasProgramsPermission,
  hasSessionsPermission,
  hasBlogPermission
}) => {
  const items = [];
  
  if (hasServicesPermission) {
    items.push({
      icon: FileText,
      label: "Services",
      isActive: activeTab === 'services',
      onClick: () => onTabChange('services')
    });
  }
  
  if (hasHeroSectionPermission) {
    items.push({
      icon: PanelLeft,
      label: "Hero Section",
      isActive: activeTab === 'herosection',
      onClick: () => onTabChange('herosection')
    });
  }
  
  if (hasTestimonialsPermission) {
    items.push({
      icon: Star,
      label: "Testimonials",
      isActive: activeTab === 'testimonials',
      onClick: () => onTabChange('testimonials')
    });
  }
  
  if (hasProgramsPermission) {
    items.push({
      icon: BookOpen,
      label: "Programs",
      isActive: activeTab === 'programs',
      onClick: () => onTabChange('programs')
    });
  }
  
  if (hasSessionsPermission) {
    items.push({
      icon: Bookmark,
      label: "Sessions",
      isActive: activeTab === 'sessions',
      onClick: () => onTabChange('sessions')
    });
  }
  
  if (hasBlogPermission) {
    items.push({
      icon: MessageSquare,
      label: "Blog",
      isActive: activeTab === 'blog',
      onClick: () => onTabChange('blog')
    });
  }

  return (
    <MenuSection
      sectionLabel="Website Content"
      items={items}
      showSection={items.length > 0}
    />
  );
};

export default ContentManagementSection;
