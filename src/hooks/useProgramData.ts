
import { useState, useEffect } from 'react';
import { Program, ProgramType, ProgramCategory } from '@/types/programs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useProgramData = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching programs:', fetchError);
        setError('Failed to load programs');
        toast.error('Failed to load programs');
        return;
      }

      const typedPrograms: Program[] = (data || []).map(program => ({
        ...program,
        programType: program.programType as ProgramType,
        category: program.category as ProgramCategory,
        enrollments: program.enrollments || 0,
        // Set default values for optional properties that may not exist in database
        is_favorite: false,
        is_featured: false
      }));

      setPrograms(typedPrograms);
    } catch (err) {
      console.error('Unexpected error fetching programs:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const refreshPrograms = () => {
    fetchPrograms();
  };

  return {
    programs,
    loading,
    error,
    refreshPrograms
  };
};
