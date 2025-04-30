
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
  
  // Return the ProgramResetTool component
  const ProgramResetTool = () => {
    // Only log in development environment
    if (import.meta.env.DEV) {
      console.log('ProgramResetTool component rendered');
    }
    
    // Only show reset tool in development
    return import.meta.env.DEV ? <ProgramDataReset /> : null;
  };
  
  return {
    ProgramResetTool
  };
};

export default useAdminTools;
