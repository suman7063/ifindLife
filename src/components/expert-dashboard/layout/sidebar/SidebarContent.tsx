
import React from 'react';
import { Separator } from '@/components/ui/separator';
import SidebarNavigation from './SidebarNavigation';
import SidebarLogout from './SidebarLogout';

const SidebarContent: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="pt-6">
        {/* Removed logo and expert profile card as requested */}
      </div>
      
      <Separator />
      
      <div className="flex-1">
        <SidebarNavigation />
      </div>
    </div>
  );
};

export default SidebarContent;
