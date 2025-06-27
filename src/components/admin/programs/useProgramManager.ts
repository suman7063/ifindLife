
import { useState, useEffect } from 'react';
import { Program, ProgramInsert, ProgramUpdate } from '@/types/programs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProgramManager = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      toast.success('Program added successfully');
      return true;
    } catch (err) {
      console.error('Error adding program:', err);
      setError(err instanceof Error ? err.message : 'Failed to add program');
      toast.error('Failed to add program');
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
      toast.success('Program updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating program:', err);
      setError(err instanceof Error ? err.message : 'Failed to update program');
      toast.error('Failed to update program');
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
      toast.success('Program deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting program:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete program');
      toast.error('Failed to delete program');
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
      toast.success('Programs imported successfully');
      return true;
    } catch (err) {
      console.error('Error bulk inserting programs:', err);
      setError(err instanceof Error ? err.message : 'Failed to bulk insert programs');
      toast.error('Failed to import programs');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (program?: Program) => {
    setSelectedProgram(program || null);
    setIsDialogOpen(true);
  };

  const handleSaveProgram = async (program: Program) => {
    const success = program.id 
      ? await updateProgram(program.id, program)
      : await addProgram(program);
    
    if (success) {
      setIsDialogOpen(false);
      setSelectedProgram(null);
    }
  };

  const handleDeleteProgram = async (programId: number): Promise<boolean> => {
    return await deleteProgram(programId);
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      wellness: 'bg-green-100 text-green-800',
      mental_health: 'bg-blue-100 text-blue-800',
      fitness: 'bg-orange-100 text-orange-800',
      nutrition: 'bg-yellow-100 text-yellow-800',
      career: 'bg-purple-100 text-purple-800',
      relationships: 'bg-pink-100 text-pink-800',
      personal_development: 'bg-indigo-100 text-indigo-800',
      academic: 'bg-cyan-100 text-cyan-800',
      business: 'bg-gray-100 text-gray-800',
      productivity: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    loading,
    isLoading: loading, // Provide both for compatibility
    error,
    selectedProgram,
    isDialogOpen,
    setIsDialogOpen,
    fetchPrograms,
    addProgram,
    updateProgram,
    deleteProgram,
    bulkInsertPrograms,
    handleOpenDialog,
    handleSaveProgram,
    handleDeleteProgram,
    getCategoryColor
  };
};
