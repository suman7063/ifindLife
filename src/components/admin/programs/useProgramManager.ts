
import { useState, useEffect, useCallback } from 'react';
import { Program, ProgramType, ProgramCategory } from '@/types/programs';
import { from } from '@/lib/supabase';
import { toast } from 'sonner';

export const useProgramManager = (programType: ProgramType) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch programs
  const fetchPrograms = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await from('programs')
        .select('*')
        .eq('programType', programType);

      if (error) throw error;
      
      setPrograms(data as unknown as Program[]);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to load programs');
    } finally {
      setIsLoading(false);
    }
  }, [programType]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms, programType]);

  // Handle opening the dialog for create/edit
  const handleOpenDialog = (program?: Program) => {
    setSelectedProgram(program || null);
    setIsDialogOpen(true);
  };

  // Save program (create or update)
  const handleSaveProgram = async (programData: Program) => {
    try {
      // Creating a new program
      if (!programData.id || programData.id === -1) {
        const { data, error } = await from('programs').insert([{
          title: programData.title,
          description: programData.description,
          duration: programData.duration,
          sessions: programData.sessions,
          price: programData.price,
          image: programData.image,
          category: programData.category,
          programType: programData.programType,
          enrollments: 0
        }]).select('*');

        if (error) throw error;
        
        toast.success('Program created successfully');
        setPrograms(prev => [...prev, data[0] as unknown as Program]);
      } 
      // Updating existing program
      else {
        const { id, ...updateData } = programData;
        const { error } = await from('programs')
          .update(updateData)
          .eq('id', id);

        if (error) throw error;
        
        toast.success('Program updated successfully');
        setPrograms(prev => 
          prev.map(p => p.id === id ? { ...p, ...updateData } : p)
        );
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Failed to save program');
    }
  };

  // Delete program
  const handleDeleteProgram = async (programId: number) => {
    try {
      const { error } = await from('programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;
      
      toast.success('Program deleted successfully');
      setPrograms(prev => prev.filter(p => p.id !== programId));
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
    }
  };

  // Get category color for UI
  const getCategoryColor = (category: string) => {
    switch (category as ProgramCategory) {
      case 'quick-ease':
        return 'bg-green-100 text-green-800';
      case 'resilience-building':
        return 'bg-blue-100 text-blue-800';
      case 'super-human':
        return 'bg-purple-100 text-purple-800';
      case 'issue-based':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return {
    programs,
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
