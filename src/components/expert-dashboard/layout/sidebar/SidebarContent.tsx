
import React from 'react';
import { Separator } from '@/components/ui/separator';
import SidebarNavigation from './SidebarNavigation';
import SidebarLogout from './SidebarLogout';

const SidebarContent: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Removed logo and expert profile card as requested */}
      <div className="pt-6">
      <Separator />
      </div>
      
 
      
      <div className="flex-1 overflow-y-auto">
        <SidebarNavigation />
      </div>
    </div>
  );
};

export default SidebarContent;
