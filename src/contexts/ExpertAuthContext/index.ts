
import { ExpertAuthContext } from '../ExpertAuthContext';
import { ExpertAuthProvider } from '../ExpertAuthProvider';
import { useContext } from 'react';
import { ExpertAuthContextType } from '../ExpertAuthContext';

// Hook for using the expert auth context
export const useExpertAuth = (): ExpertAuthContextType => {
  const context = useContext(ExpertAuthContext);
  if (context === undefined) {
    throw new Error('useExpertAuth must be used within an ExpertAuthProvider');
  }
  return context;
};

export { ExpertAuthContext, ExpertAuthProvider };
export type { ExpertAuthContextType };
