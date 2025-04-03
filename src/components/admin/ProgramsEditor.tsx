
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProgramFormDialog } from './ProgramFormDialog';
import { supabase } from '@/lib/supabase';
import { Program, ProgramType } from '@/types/programs';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ProgramsEditor = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProgramType>('wellness');

  // Fetch programs on component mount
  useEffect(() => {
    console.log('ProgramsEditor: Fetching programs');
    fetchPrograms();
  }, []);

  // Fetch programs from Supabase or localStorage
  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      let fetchedPrograms: Program[] = [];
      
      try {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('programs')
          .select('*');
          
        if (error) {
          console.error('Error fetching programs from Supabase:', error);
          throw error;
        }
        
        if (data) {
          fetchedPrograms = data as Program[];
          console.log('Programs fetched from Supabase:', fetchedPrograms.length);
        }
      } catch (e) {
        console.log('Supabase fetch failed, using localStorage fallback');
        // Fallback to localStorage
        const storedPrograms = localStorage.getItem('ifindlife-programs');
        if (storedPrograms) {
          fetchedPrograms = JSON.parse(storedPrograms);
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
          setPrograms(updatedPrograms);
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
            setPrograms([...programs, savedProgram]);
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
          setPrograms(updatedPrograms);
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
        setPrograms(updatedPrograms);
        toast.success('Program deleted successfully (localStorage)');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
    }
  };

  // Filter programs by type
  const filteredPrograms = programs.filter(program => program.programType === activeTab);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Programs Manager</h2>
          <p className="text-muted-foreground">Manage all mental wellness programs offered by iFindLife</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Program
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProgramType)}>
        <TabsList className="mb-6">
          <TabsTrigger value="wellness">Wellness Seekers</TabsTrigger>
          <TabsTrigger value="academic">Academic Institutes</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>
        
        {['wellness', 'academic', 'business'].map((type) => (
          <TabsContent key={type} value={type}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <Card key={n} className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-gray-200 rounded mb-2" />
                      <div className="flex gap-2 mt-3">
                        <div className="h-5 bg-gray-200 rounded w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {filteredPrograms.length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground mb-4">No programs found for this category</p>
                    <Button onClick={() => handleOpenDialog()} variant="outline">Add Your First Program</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((program) => (
                      <Card key={program.id} className="overflow-hidden">
                        <div 
                          className="h-40 bg-cover bg-center" 
                          style={{backgroundImage: `url(${program.image || 'https://source.unsplash.com/random/800x600/?wellness'})`}}
                        />
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{program.title}</CardTitle>
                          </div>
                          <CardDescription>₹{program.price} • {program.duration}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm line-clamp-3 mb-3">{program.description}</p>
                          <Badge className={getCategoryColor(program.category)}>
                            {program.category}
                          </Badge>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-between bg-gray-50">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(program)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProgram(program.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Program Edit/Create Dialog */}
      <ProgramFormDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProgram}
        program={selectedProgram}
      />
    </div>
  );
};

export default ProgramsEditor;
