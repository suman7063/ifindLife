
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { addSamplePrograms } from '@/utils/sampleProgramsData';
import { RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ProgramType } from '@/types/programs';

const ProgramDataReset = () => {
  const [isResetting, setIsResetting] = useState(false);
  
  // Function to reset database program data
  const resetProgramData = async () => {
    setIsResetting(true);
    
    try {
      // First, attempt to clear existing programs
      let deleted = false;
      
      try {
        // Try using Supabase if available
        const { error } = await supabase
          .from('programs')
          .delete()
          .neq('id', 0); // Delete all rows
          
        if (!error) {
          
          deleted = true;
        } else {
          console.error("Error deleting from Supabase:", error);
        }
      } catch (e) {

      }
      
      // If Supabase deletion failed or isn't available, clear localStorage
      if (!deleted) {
        localStorage.removeItem('ifindlife-programs');

      }
      
      // Add sample data for each program type
      const wellnessAdded = await addSamplePrograms('wellness');

      
      const academicAdded = await addSamplePrograms('academic' as ProgramType);

      
      const businessAdded = await addSamplePrograms('business' as ProgramType);

      
      // Show success message
      toast.success("Program data has been reset successfully!");
    } catch (error) {
      console.error("Error resetting program data:", error);
      toast.error("Failed to reset program data. See console for details.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="border-2 border-amber-300">
      <CardHeader className="bg-amber-50">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-amber-500" />
          Program Data Reset Tool
        </CardTitle>
        <CardDescription>
          Reset program data to sample values. This will overwrite any existing program data.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-amber-700 text-sm mb-4 bg-amber-50 p-3 rounded border border-amber-200">
          <strong>Warning:</strong> This action is irreversible. All existing programs will be deleted and replaced with sample data.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end bg-amber-50/50">
        <Button
          variant="destructive"
          onClick={resetProgramData}
          disabled={isResetting}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isResetting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Program Data
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramDataReset;
