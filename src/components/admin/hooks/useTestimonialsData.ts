
import { useState, useEffect } from 'react';
import { getDefaultTestimonials } from './utils/dataLoaders';

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  imageUrl: string;
}

export function useTestimonialsData(
  initialTestimonials: Testimonial[] = [], 
  updateCallback: (testimonials: Testimonial[]) => void = () => {}
) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [error, setError] = useState<string | null>(null);

  // Initialize testimonials if empty
  useEffect(() => {
    try {
      if (initialTestimonials.length === 0) {
        const defaultTestimonials = getDefaultTestimonials();
        setTestimonials(defaultTestimonials);
        updateCallback(defaultTestimonials);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading testimonials';
      setError(errorMessage);
      console.error('Error initializing testimonials:', err);
    }
  }, [initialTestimonials, updateCallback]);

  return {
    testimonials,
    setTestimonials,
    error
  };
}
