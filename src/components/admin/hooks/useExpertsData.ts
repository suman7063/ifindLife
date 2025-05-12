import { useState, useEffect } from 'react';
import { Expert } from '@/components/admin/experts/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { safeDataTransform, dbTypeConverter } from '@/utils/supabaseUtils';

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

  // Map database experts to our Expert type
  const mapDbExpertToExpert = (dbExpert: any): Expert => {
    return {
      id: String(dbExpert.id),
      name: dbExpert.name || 'Unknown Expert',
      experience: Number(dbExpert.experience) || 0,
      specialties: dbExpert.specialization ? [dbExpert.specialization] : [],
      rating: dbExpert.average_rating || 4.5,
      consultations: dbExpert.reviews_count || 0,
      price: 30, // Default price if not specified
      waitTime: "Available",
      imageUrl: dbExpert.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
      online: true,
      languages: [],
      bio: dbExpert.bio || "",
      email: dbExpert.email || "",
      phone: dbExpert.phone || "",
      address: dbExpert.address || "",
      city: dbExpert.city || "",
      state: dbExpert.state || "",
      country: dbExpert.country || ""
    };
  };

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
          // First try to fetch from expert_accounts table which has expert status info
          const { data: expertAccountsData, error: expertAccountsError } = await supabase
            .from('expert_accounts')
            .select('*');
          
          console.log('Supabase expert_accounts response:', { count: expertAccountsData?.length, error: expertAccountsError });
            
          if (!expertAccountsError && expertAccountsData && expertAccountsData.length > 0) {
            // Transform experts data to match our expected format using our utility
            const formattedExperts = safeDataTransform(expertAccountsData, (expert) => 
              mapDbExpertToExpert(dbTypeConverter(expert))
            );
            
            console.log('Formatted experts from expert_accounts:', formattedExperts.length);
            setExperts(formattedExperts);
            updateCallback(formattedExperts);
            
            // Also update localStorage if needed
            if (parsedContent) {
              parsedContent.experts = formattedExperts;
              localStorage.setItem('ifindlife-content', JSON.stringify(parsedContent));
            }
            
            setFetchAttempts(0); // Reset on success
            toast.success(`Loaded ${formattedExperts.length} experts`);
            return;
          }
          
          // If expert_accounts failed or is empty, try the experts table
          const { data: expertsData, error: expertsError } = await supabase
            .from('experts')
            .select('*');
          
          console.log('Supabase experts response:', { count: expertsData?.length, error: expertsError });
            
          if (expertsError) {
            // Check if the error is related to infinite recursion or RLS policies
            if (expertsError.code === '42P17' || expertsError.message?.includes('recursion') || expertsError.message?.includes('policy')) {
              console.warn('Database policy error detected for experts table, using fallback');
              throw new Error(`Database policy error: ${expertsError.message}`);
            }
            
            console.error('Error fetching experts:', expertsError);
            throw expertsError;
          } 
          
          if (expertsData && expertsData.length > 0) {
            // Transform experts data to match our expected format using our utility
            const formattedExperts = safeDataTransform(expertsData, (expert) => 
              mapDbExpertToExpert(dbTypeConverter(expert))
            );
            
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
            console.warn('No expert data found in the database, using default data');
            if (fetchAttempts >= MAX_FETCH_ATTEMPTS - 1) {
              setExperts(DEFAULT_EXPERTS);
              updateCallback(DEFAULT_EXPERTS);
              toast.error('Could not load experts. Using default data.');
            }
          }
        } catch (supabaseError) {
          console.error('Supabase experts query error:', supabaseError);
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
            }, retryDelay);
          }
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
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperts();
  }, [initialExperts, isLoading, updateCallback, fetchAttempts]);

  return {
    experts,
    setExperts,
    loading,
    error
  };
}
