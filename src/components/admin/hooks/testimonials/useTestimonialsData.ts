
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Testimonial } from './types';
import { fetchTestimonials } from './api';
import { defaultTestimonials } from './defaults';

export const useTestimonialsData = (
  initialTestimonials: Testimonial[] = [],
  onUpdate?: (testimonials: Testimonial[]) => void
) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials.length > 0 ? initialTestimonials : defaultTestimonials);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials from Supabase
  const loadTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedTestimonials = await fetchTestimonials();
      
      if (fetchedTestimonials && fetchedTestimonials.length > 0) {
        setTestimonials(fetchedTestimonials);
        if (onUpdate) onUpdate(fetchedTestimonials);
      } else if (initialTestimonials.length === 0) {
        // Use default testimonials if no data and no initial testimonials
        setTestimonials(defaultTestimonials);
        if (onUpdate) onUpdate(defaultTestimonials);
      }
    } catch (err) {
      console.error('Error loading testimonials:', err);
      setError(err instanceof Error ? err.message : 'Error loading testimonials');
      
      // Fallback to default testimonials on error
      if (initialTestimonials.length === 0) {
        setTestimonials(defaultTestimonials);
        if (onUpdate) onUpdate(defaultTestimonials);
      }
    } finally {
      setLoading(false);
    }
  }, [initialTestimonials, onUpdate]);

  // Load testimonials on initial mount
  useEffect(() => {
    if (initialTestimonials.length === 0) {
      loadTestimonials();
    }
  }, [loadTestimonials, initialTestimonials.length]);

  return {
    testimonials,
    setTestimonials,
    loading,
    error,
    refreshTestimonials: loadTestimonials
  };
};
