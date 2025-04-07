
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const useTabHandler = () => {
  const [activeTab, setActiveTab] = useState('login');
  const location = useLocation();
  
  // Set the active tab based on the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
      toast.info('Please complete your expert registration to continue');
    }
  }, [location]);

  return { activeTab, setActiveTab };
};
