
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Expert } from '@/components/admin/experts/types';
import { initialHeroSettings } from '@/data/initialAdminData';
import { useExpertsData } from './useExpertsData';
import { useServicesData, ServiceCategory } from './useServicesData';
import { useHeroSettings, HeroSettings } from './useHeroSettings';
import { useTestimonialsData, Testimonial } from './testimonials';
import { loadContentFromLocalStorage, saveContentToLocalStorage } from './utils/dataLoaders';

interface AdminContent {
  experts: Expert[];
  services: ServiceCategory[];
  heroSettings: HeroSettings;
  testimonials: Testimonial[];
  loading: boolean;
}

export const useAdminContent = (): AdminContent & {
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
  setServices: React.Dispatch<React.SetStateAction<ServiceCategory[]>>;
  setHeroSettings: React.Dispatch<React.SetStateAction<HeroSettings>>;
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  error?: string | null;
  refreshData: () => void;
} => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [initialData, setInitialData] = useState<{
    experts: Expert[];
    services: ServiceCategory[];
    heroSettings: HeroSettings;
    testimonials: Testimonial[];
  }>({
    experts: [],
    services: [],
    heroSettings: {
      ...initialHeroSettings,
      videoUrl: initialHeroSettings.videoUrl
    },
    testimonials: []
  });

  // Function to force refresh data
  const refreshData = useCallback(() => {
    toast.info("Refreshing data...");
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Load content from localStorage and Supabase on initial mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to load content from localStorage
        const parsedContent = loadContentFromLocalStorage();
        
        if (parsedContent) {
          setInitialData({
            experts: parsedContent.experts || [],
            services: parsedContent.services || [],
            heroSettings: parsedContent.heroSettings || initialHeroSettings,
            testimonials: parsedContent.testimonials || []
          });
        }
      } catch (err) {
        console.error('Error loading content:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error loading initial content';
        setError(errorMessage);
        toast.error('Error loading content');
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, [refreshTrigger]); // Add refreshTrigger to dependencies

  // Use the smaller hooks with the update callback
  const { 
    experts, 
    setExperts, 
    loading: expertsLoading, 
    error: expertsError 
  } = useExpertsData(
    initialData.experts, 
    loading,
    (newExperts) => updateContent({ experts: newExperts })
  );
  
  const { 
    services, 
    setServices, 
    loading: servicesLoading, 
    error: servicesError 
  } = useServicesData(
    initialData.services,
    (newServices) => updateContent({ services: newServices })
  );
  
  const { 
    heroSettings, 
    setHeroSettings,
    error: heroError
  } = useHeroSettings(
    initialData.heroSettings,
    (newSettings) => updateContent({ heroSettings: newSettings })
  );
  
  const testimonialsHook = useTestimonialsData(
    initialData.testimonials,
    (newTestimonials) => updateContent({ testimonials: newTestimonials })
  );
  
  const { 
    testimonials,
    error: testimonialsError
  } = testimonialsHook;

  // Create update callback for content changes
  const updateContent = useCallback((newContent: Partial<AdminContent>) => {
    if (loading) return;
    
    // Create a merged content object
    const content = {
      experts: newContent.experts || experts,
      services: newContent.services || services,
      heroSettings: newContent.heroSettings || heroSettings,
      testimonials: newContent.testimonials || testimonials
    };
    
    // Save to localStorage with error handling
    try {
      saveContentToLocalStorage(content);
    } catch (e) {
      console.error("Failed to save content to localStorage:", e);
      toast.error("Failed to save changes locally");
    }
  }, [loading, experts, services, heroSettings, testimonials]);
  
  // Create a setTestimonials function that wraps the original one
  const setTestimonials = useCallback((newTestimonials: React.SetStateAction<Testimonial[]>) => {
    if (typeof newTestimonials === 'function') {
      // If it's a function, apply it to the current testimonials
      const updatedTestimonials = newTestimonials(testimonials);
      testimonialsHook.fetchTestimonials(); // Refresh from the database
    } else {
      // If it's a direct value, use it
      testimonialsHook.fetchTestimonials(); // Refresh from the database
    }
  }, [testimonialsHook, testimonials]);

  // Update overall loading state
  useEffect(() => {
    setLoading(expertsLoading || servicesLoading);
    
    // Set error if any loading hook has an error - Convert all errors to strings
    if (expertsError) setError(expertsError instanceof Error ? expertsError.message : String(expertsError));
    else if (servicesError) setError(servicesError instanceof Error ? servicesError.message : String(servicesError));
    else if (heroError) setError(heroError instanceof Error ? heroError.message : String(heroError));
    else if (testimonialsError) setError(testimonialsError instanceof Error ? testimonialsError.message : String(testimonialsError));
    else setError(null);
  }, [expertsLoading, servicesLoading, expertsError, servicesError, heroError, testimonialsError]);

  // Save content to localStorage whenever it changes
  useEffect(() => {
    if (loading) return;

    updateContent({
      experts,
      services,
      heroSettings,
      testimonials
    });
  }, [experts, services, heroSettings, testimonials, loading, updateContent]);

  return {
    experts,
    setExperts,
    services,
    setServices,
    heroSettings,
    setHeroSettings,
    testimonials,
    setTestimonials,
    loading,
    error,
    refreshData
  };
};
