
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { safeDataTransform, supabaseCast } from '@/utils/supabaseUtils';
import { Expert } from '../experts/types';

export const useExpertsData = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchExperts = async () => {
    try {
      setLoading(true);
      
      // Fetch experts from Supabase
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Process the data using our utility function
      const processedExperts = safeDataTransform<any, Expert>(
        data,
        error,
        (item) => ({
          id: item.id || '',
          name: item.name || '',
          experience: item.experience || '',
          specialization: item.specialization || 'General',
          average_rating: typeof item.average_rating === 'number' ? item.average_rating : 0,
          reviews_count: typeof item.reviews_count === 'number' ? item.reviews_count : 0,
          // Add other fields with safe defaults
          profile_picture: item.profile_picture || null,
          pricing: {},
          bio: item.bio || '',
          email: item.email || '',
          phone: item.phone || '',
          verified: Boolean(item.verified),
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
        }),
        [] // Empty array fallback
      );
      
      setExperts(processedExperts);
      setError(null);
    } catch (err) {
      console.error('Error fetching experts:', err);
      setError('Failed to load experts');
      toast.error('Failed to load experts');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExperts();
  }, []);
  
  const addExpert = async (expertData: Partial<Expert>) => {
    try {
      // Add validation logic here if needed
      
      const { data, error } = await supabase
        .from('experts')
        .insert([expertData as any])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Use the safe transform utility to ensure consistent formatting
        const newExpert = safeDataTransform<any, Expert>(
          data,
          null,
          (item) => ({
            id: item.id,
            name: item.name,
            experience: item.experience || '',
            specialization: item.specialization || 'General',
            average_rating: 0,
            reviews_count: 0,
            profile_picture: item.profile_picture || null,
            email: item.email || '',
            // Add other required fields
            pricing: {},
            bio: item.bio || '',
            phone: item.phone || '',
            verified: false,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }),
          []
        )[0];
        
        setExperts(prev => [newExpert, ...prev]);
        toast.success('Expert added successfully');
        return newExpert;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding expert:', err);
      toast.error('Failed to add expert');
      return null;
    }
  };
  
  const updateExpert = async (id: string, expertData: Partial<Expert>) => {
    try {
      // Add validation logic here if needed
      
      const { error } = await supabase
        .from('experts')
        .update(expertData as any)
        .eq('id', id as any);
      
      if (error) throw error;
      
      // Update the local state
      setExperts(prev =>
        prev.map(expert =>
          expert.id === id ? { ...expert, ...expertData } : expert
        )
      );
      
      toast.success('Expert updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating expert:', err);
      toast.error('Failed to update expert');
      return false;
    }
  };
  
  const deleteExpert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experts')
        .delete()
        .eq('id', id as any);
      
      if (error) throw error;
      
      // Remove from local state
      setExperts(prev => prev.filter(expert => expert.id !== id));
      
      toast.success('Expert deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting expert:', err);
      toast.error('Failed to delete expert');
      return false;
    }
  };
  
  return {
    experts,
    loading,
    error,
    fetchExperts,
    addExpert,
    updateExpert,
    deleteExpert,
  };
};
