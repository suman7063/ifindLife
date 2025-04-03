
import React from 'react';
import ProgramDataReset from '@/components/admin/ProgramDataReset';

/**
 * Hook to provide admin tools for troubleshooting and maintenance
 */
export const useAdminTools = () => {
  const ProgramResetTool = () => <ProgramDataReset />;
  
  return {
    ProgramResetTool
  };
};

export default useAdminTools;
