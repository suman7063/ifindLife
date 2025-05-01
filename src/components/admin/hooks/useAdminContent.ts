
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Expert } from '@/components/admin/experts/types';
import { initialHeroSettings } from '@/data/initialAdminData';
import { useExpertsData } from './useExpertsData';
import { useServicesData, ServiceCategory } from './useServicesData';
import { useHeroSettings, HeroSettings } from './useHeroSettings';
import { useTestimonialsData, Testimonial } from './useTestimonialsData';
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
} => {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<{
    experts: Expert[];
    services: ServiceCategory[];
    heroSettings: HeroSettings;
    testimonials: Testimonial[];
  }>({
    experts: [],
    services: [],
    heroSettings: initialHeroSettings,
    testimonials: []
  });

  // Load content from localStorage on initial mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
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
      } catch (error) {
        console.error('Error loading content:', error);
        toast.error('Error loading content');
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  // Create update callback for content changes
  const updateContent = (newContent: Partial<AdminContent>) => {
    if (loading) return;
    
    const content = {
      experts: newContent.experts || experts,
      services: newContent.services || services,
      heroSettings: newContent.heroSettings || heroSettings,
      testimonials: newContent.testimonials || testimonials
    };
    
    saveContentToLocalStorage(content);
  };

  // Use the smaller hooks with the update callback
  const { experts, setExperts } = useExpertsData(
    initialData.experts, 
    loading,
    (newExperts) => updateContent({ experts: newExperts })
  );
  
  const { services, setServices } = useServicesData(
    initialData.services,
    (newServices) => updateContent({ services: newServices })
  );
  
  const { heroSettings, setHeroSettings } = useHeroSettings(
    initialData.heroSettings,
    (newSettings) => updateContent({ heroSettings: newSettings })
  );
  
  const { testimonials, setTestimonials } = useTestimonialsData(
    initialData.testimonials,
    (newTestimonials) => updateContent({ testimonials: newTestimonials })
  );

  // Save content to localStorage whenever it changes
  useEffect(() => {
    if (loading) return;

    updateContent({
      experts,
      services,
      heroSettings,
      testimonials
    });
  }, [experts, services, heroSettings, testimonials, loading]);

  return {
    experts,
    setExperts,
    services,
    setServices,
    heroSettings,
    setHeroSettings,
    testimonials,
    setTestimonials,
    loading
  };
};
