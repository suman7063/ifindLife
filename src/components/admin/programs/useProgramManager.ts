
import { useState, useEffect } from 'react';
import { Program, ProgramInsert, ProgramUpdate } from '@/types/programs';
import { supabase } from '@/integrations/supabase/client';

export const useProgramManager = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      // Transform the data to match our Program type
      const transformedData: Program[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        duration: item.duration,
        sessions: item.sessions,
        price: item.price,
        image: item.image,
        category: item.category,
        programType: item.programType,
        created_at: item.created_at,
        enrollments: item.enrollments || 0,
        is_favorite: item.is_favorite || false,
        is_featured: item.is_featured || false
      }));
      
      setPrograms(transformedData);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  const addProgram = async (programData: ProgramInsert): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('programs')
        .insert([{
          title: programData.title,
          description: programData.description,
          duration: programData.duration,
          sessions: programData.sessions,
          price: programData.price,
          image: programData.image,
          category: programData.category,
          programType: programData.programType,
          enrollments: programData.enrollments || 0,
          is_favorite: programData.is_favorite || false,
          is_featured: programData.is_featured || false
        }])
        .select();

      if (insertError) throw insertError;

      await fetchPrograms();
      return true;
    } catch (err) {
      console.error('Error adding program:', err);
      setError(err instanceof Error ? err.message : 'Failed to add program');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProgram = async (id: number, updates: ProgramUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('programs')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchPrograms();
      return true;
    } catch (err) {
      console.error('Error updating program:', err);
      setError(err instanceof Error ? err.message : 'Failed to update program');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProgram = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPrograms(prev => prev.filter(program => program.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting program:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete program');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const bulkInsertPrograms = async (programsData: ProgramInsert[]): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Insert programs one by one to avoid type issues
      for (const programData of programsData) {
        const { error: insertError } = await supabase
          .from('programs')
          .insert([{
            title: programData.title,
            description: programData.description,
            duration: programData.duration,
            sessions: programData.sessions,
            price: programData.price,
            image: programData.image,
            category: programData.category,
            programType: programData.programType,
            enrollments: programData.enrollments || 0,
            is_favorite: programData.is_favorite || false,
            is_featured: programData.is_featured || false
          }]);

        if (insertError) throw insertError;
      }

      await fetchPrograms();
      return true;
    } catch (err) {
      console.error('Error bulk inserting programs:', err);
      setError(err instanceof Error ? err.message : 'Failed to bulk insert programs');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    addProgram,
    updateProgram,
    deleteProgram,
    bulkInsertPrograms
  };
};
