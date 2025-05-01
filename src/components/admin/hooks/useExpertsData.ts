
import { useState, useEffect } from 'react';
import { Expert } from '@/components/admin/experts/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useExpertsData(
  initialExperts: Expert[] = [], 
  isLoading: boolean = false,
  updateCallback: (experts: Expert[]) => void = () => {}
) {
  const [experts, setExperts] = useState<Expert[]>(initialExperts);
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState<string | null>(null);

  // Load experts data from the same source as public site
  useEffect(() => {
    const fetchExperts = async () => {
      // If we already have experts data, don't fetch again
      if (initialExperts.length > 0) {
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching experts data...');
        
        // First check localStorage which might be used by the public site
        let parsedContent;
        try {
          const savedContent = localStorage.getItem('ifindlife-content');
          if (savedContent) {
            parsedContent = JSON.parse(savedContent);
            if (parsedContent.experts && parsedContent.experts.length > 0) {
              console.log('Found experts in localStorage:', parsedContent.experts.length);
              setExperts(parsedContent.experts);
              updateCallback(parsedContent.experts);
              setLoading(false);
              return;
            }
          }
        } catch (localStorageError) {
          console.error('Error reading from localStorage:', localStorageError);
          // Continue with Supabase fetch if localStorage fails
        }
        
        // If no experts in localStorage, fetch from Supabase
        console.log('Fetching experts from Supabase...');
        
        try {
          const { data: expertsData, error: expertsError } = await supabase
            .from('experts')
            .select('*');
          
          console.log('Supabase experts response:', { count: expertsData?.length, error: expertsError });
            
          if (expertsError) {
            console.error('Error fetching experts:', expertsError);
            throw expertsError;
          } 
          
          if (expertsData && expertsData.length > 0) {
            // Transform experts data to match our expected format
            const formattedExperts = expertsData.map(expert => ({
              id: expert.id.toString(),
              name: expert.name || 'Unknown Expert',
              experience: Number(expert.experience) || 0,
              specialties: expert.specialization ? [expert.specialization] : [],
              rating: expert.average_rating || 4.5,
              consultations: expert.reviews_count || 0,
              price: 30, // Default price if not specified
              waitTime: "Available",
              imageUrl: expert.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
              online: true,
              languages: [],
              bio: expert.bio || "",
              email: expert.email || "",
              phone: expert.phone || "",
              address: expert.address || "",
              city: expert.city || "",
              state: expert.state || "",
              country: expert.country || ""
            }));
            
            console.log('Formatted experts:', formattedExperts.length);
            setExperts(formattedExperts);
            updateCallback(formattedExperts);
            
            // Also update localStorage if needed
            if (parsedContent) {
              parsedContent.experts = formattedExperts;
              localStorage.setItem('ifindlife-content', JSON.stringify(parsedContent));
            }
            
            toast.success(`Loaded ${formattedExperts.length} experts`);
          } else {
            console.warn('No expert data found in the database');
            // Check for expert_accounts table as a fallback
            checkExpertAccounts();
          }
        } catch (supabaseError) {
          console.error('Supabase experts query error:', supabaseError);
          // Try alternate experts source
          checkExpertAccounts();
        }
      } catch (err) {
        console.error('Error loading experts data:', err);
        setError('Failed to load experts data');
        toast.error('Failed to load experts data');
      } finally {
        setLoading(false);
      }
    };
    
    // Fallback to check expert_accounts table if experts table fails
    const checkExpertAccounts = async () => {
      try {
        console.log('Trying to fetch from expert_accounts table instead...');
        const { data: expertAccountsData, error: expertAccountsError } = await supabase
          .from('expert_accounts')
          .select('*');
          
        console.log('expert_accounts response:', { count: expertAccountsData?.length, error: expertAccountsError });
          
        if (expertAccountsError) {
          console.error('Error fetching expert_accounts:', expertAccountsError);
          return;
        }
        
        if (expertAccountsData && expertAccountsData.length > 0) {
          // Transform expert_accounts data to match our expected format
          const formattedExperts = expertAccountsData.map(expert => ({
            id: expert.id.toString(),
            name: expert.name || 'Unknown Expert',
            experience: Number(expert.experience) || 0,
            specialties: expert.specialization ? [expert.specialization] : [],
            rating: expert.average_rating || 4.5,
            consultations: expert.reviews_count || 0,
            price: 30, // Default price if not specified
            waitTime: "Available",
            imageUrl: expert.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
            online: true,
            languages: [],
            bio: expert.bio || "",
            email: expert.email || "",
            phone: expert.phone || "",
            address: expert.address || "",
            city: expert.city || "",
            state: expert.state || "",
            country: expert.country || ""
          }));
          
          setExperts(formattedExperts);
          updateCallback(formattedExperts);
          toast.success(`Loaded ${formattedExperts.length} experts from expert_accounts`);
        }
      } catch (fallbackError) {
        console.error('Error in expert_accounts fallback:', fallbackError);
      }
    };
    
    fetchExperts();
  }, [initialExperts, isLoading, updateCallback]);

  return {
    experts,
    setExperts,
    loading,
    error
  };
}
