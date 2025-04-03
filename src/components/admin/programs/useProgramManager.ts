
import { useState, useEffect } from 'react';
import { Program, ProgramType } from '@/types/programs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useProgramManager = (programType: ProgramType = 'wellness') => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch programs on component mount
  useEffect(() => {
    console.log('ProgramsEditor: Fetching programs');
    fetchPrograms();
  }, [programType]);

  // Fetch programs from Supabase or localStorage
  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      let fetchedPrograms: Program[] = [];
      
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('programType', programType);
          
        if (error) throw error;
        
        if (data) {
          fetchedPrograms = data as Program[];
          console.log('Programs fetched from Supabase:', fetchedPrograms.length);
        }
      } catch (e) {
        console.log('Supabase fetch failed, using localStorage fallback');
        // Fallback to localStorage
        const storedPrograms = localStorage.getItem('ifindlife-programs');
        if (storedPrograms) {
          const allPrograms = JSON.parse(storedPrograms) as Program[];
          fetchedPrograms = allPrograms.filter(p => p.programType === programType);
          console.log('Programs fetched from localStorage:', fetchedPrograms.length);
        }
      }
      
      setPrograms(fetchedPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to fetch programs');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog open for creating/editing a program
  const handleOpenDialog = (program?: Program) => {
    if (program) {
      console.log('Opening dialog for edit with program:', program);
      setSelectedProgram(program);
    } else {
      console.log('Opening dialog for new program');
      setSelectedProgram(null);
    }
    setIsDialogOpen(true);
  };

  // Save a new or updated program
  const handleSaveProgram = async (programData: Program) => {
    try {
      let savedProgram: Program;
      
      if (selectedProgram?.id) {
        // Update existing program
        savedProgram = { ...programData, id: selectedProgram.id };
        
        try {
          // Try to update in Supabase
          const { error } = await supabase
            .from('programs')
            .update(savedProgram)
            .eq('id', selectedProgram.id);
            
          if (error) throw error;
          
          // Update local state
          setPrograms(programs.map(p => p.id === selectedProgram.id ? savedProgram : p));
          toast.success('Program updated successfully');
        } catch (e) {
          console.log('Supabase update failed, using localStorage fallback');
          // Fallback to localStorage
          const storedPrograms = JSON.parse(localStorage.getItem('ifindlife-programs') || '[]');
          const updatedPrograms = storedPrograms.map((p: Program) => 
            p.id === selectedProgram.id ? savedProgram : p
          );
          localStorage.setItem('ifindlife-programs', JSON.stringify(updatedPrograms));
          setPrograms(prev => prev.map(p => p.id === selectedProgram.id ? savedProgram : p));
          toast.success('Program updated successfully (localStorage)');
        }
      } else {
        // Create new program
        try {
          // Try to insert in Supabase
          const { data, error } = await supabase
            .from('programs')
            .insert({ ...programData })
            .select();
            
          if (error) throw error;
          
          if (data && data[0]) {
            savedProgram = data[0] as Program;
            // Update local state
            setPrograms(prev => [...prev, savedProgram]);
            toast.success('Program created successfully');
          }
        } catch (e) {
          console.log('Supabase insert failed, using localStorage fallback');
          // Fallback to localStorage
          const storedPrograms = JSON.parse(localStorage.getItem('ifindlife-programs') || '[]');
          const newId = storedPrograms.length > 0 
            ? Math.max(...storedPrograms.map((p: Program) => p.id)) + 1 
            : 1;
          
          savedProgram = { ...programData, id: newId };
          const updatedPrograms = [...storedPrograms, savedProgram];
          localStorage.setItem('ifindlife-programs', JSON.stringify(updatedPrograms));
          setPrograms(prev => [...prev, savedProgram]);
          toast.success('Program created successfully (localStorage)');
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Failed to save program');
    }
  };

  // Delete a program
  const handleDeleteProgram = async (programId: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      try {
        // Try to delete from Supabase
        const { error } = await supabase
          .from('programs')
          .delete()
          .eq('id', programId);
          
        if (error) throw error;
        
        // Update local state
        setPrograms(programs.filter(p => p.id !== programId));
        toast.success('Program deleted successfully');
      } catch (e) {
        console.log('Supabase delete failed, using localStorage fallback');
        // Fallback to localStorage
        const storedPrograms = JSON.parse(localStorage.getItem('ifindlife-programs') || '[]');
        const updatedPrograms = storedPrograms.filter((p: Program) => p.id !== programId);
        localStorage.setItem('ifindlife-programs', JSON.stringify(updatedPrograms));
        setPrograms(prev => prev.filter(p => p.id !== programId));
        toast.success('Program deleted successfully (localStorage)');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
    }
  };

  // Function to get program category label color
  const getCategoryColor = (category: string) => {
    switch (category) {
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
    fetchPrograms,
    getCategoryColor
  };
};
