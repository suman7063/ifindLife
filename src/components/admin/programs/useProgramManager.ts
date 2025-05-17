
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useProgramManager = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add the missing UI state variables
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('title', { ascending: true });

      if (error) {
        throw error;
      }

      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to fetch programs.');
    } finally {
      setLoading(false);
    }
  };

  const addProgram = async (program) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .insert([program])
        .select();

      if (error) throw error;

      setPrograms([...programs, data[0]]);
      toast.success('Program added successfully!');
      return data[0];
    } catch (error) {
      console.error('Error adding program:', error);
      toast.error('Failed to add program.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgram = async (programId, updates) => {
    try {
      setIsLoading(true);
      // Convert programId to string for comparison if needed
      const stringId = String(programId);
      
      const { data, error } = await supabase
        .from('programs')
        .update(updates)
        .eq('id', programId)
        .select();

      if (error) throw error;

      setPrograms(
        programs.map((program) => 
          // Compare as strings to avoid type issues
          String(program.id) === stringId ? { ...program, ...updates } : program
        )
      );
      
      toast.success('Program updated successfully!');
      return data[0];
    } catch (error) {
      console.error('Error updating program:', error);
      toast.error('Failed to update program.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProgram = async (programId) => {
    try {
      setIsLoading(true);
      // Convert programId to string for comparison if needed
      const stringId = String(programId);
      
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;

      setPrograms(programs.filter((program) => String(program.id) !== stringId));
      toast.success('Program deleted successfully!');
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add the missing UI handler functions
  const handleOpenDialog = (program = null) => {
    setSelectedProgram(program);
    setIsDialogOpen(true);
  };

  const handleSaveProgram = async (programData) => {
    if (selectedProgram) {
      await updateProgram(selectedProgram.id, programData);
    } else {
      await addProgram(programData);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteProgram = async (programId) => {
    await deleteProgram(programId);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'mental-health': 'bg-emerald-100 text-emerald-800',
      'physical-health': 'bg-sky-100 text-sky-800',
      'personal-development': 'bg-amber-100 text-amber-800',
      'career': 'bg-purple-100 text-purple-800',
      'relationships': 'bg-pink-100 text-pink-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    
    return colors[category] || colors.default;
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
    isLoading,
    selectedProgram,
    isDialogOpen,
    setIsDialogOpen,
    handleOpenDialog,
    handleSaveProgram,
    handleDeleteProgram,
    getCategoryColor
  };
};
