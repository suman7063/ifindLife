
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Expert {
  id: string;
  name: string;
  specialization?: string;
}

interface ServiceData {
  title: string;
}

export const useExpertMatching = (serviceData: ServiceData | undefined) => {
  const [matchingExperts, setMatchingExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  
  useEffect(() => {
    const fetchMatchingExperts = async () => {
      if (!serviceData) return;
      
      try {
        const { data, error } = await supabase
          .from('experts')
          .select('id, name, specialization');
          
        if (error) throw error;
        
        // Simple type guard to ensure we have the correct data structure
        if (!data || !Array.isArray(data)) {
          console.error('Unexpected data format from Supabase query');
          return;
        }
        
        // Filter experts that have specializations matching this service
        const serviceKeywords = serviceData.title.toLowerCase().split(' ');
        
        const filteredExperts = data
          .filter(expert => {
            if (!expert.specialization) return false;
            
            // Convert specialization string to lowercase for case-insensitive comparison
            const expertSpecialization = expert.specialization.toLowerCase();
                
            return serviceKeywords.some(keyword => 
              expertSpecialization.includes(keyword.toLowerCase())
            );
          })
          .map(expert => ({
            id: expert.id,
            name: expert.name,
            specialization: expert.specialization
          }));
        
        setMatchingExperts(filteredExperts);
        
        // Set the first expert as selected by default if available
        if (filteredExperts.length > 0) {
          setSelectedExpert(filteredExperts[0]);
        }
      } catch (error) {
        console.error('Error fetching matching experts:', error);
      }
    };
    
    fetchMatchingExperts();
  }, [serviceData]);

  return {
    matchingExperts,
    selectedExpert,
    setSelectedExpert
  };
};
