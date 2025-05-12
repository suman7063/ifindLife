
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
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 3;

  // Default expert for fallback
  const DEFAULT_EXPERTS: Expert[] = [
    {
      id: "default-1",
      name: "Dr. Sarah Johnson",
      experience: 12,
      specialties: ["Anxiety", "Depression"],
      rating: 4.9,
      consultations: 245,
      price: 30,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
      online: true,
      languages: ["English", "Spanish"],
      bio: "Clinical psychologist with over 12 years of experience helping clients overcome anxiety and depression.",
      email: "support@ifindlife.com",
      phone: "",
      address: "",
      city: "New York",
      state: "NY",
      country: "USA"
    },
    {
      id: "default-2",
      name: "Dr. Michael Chen",
      experience: 8,
      specialties: ["Relationships", "Stress Management"],
      rating: 4.7,
      consultations: 187,
      price: 35,
      waitTime: "Available",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
      online: true,
      languages: ["English", "Mandarin"],
      bio: "Specialized in relationship counseling and stress management with a holistic approach.",
      email: "support@ifindlife.com",
      phone: "",
      address: "",
      city: "San Francisco",
      state: "CA",
      country: "USA"
    }
  ];

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
        
        console.log(`Fetching experts data... Attempt: ${fetchAttempts + 1}`);
        
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
              setFetchAttempts(0); // Reset on success
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
            // Check if the error is related to infinite recursion or RLS policies
            if (expertsError.code === '42P17' || expertsError.message?.includes('recursion') || expertsError.message?.includes('policy')) {
              console.warn('Database policy error detected for experts table, trying fallback');
              throw new Error(`Database policy error: ${expertsError.message}`);
            }
            
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
            
            setFetchAttempts(0); // Reset on success
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
        
        if (fetchAttempts >= MAX_FETCH_ATTEMPTS - 1) {
          console.warn(`Max fetch attempts (${MAX_FETCH_ATTEMPTS}) reached, using default data`);
          setError('Failed to load experts data after multiple attempts');
          setExperts(DEFAULT_EXPERTS);
          updateCallback(DEFAULT_EXPERTS);
          toast.error('Error loading experts. Using default settings.');
        } else {
          // Schedule retry
          const retryDelay = Math.min(1000 * Math.pow(2, fetchAttempts), 10000);
          console.log(`Scheduling experts data retry in ${retryDelay}ms...`);
          
          setTimeout(() => {
            setFetchAttempts(prev => prev + 1);
            fetchExperts();
          }, retryDelay);
        }
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
          if (expertAccountsError.code === '42P17' || expertAccountsError.message?.includes('recursion') || expertAccountsError.message?.includes('policy')) {
            console.warn('Database policy error detected in expert_accounts, using default data');
            throw new Error(`Database policy error in fallback: ${expertAccountsError.message}`);
          }
          
          console.error('Error fetching expert_accounts:', expertAccountsError);
          throw expertAccountsError;
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
          setFetchAttempts(0); // Reset on success
          toast.success(`Loaded ${formattedExperts.length} experts from expert_accounts`);
        } else {
          // If both tables fail, use default experts
          console.warn('No experts found in any tables, using default data');
          if (fetchAttempts >= MAX_FETCH_ATTEMPTS - 1) {
            setExperts(DEFAULT_EXPERTS);
            updateCallback(DEFAULT_EXPERTS);
            toast.error('Could not load experts. Using default data.');
          }
        }
      } catch (fallbackError) {
        console.error('Error in expert_accounts fallback:', fallbackError);
        
        if (fetchAttempts >= MAX_FETCH_ATTEMPTS - 1) {
          console.warn(`Max fetch attempts (${MAX_FETCH_ATTEMPTS}) reached, using default data`);
          setExperts(DEFAULT_EXPERTS);
          updateCallback(DEFAULT_EXPERTS);
          toast.error('Error loading experts. Using default data.');
        } else {
          // Schedule another retry attempt
          const retryDelay = Math.min(1000 * Math.pow(2, fetchAttempts), 10000);
          setTimeout(() => {
            setFetchAttempts(prev => prev + 1);
            fetchExperts();
          }, retryDelay);
        }
      }
    };
    
    fetchExperts();
  }, [initialExperts, isLoading, updateCallback, fetchAttempts]);

  return {
    experts,
    setExperts,
    loading,
    error // This is now always a string
  };
}
