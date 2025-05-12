
import { useState, useEffect } from 'react';
import { Testimonial } from './types';
import { fetchTestimonialsFromSupabase } from './api';
import { DEFAULT_TESTIMONIALS } from './defaults';

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
    fetchTestimonials
  };
};
