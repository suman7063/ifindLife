
import { supabase } from '@/lib/supabase';
import { Testimonial } from './types';
import { safeDataTransform, dbTypeConverter, safeSingleRecord } from '@/utils/supabaseUtils';

// Map database record to Testimonial type
const mapDbToTestimonial = (data: any): Testimonial => {
  return {
    id: String(data.id),
    name: data.name || '',
    text: data.text || '',
    rating: Number(data.rating) || 5,
    imageUrl: data.image_url || '',
    location: data.location || '',
    date: data.date || new Date().toISOString().split('T')[0]
  };
};

// Fetch all testimonials
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
    
    return data ? data.map(item => mapDbToTestimonial(dbTypeConverter(item))) : [];
  } catch (error) {
    console.error('Error in fetchTestimonials:', error);
    return [];
  }
};

// Fetch a single testimonial by ID
export const fetchTestimonialById = async (id: string): Promise<Testimonial | null> => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching testimonial by ID:', error);
      return null;
    }
    
    return data ? mapDbToTestimonial(data) : null;
  } catch (error) {
    console.error('Error in fetchTestimonialById:', error);
    return null;
  }
};

// Create a new testimonial
export const createTestimonial = async (testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial | null> => {
  try {
    // Convert from app format to DB format
    const dbTestimonial = {
      name: testimonial.name,
      text: testimonial.text || testimonial.content, // Use text or content
      rating: testimonial.rating,
      image_url: testimonial.imageUrl,
      location: testimonial.location || testimonial.company, // Use location or company
      date: testimonial.date || new Date().toISOString().split('T')[0]
    };
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([dbTestimonial])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating testimonial:', error);
      return null;
    }
    
    return data ? mapDbToTestimonial(data) : null;
  } catch (error) {
    console.error('Error in createTestimonial:', error);
    return null;
  }
};

// Update an existing testimonial
export const updateTestimonial = async (id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> => {
  try {
    // Convert from app format to DB format
    const dbUpdates: Record<string, any> = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.text !== undefined) dbUpdates.text = updates.text;
    if (updates.content !== undefined) dbUpdates.text = updates.content;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.company !== undefined) dbUpdates.location = updates.company;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    
    const { data, error } = await supabase
      .from('testimonials')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating testimonial:', error);
      return null;
    }
    
    return data ? mapDbToTestimonial(data) : null;
  } catch (error) {
    console.error('Error in updateTestimonial:', error);
    return null;
  }
};

// Delete a testimonial
export const deleteTestimonial = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting testimonial:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteTestimonial:', error);
    return false;
  }
};
