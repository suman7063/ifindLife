
import React from 'react';
import { Toaster } from 'sonner';
import { Separator } from '@/components/ui/separator';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  activeTab 
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar activeTab={activeTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default DashboardLayout;
