
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Testimonial } from './types';
import { defaultTestimonials } from './defaults';
import { safeSingleRecord, safeDataTransform } from '@/utils/supabaseUtils';

export const useTestimonialsData = (
  initialTestimonials: Testimonial[] = [],
  updateParentState?: (testimonials: Testimonial[]) => void
) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials from Supabase
  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First check localStorage
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent);
          if (parsedContent.testimonials && parsedContent.testimonials.length > 0) {
            console.log('Testimonials found in localStorage:', parsedContent.testimonials.length);
            const storedTestimonials = parsedContent.testimonials;
            setTestimonials(storedTestimonials);
            if (updateParentState) updateParentState(storedTestimonials);
            return;
          }
        } catch (parseError) {
          console.error('Error parsing localStorage content:', parseError);
        }
      }
      
      // Try to fetch from Supabase
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform from DB format to component format if needed
        const formattedTestimonials = data.map((item: any): Testimonial => ({
          id: item.id,
          name: item.name,
          text: item.text,
          location: item.location,
          rating: item.rating,
          imageUrl: item.image_url,
          date: item.date || new Date(item.created_at).toLocaleDateString()
        }));
        
        setTestimonials(formattedTestimonials);
        if (updateParentState) updateParentState(formattedTestimonials);
        
        // Save to localStorage
        saveToLocalStorage(formattedTestimonials);
      } else {
        // If no data, use defaults
        setTestimonials(defaultTestimonials);
        if (updateParentState) updateParentState(defaultTestimonials);
      }
    } catch (err: any) {
      console.error('Error fetching testimonials:', err);
      setError(err.message || 'Failed to fetch testimonials');
      
      // Fall back to defaults on error
      setTestimonials(defaultTestimonials);
      if (updateParentState) updateParentState(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  // Save testimonials to localStorage
  const saveToLocalStorage = (data: Testimonial[]) => {
    try {
      const content = JSON.parse(localStorage.getItem('ifindlife-content') || '{}');
      localStorage.setItem('ifindlife-content', JSON.stringify({
        ...content,
        testimonials: data
      }));
      console.log('Content saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Add a new testimonial
  const addTestimonial = async (newTestimonial: Testimonial) => {
    setLoading(true);
    
    try {
      // Generate an ID if one doesn't exist
      if (!newTestimonial.id) {
        newTestimonial.id = Date.now().toString();
      }
      
      // First try to save to Supabase
      const { error } = await supabase.from('testimonials').insert({
        id: newTestimonial.id,
        name: newTestimonial.name,
        text: newTestimonial.text,
        location: newTestimonial.location,
        rating: newTestimonial.rating,
        image_url: newTestimonial.imageUrl,
        date: newTestimonial.date
      });
      
      if (error) {
        console.warn('Could not save testimonial to Supabase:', error);
        // Continue to update local state even if Supabase fails
      }
      
      // Update local state
      const updatedTestimonials = [...testimonials, newTestimonial];
      setTestimonials(updatedTestimonials);
      if (updateParentState) updateParentState(updatedTestimonials);
      
      // Update localStorage
      saveToLocalStorage(updatedTestimonials);
      
      return newTestimonial;
    } catch (err: any) {
      console.error('Error adding testimonial:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing testimonial
  const updateTestimonial = async (id: string, updatedTestimonial: Testimonial) => {
    setLoading(true);
    
    try {
      // First try to update in Supabase
      const { error } = await supabase
        .from('testimonials')
        .update({
          name: updatedTestimonial.name,
          text: updatedTestimonial.text,
          location: updatedTestimonial.location,
          rating: updatedTestimonial.rating,
          image_url: updatedTestimonial.imageUrl,
          date: updatedTestimonial.date
        })
        .eq('id', id);
      
      if (error) {
        console.warn('Could not update testimonial in Supabase:', error);
        // Continue to update local state even if Supabase fails
      }
      
      // Update local state
      const updatedTestimonials = testimonials.map(item => 
        item.id === id ? { ...item, ...updatedTestimonial } : item
      );
      
      setTestimonials(updatedTestimonials);
      if (updateParentState) updateParentState(updatedTestimonials);
      
      // Update localStorage
      saveToLocalStorage(updatedTestimonials);
      
      return updatedTestimonial;
    } catch (err: any) {
      console.error('Error updating testimonial:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a testimonial
  const deleteTestimonial = async (id: string) => {
    setLoading(true);
    
    try {
      // First try to delete from Supabase
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.warn('Could not delete testimonial from Supabase:', error);
        // Continue to update local state even if Supabase fails
      }
      
      // Update local state
      const updatedTestimonials = testimonials.filter(item => item.id !== id);
      setTestimonials(updatedTestimonials);
      if (updateParentState) updateParentState(updatedTestimonials);
      
      // Update localStorage
      saveToLocalStorage(updatedTestimonials);
      
      return true;
    } catch (err: any) {
      console.error('Error deleting testimonial:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Seed default testimonials
  const seedDefaultTestimonials = async () => {
    setLoading(true);
    
    try {
      setTestimonials(defaultTestimonials);
      if (updateParentState) updateParentState(defaultTestimonials);
      
      // Update localStorage
      saveToLocalStorage(defaultTestimonials);
      
      // Optionally try to save to Supabase
      for (const testimonial of defaultTestimonials) {
        await supabase.from('testimonials').upsert({
          id: testimonial.id,
          name: testimonial.name,
          text: testimonial.text,
          location: testimonial.location,
          rating: testimonial.rating,
          image_url: testimonial.imageUrl,
          date: testimonial.date
        }, { onConflict: 'id' });
      }
      
      return true;
    } catch (err: any) {
      console.error('Error seeding testimonials:', err);
      throw err;
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
};
