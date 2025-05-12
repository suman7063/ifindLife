
import { supabase } from '@/lib/supabase';
import { Testimonial } from './types';
import { safeDataTransform, dbTypeConverter, safeSingleRecord } from '@/utils/supabaseUtils';

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
  
  if (data && data.length > 0) {
    // Convert from database format to our application format using utility
    const formattedTestimonials = safeDataTransform(data, (item) => ({
      id: item.id,
      name: item.name,
      location: item.location,
      rating: item.rating,
      text: item.text,
      date: item.date,
      imageUrl: item.image_url  // Map from image_url to imageUrl
    }));
    
    return formattedTestimonials;
  }
  
  return [];
};

/**
 * Add a new testimonial to Supabase
 */
export const addTestimonialToSupabase = async (testimonial: Testimonial): Promise<any> => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([{
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      text: testimonial.text,
      date: testimonial.date,
      image_url: testimonial.imageUrl  // Map from imageUrl to image_url
    }])
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
    })
    .eq('id', id);
  
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
    .eq('id', id);
  
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
