
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { StatusMessage, UseLoginPageStatusReturn } from './loginPageTypes';

export const useLoginPageStatus = (): UseLoginPageStatusReturn => {
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const location = useLocation();
  
  // Check for status message in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    
    if (status === 'registered') {
      setStatusMessage({
        type: 'success',
        message: 'Registration successful! Your account is pending approval. You will be notified via email once approved.'
      });
    } else if (status === 'pending') {
      setStatusMessage({
        type: 'info',
        message: 'Your account is still pending approval. You will be notified via email once approved.'
      });
    } else if (status === 'disapproved') {
      setStatusMessage({
        type: 'warning',
        message: 'Your account has been disapproved. Please check your email for details or contact support.'
      });
    }
  }, [location.search]);

  return { statusMessage, setStatusMessage };
};
