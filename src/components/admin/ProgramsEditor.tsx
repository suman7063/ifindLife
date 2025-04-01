
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Plus, 
  Trash2, 
  Search,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { from } from '@/lib/supabase';
import { Program, ProgramType } from '@/types/programs';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/useDialog';
import ProgramFormDialog from './ProgramFormDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProgramsEditor = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [programType, setProgramType] = useState<ProgramType | 'all'>('all');
  const { showDialog, DialogComponent } = useDialog();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setPrograms(data as unknown as Program[]);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to load programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProgram = () => {
    showDialog(
      <ProgramFormDialog 
        onSave={handleSaveProgram}
      />
    );
  };

  const handleEditProgram = (program: Program) => {
    showDialog(
      <ProgramFormDialog 
        program={program}
        onSave={handleSaveProgram}
      />
    );
  };

  const handleSaveProgram = async (programData: Partial<Program>) => {
    try {
      if (programData.id) {
        // Update existing program
        const { error } = await from('programs')
          .update({
            title: programData.title,
            description: programData.description,
            duration: programData.duration,
            sessions: programData.sessions,
            price: programData.price,
            image: programData.image,
            category: programData.category,
            programType: programData.programType
          })
          .eq('id', programData.id);
          
        if (error) throw error;
        
        toast.success('Program updated successfully');
      } else {
        // Create new program
        const { error } = await from('programs')
          .insert({
            title: programData.title,
            description: programData.description,
            duration: programData.duration,
            sessions: programData.sessions,
            price: programData.price,
            image: programData.image,
            category: programData.category,
            programType: programData.programType,
            created_at: new Date().toISOString(),
            enrollments: 0
          });
          
        if (error) throw error;
        
        toast.success('Program created successfully');
      }
      
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Failed to save program');
    }
  };

  const handleDeleteProgram = async (programId: number) => {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await from('programs')
        .delete()
        .eq('id', programId);
        
      if (error) throw error;
      
      setPrograms(programs.filter(p => p.id !== programId));
      toast.success('Program deleted successfully');
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
    }
  };

  // Filter programs by search query and program type
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = programType === 'all' || program.programType === programType;
    
    return matchesSearch && matchesType;
  });

  const getProgramTypeDisplay = (type: ProgramType) => {
    switch(type) {
      case 'wellness': return 'Wellness Programs';
      case 'academic': return 'Academic Programs';
      case 'business': return 'Business Programs';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search programs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleAddProgram}>
          <Plus className="mr-2 h-4 w-4" /> Add Program
        </Button>
      </div>
      
      <Tabs 
        defaultValue="all" 
        onValueChange={(value) => setProgramType(value as ProgramType | 'all')}
        className="w-full"
      >
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="all">All Programs</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        {/* Tab content container */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-ifind-purple" />
            </div>
          ) : filteredPrograms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">No programs found</p>
                <Button onClick={handleAddProgram} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Program
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map(program => (
                <Card key={program.id} className="overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <span className="text-white text-sm font-medium">
                        {program.category === 'quick-ease' && 'QuickEase'}
                        {program.category === 'resilience-building' && 'Resilience Building'}
                        {program.category === 'super-human' && 'Super Human'}
                        {program.category === 'issue-based' && 'Issue-Based'}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={() => handleEditProgram(program)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-8 w-8 bg-white/80 hover:bg-red-500 text-red-500 hover:text-white"
                        onClick={() => handleDeleteProgram(program.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-ifind-purple text-white text-xs px-2 py-1 rounded-full">
                        {getProgramTypeDisplay(program.programType)}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{program.title}</CardTitle>
                    <CardDescription>
                      {program.duration} • {program.sessions} sessions • ₹{program.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                    {program.enrollments !== undefined && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {program.enrollments} {program.enrollments === 1 ? 'enrollment' : 'enrollments'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>
      <DialogComponent />
    </div>
  );
};

export default ProgramsEditor;
