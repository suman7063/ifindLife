
import React from 'react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { 
  Calendar,
  FileText,
  MessageSquare,
  Star,
  BookOpen
} from 'lucide-react';

type ContentManagementSectionProps = {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  hasTestimonialsPermission: boolean;
  hasProgramsPermission: boolean;
  hasSessionsPermission: boolean;
  hasBlogPermission: boolean;
};

const ContentManagementSection: React.FC<ContentManagementSectionProps> = ({
  activeTab,
  onTabChange,
  hasTestimonialsPermission,
  hasProgramsPermission,
  hasSessionsPermission,
  hasBlogPermission
}) => {
  return (
    <div className="space-y-1">
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Content Management
        </h3>
      </div>
      
      {hasTestimonialsPermission && (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => onTabChange('testimonials')}
            className={activeTab === 'testimonials' ? 'bg-accent' : ''}
          >
            <Star className="h-4 w-4" />
            <span>Testimonials</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      {hasProgramsPermission && (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => onTabChange('programs')}
            className={activeTab === 'programs' ? 'bg-accent' : ''}
          >
            <Calendar className="h-4 w-4" />
            <span>Programs</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      {hasSessionsPermission && (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => onTabChange('sessions')}
            className={activeTab === 'sessions' ? 'bg-accent' : ''}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Issue-Based Sessions</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      {hasBlogPermission && (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => onTabChange('blog')}
            className={activeTab === 'blog' ? 'bg-accent' : ''}
          >
            <BookOpen className="h-4 w-4" />
            <span>Blog</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </div>
  );
};

export default ContentManagementSection;
