
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface MobileResponsiveWrapperProps {
  children: ReactNode;
  className?: string;
}

const MobileResponsiveWrapper: React.FC<MobileResponsiveWrapperProps> = ({ 
  children, 
  className 
}) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className={cn(
        "min-h-screen w-full",
        isMobile ? "flex flex-col" : "flex",
        className
      )}>
        {children}
      </div>
    </SidebarProvider>
  );
};

export default MobileResponsiveWrapper;
