
import React from 'react';
import ProgramDataReset from '@/components/admin/ProgramDataReset';

/**
 * Hook to provide admin tools for troubleshooting and maintenance
 */
export const useAdminTools = () => {
  // Only log in development environment
  if (import.meta.env.DEV) {
    console.log('useAdminTools hook initialized');
  }
  
  // Return the ProgramResetTool component that is only visible in development
  const ProgramResetTool = () => {
    // Only log in development environment
    if (import.meta.env.DEV) {
      console.log('ProgramResetTool component rendered');
    }
    
    // Only render in development environment
    if (!import.meta.env.DEV) return null;
    
    return <ProgramDataReset />;
  };
  
  return {
    ProgramResetTool
  };
};

export default useAdminTools;
