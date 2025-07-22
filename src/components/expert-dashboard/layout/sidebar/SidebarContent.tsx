
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import SidebarLogo from './SidebarLogo';
import ExpertProfileCard from './ExpertProfileCard';
import SidebarNavigation from './SidebarNavigation';
import SidebarLogout from './SidebarLogout';

const SidebarContent: React.FC = () => {
  const { expert } = useSimpleAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <SidebarLogo />
        <ExpertProfileCard expert={expert} />
      </div>
      
      <Separator />
      
      <SidebarNavigation />
      
      <SidebarLogout />
    </div>
  );
};

export default SidebarContent;
