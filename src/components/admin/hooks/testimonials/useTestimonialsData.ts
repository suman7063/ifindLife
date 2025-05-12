
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Testimonial } from './types';
import { defaultTestimonials } from './defaults';
import { safeDataTransform } from '@/utils/supabaseUtils';

export function useTestimonialsData(
  initialTestimonials: Testimonial[] = [],
  updateCallback: (testimonials: Testimonial[]) => void = () => {}
) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState(initialTestimonials.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials from Supabase or use defaults
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Attempt to get testimonials from Supabase
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Map DB testimonials to our format
        const formattedTestimonials = safeDataTransform(data, (item): Testimonial => ({
          id: item.id,
          name: item.name,
          location: item.location,
          text: item.text, 
          rating: item.rating,
          imageUrl: item.image_url,
          date: item.date
        }));
        
        setTestimonials(formattedTestimonials);
        updateCallback(formattedTestimonials);
      } else {
        // If no testimonials in the database, use defaults
        setTestimonials(defaultTestimonials);
        updateCallback(defaultTestimonials);
      }
    } catch (err) {
      console.error('Error in fetchTestimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to load testimonials');
      
      // Fall back to defaults if we have an error
      setTestimonials(defaultTestimonials);
      updateCallback(defaultTestimonials);
      toast.error('Could not load testimonials from database. Using defaults.');
    } finally {
      setLoading(false);
    }
  }, [updateCallback]);

  // Load testimonials on mount if we don't have initial data
  useEffect(() => {
    if (initialTestimonials.length === 0) {
      fetchTestimonials();
    }
  }, [fetchTestimonials, initialTestimonials.length]);

  // CRUD operations for testimonials
  const addTestimonial = async (newTestimonial: Testimonial): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          name: newTestimonial.name,
          location: newTestimonial.location,
          text: newTestimonial.text,
          rating: newTestimonial.rating,
          image_url: newTestimonial.imageUrl,
          date: newTestimonial.date
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding testimonial:', error);
        toast.error('Failed to add testimonial');
        return false;
      }
      
      // Add the new testimonial with the DB-generated ID
      const addedTestimonial: Testimonial = {
        id: data.id,
        name: data.name,
        location: data.location,
        text: data.text,
        rating: data.rating,
        imageUrl: data.image_url,
        date: data.date
      };
      
      setTestimonials(prev => [addedTestimonial, ...prev]);
      updateCallback([addedTestimonial, ...testimonials]);
      toast.success('Testimonial added successfully');
      return true;
    } catch (err) {
      console.error('Error in addTestimonial:', err);
      toast.error('Failed to add testimonial');
      return false;
    }
  };

  const updateTestimonial = async (id: string, updatedTestimonial: Testimonial): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({
          name: updatedTestimonial.name,
          location: updatedTestimonial.location,
          text: updatedTestimonial.text,
          rating: updatedTestimonial.rating,
          image_url: updatedTestimonial.imageUrl,
          date: updatedTestimonial.date
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating testimonial:', error);
        toast.error('Failed to update testimonial');
        return false;
      }
      
      setTestimonials(prev => 
        prev.map(item => item.id === id ? updatedTestimonial : item)
      );
      updateCallback(testimonials.map(item => item.id === id ? updatedTestimonial : item));
      toast.success('Testimonial updated successfully');
      return true;
    } catch (err) {
      console.error('Error in updateTestimonial:', err);
      toast.error('Failed to update testimonial');
      return false;
    }
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
        return false;
      }
      
      const updatedTestimonials = testimonials.filter(item => item.id !== id);
      setTestimonials(updatedTestimonials);
      updateCallback(updatedTestimonials);
      toast.success('Testimonial deleted successfully');
      return true;
    } catch (err) {
      console.error('Error in deleteTestimonial:', err);
      toast.error('Failed to delete testimonial');
      return false;
    }
  };

  const seedDefaultTestimonials = async (): Promise<boolean> => {
    try {
      // Insert default testimonials into the database
      const { error } = await supabase
        .from('testimonials')
        .insert(defaultTestimonials.map(t => ({
          name: t.name,
          location: t.location,
          text: t.text,
          rating: t.rating,
          image_url: t.imageUrl,
          date: t.date
        })));
      
      if (error) {
        console.error('Error seeding testimonials:', error);
        toast.error('Failed to seed testimonials');
        return false;
      }
      
      // Refresh testimonials from database
      await fetchTestimonials();
      toast.success('Default testimonials added successfully');
      return true;
    } catch (err) {
      console.error('Error in seedDefaultTestimonials:', err);
      toast.error('Failed to seed testimonials');
      return false;
    }
  };

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
}
