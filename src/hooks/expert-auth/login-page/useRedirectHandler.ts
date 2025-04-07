
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpertProfile } from '../types';

export const useRedirectHandler = (
  expert: ExpertProfile | null,
  loading: boolean,
  initialized: boolean
) => {
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const navigate = useNavigate();
  
  // Navigate to dashboard if authenticated
  useEffect(() => {
    if (!expert || !initialized || loading || redirectAttempted) {
      return;
    }
    
    // Don't redirect if expert is not approved
    if (expert.status !== 'approved') {
      return;
    }
    
    console.log('Redirecting to expert dashboard - Expert profile found and approved');
    setRedirectAttempted(true);
    
    navigate('/expert-dashboard', { replace: true });
  }, [expert, loading, initialized, redirectAttempted, navigate]);

  return { redirectAttempted };
};
