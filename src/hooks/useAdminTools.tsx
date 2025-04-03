
import React from 'react';
import ProgramDataReset from '@/components/admin/ProgramDataReset';

/**
 * Hook to provide admin tools for troubleshooting and maintenance
 */
export const useAdminTools = () => {
  console.log('useAdminTools hook initialized');
  
  // Return the ProgramResetTool component
  const ProgramResetTool = () => {
    console.log('ProgramResetTool component rendered');
    return <ProgramDataReset />;
  };
  
  return {
    ProgramResetTool
  };
};

export default useAdminTools;
