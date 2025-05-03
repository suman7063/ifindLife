
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getDefaultTestimonials } from './utils/dataLoaders';

export interface Testimonial {
  id?: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials from Supabase
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convert from database format to our application format
      const formattedTestimonials = data.map(item => ({
        id: item.id,
        name: item.name,
        location: item.location,
        rating: item.rating,
        text: item.text,
        date: item.date,
        imageUrl: item.image_url
      }));
      
      setTestimonials(formattedTestimonials);
      updateCallback(formattedTestimonials);
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
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          name: testimonial.name,
          location: testimonial.location,
          rating: testimonial.rating,
          text: testimonial.text,
          date: testimonial.date,
          image_url: testimonial.imageUrl
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Refresh testimonials list after adding
      await fetchTestimonials();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error adding testimonial';
      setError(errorMessage);
      console.error('Error adding testimonial:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update a testimonial
  const updateTestimonial = async (id: string, testimonial: Testimonial) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('testimonials')
        .update({
          name: testimonial.name,
          location: testimonial.location,
          rating: testimonial.rating,
          text: testimonial.text,
          date: testimonial.date,
          image_url: testimonial.imageUrl
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Refresh testimonials list after updating
      await fetchTestimonials();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error updating testimonial';
      setError(errorMessage);
      console.error('Error updating testimonial:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a testimonial
  const deleteTestimonial = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Refresh testimonials list after deleting
      await fetchTestimonials();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error deleting testimonial';
      setError(errorMessage);
      console.error('Error deleting testimonial:', err);
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

  // Seed default testimonials if needed
  const seedDefaultTestimonials = async () => {
    try {
      setLoading(true);
      
      // Check if there are any testimonials in the database
      const { count, error: countError } = await supabase
        .from('testimonials')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        throw countError;
      }
      
      // If no testimonials exist, seed with defaults
      if (count === 0) {
        const defaultTestimonials = getDefaultTestimonials();
        
        // Insert default testimonials
        for (const testimonial of defaultTestimonials) {
          await supabase
            .from('testimonials')
            .insert([{
              name: testimonial.name,
              location: testimonial.location,
              rating: testimonial.rating,
              text: testimonial.text,
              date: testimonial.date,
              image_url: testimonial.imageUrl
            }]);
        }
        
        // Fetch the newly added testimonials
        await fetchTestimonials();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error seeding testimonials';
      setError(errorMessage);
      console.error('Error seeding default testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

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
