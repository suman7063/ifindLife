
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Testimonial } from './types';
import { 
  fetchTestimonialsFromSupabase,
  addTestimonialToSupabase,
  updateTestimonialInSupabase,
  deleteTestimonialFromSupabase,
  countTestimonialsInSupabase
} from './api';
import { getDefaultTestimonials } from './defaults';

export function useTestimonialsData(
  initialTestimonials: Testimonial[] = [], 
  updateCallback: (testimonials: Testimonial[]) => void = () => {}
) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials from Supabase
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const formattedTestimonials = await fetchTestimonialsFromSupabase();
      
      if (formattedTestimonials.length > 0) {
        setTestimonials(formattedTestimonials);
        updateCallback(formattedTestimonials);
      } else {
        console.log('No testimonials found in the database');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading testimonials';
      setError(errorMessage);
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new testimonial
  const addTestimonial = async (testimonial: Testimonial) => {
    try {
      setLoading(true);
      await addTestimonialToSupabase(testimonial);
      
      // Refresh testimonials list after adding
      await fetchTestimonials();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error adding testimonial';
      setError(errorMessage);
      console.error('Error adding testimonial:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a testimonial
  const updateTestimonial = async (id: string, testimonial: Testimonial) => {
    try {
      setLoading(true);
      await updateTestimonialInSupabase(id, testimonial);
      
      // Refresh testimonials list after updating
      await fetchTestimonials();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error updating testimonial';
      setError(errorMessage);
      console.error('Error updating testimonial:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a testimonial
  const deleteTestimonial = async (id: string) => {
    try {
      setLoading(true);
      await deleteTestimonialFromSupabase(id);
      
      // Refresh testimonials list after deleting
      await fetchTestimonials();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error deleting testimonial';
      setError(errorMessage);
      console.error('Error deleting testimonial:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Seed default testimonials if needed
  const seedDefaultTestimonials = async () => {
    try {
      setLoading(true);
      
      // Check if there are any testimonials in the database
      const count = await countTestimonialsInSupabase();
      
      // If no testimonials exist, seed with defaults
      if (count === 0) {
        const defaultTestimonials = getDefaultTestimonials();
        
        // Insert default testimonials
        for (const testimonial of defaultTestimonials) {
          await addTestimonialToSupabase(testimonial);
        }
        
        // Fetch the newly added testimonials
        await fetchTestimonials();
        toast.success('Default testimonials added successfully');
      } else {
        toast.info('Database already contains testimonials');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error seeding testimonials';
      setError(errorMessage);
      console.error('Error seeding default testimonials:', err);
      toast.error('Failed to add default testimonials');
    } finally {
      setLoading(false);
    }
  };

  // Initialize testimonials if empty
  useEffect(() => {
    if (initialTestimonials.length === 0) {
      fetchTestimonials();
    }
  }, []);

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    seedDefaultTestimonials
  };
}

// Re-export the Testimonial type for easy import by consumers
export type { Testimonial } from './types';
