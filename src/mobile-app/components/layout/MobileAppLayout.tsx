import React, { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { MobileHeader } from './MobileHeader';
import { useLocation } from 'react-router-dom';

interface MobileAppLayoutProps {
  children: ReactNode;
}

const HIDE_NAVIGATION_PATHS = ['/mobile-app/app/call', '/mobile-app/app/chat'];

export const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideNavigation = HIDE_NAVIGATION_PATHS.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {!hideNavigation && <MobileHeader />}
      
      <main className={`flex-1 overflow-y-auto ${hideNavigation ? '' : 'pb-20'}`}>
        {children}
      </main>
      
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};