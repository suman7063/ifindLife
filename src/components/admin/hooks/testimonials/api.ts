
import { supabase } from '@/lib/supabase';
import { Testimonial } from './types';
import { safeDataTransform, supabaseCast } from '@/utils/supabaseUtils';
import { DatabaseTestimonial } from '@/types/supabase/tables';

/**
 * Fetch testimonials from Supabase
 */
export const fetchTestimonialsFromSupabase = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  // Use safeDataTransform to safely convert db format to app format
  return safeDataTransform<any, Testimonial>(
    data,
    error,
    (item) => ({
      id: item.id,
      name: item.name,
      location: item.location,
      rating: item.rating,
      text: item.text,
      date: item.date,
      imageUrl: item.image_url  // Map from image_url to imageUrl
    }),
    [] // Empty array fallback
  );
};

/**
 * Add a new testimonial to Supabase
 */
export const addTestimonialToSupabase = async (testimonial: Testimonial): Promise<any> => {
  // Create a database-compatible object from the testimonial
  const dbTestimonial = {
    name: testimonial.name,
    location: testimonial.location,
    rating: testimonial.rating,
    text: testimonial.text,
    date: testimonial.date,
    image_url: testimonial.imageUrl  // Map from imageUrl to image_url
  };
  
  const { data, error } = await supabase
    .from('testimonials')
    .insert([dbTestimonial as any])
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Update an existing testimonial in Supabase
 */
export const updateTestimonialInSupabase = async (id: string, testimonial: Testimonial): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .update({
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      text: testimonial.text,
      date: testimonial.date,
      image_url: testimonial.imageUrl  // Map from imageUrl to image_url
    } as any)
    .eq('id', id as any);
  
  if (error) {
    throw error;
  }
};

/**
 * Delete a testimonial from Supabase
 */
export const deleteTestimonialFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id as any);
  
  if (error) {
    throw error;
  }
};

/**
 * Count testimonials in Supabase
 */
export const countTestimonialsInSupabase = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    throw error;
  }
  
  return count || 0;
};
