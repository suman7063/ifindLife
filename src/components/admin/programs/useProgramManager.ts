
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Program, ProgramType, ProgramUpdate } from '@/types/programs';
import { toast } from 'sonner';

export const useProgramManager = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [activeTab, setActiveTab] = useState<ProgramType>('wellness');

  // Fetch programs from the database
  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching programs:', error);
        toast.error('Failed to load programs');
        return;
      }
      
      // Type cast the data to ensure it matches our Program interface
      const typedPrograms: Program[] = (data || []).map(program => ({
        ...program,
        programType: program.programType as ProgramType
      }));
      
      setPrograms(typedPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load programs on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);
  
  // Open dialog for creating/editing a program
  const handleOpenDialog = (program?: Program) => {
    if (program) {
      setSelectedProgram(program);
    } else {
      setSelectedProgram(null); // For creating a new program
    }
    
    setIsDialogOpen(true);
  };
  
  // Save a program (create or update)
  const handleSaveProgram = async (programData: ProgramUpdate) => {
    try {
      setIsLoading(true);
      
      if (selectedProgram?.id) {
        // Update existing program
        const { error } = await supabase
          .from('programs')
          .update(programData)
          .eq('id', selectedProgram.id);
          
        if (error) {
          console.error('Error updating program:', error);
          toast.error('Failed to update program');
          return false;
        }
        
        toast.success('Program updated successfully');
      } else {
        // Create new program
        const { error } = await supabase
          .from('programs')
          .insert([programData]);
          
        if (error) {
          console.error('Error creating program:', error);
          toast.error('Failed to create program');
          return false;
        }
        
        toast.success('Program created successfully');
      }
      
      setIsDialogOpen(false);
      fetchPrograms();
      return true;
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a program
  const handleDeleteProgram = async (programId: number) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);
        
      if (error) {
        console.error('Error deleting program:', error);
        toast.error('Failed to delete program');
        return false;
      }
      
      toast.success('Program deleted successfully');
      fetchPrograms();
      return true;
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get category color for a program
  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'mental health':
        return 'bg-blue-500';
      case 'career':
        return 'bg-green-500';
      case 'relationships':
        return 'bg-pink-500';
      case 'wellness':
        return 'bg-purple-500';
      case 'education':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
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
    getCategoryColor,
    activeTab,
    setActiveTab
  };
};
