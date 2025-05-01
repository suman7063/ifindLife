
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
        
        // First check localStorage which might be used by the public site
        const savedContent = localStorage.getItem('ifindlife-content');
        let parsedContent;
        
        if (savedContent) {
          parsedContent = JSON.parse(savedContent);
          if (parsedContent.experts && parsedContent.experts.length > 0) {
            setExperts(parsedContent.experts);
            updateCallback(parsedContent.experts);
            setLoading(false);
            return;
          }
        }
        
        // If no experts in localStorage, fetch from Supabase
        const { data: expertsData, error: expertsError } = await supabase
          .from('experts')
          .select('*');
          
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
        }
      } catch (err) {
        console.error('Error loading experts data:', err);
        setError('Failed to load experts data');
        toast.error('Failed to load experts data');
      } finally {
        setLoading(false);
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
