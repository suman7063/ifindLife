
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

  // Initialize testimonials if empty
  useEffect(() => {
    if (initialTestimonials.length === 0) {
      const defaultTestimonials = getDefaultTestimonials();
      setTestimonials(defaultTestimonials);
      updateCallback(defaultTestimonials);
    }
  }, [initialTestimonials, updateCallback]);

  return {
    testimonials,
    setTestimonials
  };
}
