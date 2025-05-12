
import { useState, useEffect } from 'react';
import { Testimonial } from './types';
import { fetchTestimonialsFromSupabase } from './api';
import { DEFAULT_TESTIMONIALS, getDefaultTestimonials } from './defaults';

export const useTestimonialsData = (
  initialTestimonials: Testimonial[] = [],
  updateCallback: (testimonials: Testimonial[]) => void = () => {}
) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch testimonials from Supabase
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const fetchedTestimonials = await fetchTestimonialsFromSupabase();
      
      if (fetchedTestimonials.length > 0) {
        setTestimonials(fetchedTestimonials);
        updateCallback(fetchedTestimonials);
      } else {
        console.log('No testimonials found, using default data');
        setTestimonials(DEFAULT_TESTIMONIALS);
        updateCallback(DEFAULT_TESTIMONIALS);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching testimonials');
      
      // Fallback to defaults if error
      if (testimonials.length === 0) {
        setTestimonials(DEFAULT_TESTIMONIALS);
        updateCallback(DEFAULT_TESTIMONIALS);
      }
    } finally {
      setLoading(false);
    }
  };

  // Additional utility functions for testimonial management
  const addTestimonial = async (testimonial: Testimonial) => {
    setTestimonials(prev => [...prev, testimonial]);
    updateCallback([...testimonials, testimonial]);
  };

  const updateTestimonial = async (id: string, updatedTestimonial: Partial<Testimonial>) => {
    setTestimonials(prev => 
      prev.map(t => t.id === id ? { ...t, ...updatedTestimonial } : t)
    );
    updateCallback(testimonials.map(t => t.id === id ? { ...t, ...updatedTestimonial } : t));
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    updateCallback(testimonials.filter(t => t.id !== id));
  };

  const seedDefaultTestimonials = () => {
    const defaultData = getDefaultTestimonials();
    setTestimonials(defaultData);
    updateCallback(defaultData);
  };

  // Load testimonials on component mount if needed
  useEffect(() => {
    // If we already have testimonials data, don't fetch again
    if (initialTestimonials.length > 0) {
      return;
    }
    
    fetchTestimonials();
  }, [initialTestimonials]);

  return {
    testimonials,
    setTestimonials,
    loading,
    error,
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    seedDefaultTestimonials
  };
};
