
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import ProgramFormDialog from './ProgramFormDialog'; 
import { Program, ProgramType } from '@/types/programs';
import { toast } from 'sonner';
import { useProgramManager } from './programs/useProgramManager';
import ProgramGrid from './programs/ProgramGrid';

const ProgramsEditor = () => {
  const [activeTab, setActiveTab] = useState<ProgramType>('wellness');
  
  const {
    programs,
    isLoading,
    selectedProgram,
    isDialogOpen,
    setIsDialogOpen,
    handleOpenDialog,
    handleSaveProgram,
    handleDeleteProgram,
    getCategoryColor
  } = useProgramManager();

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
            <ProgramGrid
              programs={programs}
              isLoading={isLoading}
              onEdit={handleOpenDialog}
              onDelete={handleDeleteProgram}
              getCategoryColor={getCategoryColor}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Program Edit/Create Dialog */}
      <ProgramFormDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(program) => {
          handleSaveProgram(program);
          return Promise.resolve();
        }}
        program={selectedProgram}
      />
    </div>
  );
};

export default ProgramsEditor;
