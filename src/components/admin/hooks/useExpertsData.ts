
import { useState, useEffect } from 'react';
import { Expert } from '@/components/admin/experts/types';
import { loadExpertsData } from './utils/dataLoaders';

export function useExpertsData(
  initialExperts: Expert[] = [], 
  isLoading: boolean = false,
  updateCallback: (experts: Expert[]) => void = () => {}
) {
  const [experts, setExperts] = useState<Expert[]>(initialExperts);

  // Load experts data if needed
  useEffect(() => {
    const loadExperts = async () => {
      if (initialExperts.length === 0 && !isLoading) {
        const loadedExperts = await loadExpertsData();
        if (loadedExperts.length > 0) {
          setExperts(loadedExperts);
          updateCallback(loadedExperts);
        }
      }
    };
    
    loadExperts();
  }, [initialExperts, isLoading, updateCallback]);

  return {
    experts,
    setExperts
  };
}
