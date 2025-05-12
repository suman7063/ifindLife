
import { useState, useEffect, useCallback } from 'react';
import { Testimonial } from './types';
import { fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from './api';
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

  // Add a new testimonial
  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      setLoading(true);
      const newTestimonial = await createTestimonial(testimonial);
      if (newTestimonial) {
        const updatedTestimonials = [...testimonials, newTestimonial];
        setTestimonials(updatedTestimonials);
        if (onUpdate) onUpdate(updatedTestimonials);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding testimonial:', err);
      setError(err instanceof Error ? err.message : 'Error adding testimonial');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing testimonial
  const updateTestimonialById = async (id: string, updates: Partial<Testimonial>) => {
    try {
      setLoading(true);
      const updatedTestimonial = await updateTestimonial(id, updates);
      if (updatedTestimonial) {
        const updatedTestimonials = testimonials.map(t => 
          t.id === id ? updatedTestimonial : t
        );
        setTestimonials(updatedTestimonials);
        if (onUpdate) onUpdate(updatedTestimonials);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating testimonial:', err);
      setError(err instanceof Error ? err.message : 'Error updating testimonial');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a testimonial
  const deleteTestimonialById = async (id: string) => {
    try {
      setLoading(true);
      const success = await deleteTestimonial(id);
      if (success) {
        const updatedTestimonials = testimonials.filter(t => t.id !== id);
        setTestimonials(updatedTestimonials);
        if (onUpdate) onUpdate(updatedTestimonials);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      setError(err instanceof Error ? err.message : 'Error deleting testimonial');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Seed default testimonials
  const seedDefaultTestimonials = async () => {
    try {
      setLoading(true);
      const promises = defaultTestimonials.map(t => createTestimonial(t));
      await Promise.all(promises);
      await loadTestimonials();
      return true;
    } catch (err) {
      console.error('Error seeding default testimonials:', err);
      setError(err instanceof Error ? err.message : 'Error seeding testimonials');
      return false;
    } finally {
      setLoading(false);
    }
  };

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
    refreshTestimonials: loadTestimonials,
    fetchTestimonials: loadTestimonials,
    addTestimonial,
    updateTestimonial: updateTestimonialById,
    deleteTestimonial: deleteTestimonialById,
    seedDefaultTestimonials
  };
};
