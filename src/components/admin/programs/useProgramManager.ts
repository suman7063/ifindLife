import { useState } from 'react';
import { toast } from 'sonner';
import { Program } from '@/types/programs';
import { supabase } from '@/lib/supabase';

export const useProgramManager = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setPrograms(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProgram = async (program: Omit<Program, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('programs')
        .insert([program])
        .select();

      if (error) {
        setError(error.message);
        toast.error(`Failed to add program: ${error.message}`);
      } else {
        setPrograms([...programs, ...(data as Program[])]);
        toast.success('Program added successfully!');
        await fetchPrograms(); // Refresh programs after adding
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to add program: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateProgram = async (programId: string, updates: Partial<Program>) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('programs')
        .update(updates)
        .eq('id', programId);

      if (error) {
        setError(error.message);
        toast.error(`Failed to update program: ${error.message}`);
      } else {
        setPrograms(programs.map(p => (p.id === programId ? { ...p, ...updates } : p)));
        toast.success('Program updated successfully!');
        await fetchPrograms(); // Refresh programs after updating
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to update program: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteProgram = async (programId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) {
        setError(error.message);
        toast.error(`Failed to delete program: ${error.message}`);
      } else {
        setPrograms(programs.filter(p => p.id !== programId));
        toast.success('Program deleted successfully!');
        await fetchPrograms(); // Refresh programs after deleting
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to delete program: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    addProgram,
    updateProgram,
    deleteProgram,
  };
};
