
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { resetProgramData } from '@/utils/resetProgramData';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ProgramDataReset: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  
  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all program data? This will delete all existing programs and re-add sample data.')) {
      return;
    }
    
    setIsResetting(true);
    try {
      const success = await resetProgramData();
      
      if (success) {
        toast.success('Program data reset successfully');
      } else {
        toast.error('Failed to reset program data');
      }
    } catch (error) {
      console.error('Error resetting data:', error);
      toast.error('An error occurred while resetting program data');
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="mb-6 p-4 border rounded-lg bg-amber-50 border-amber-200">
      <h3 className="font-medium text-amber-800 mb-2">Debug Tools</h3>
      <p className="text-sm text-amber-700 mb-3">
        If program data is not displaying correctly, you can reset all data to defaults.
        This will delete all existing programs and re-add sample data.
      </p>
      <Button 
        variant="outline" 
        className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
        onClick={handleReset}
        disabled={isResetting}
      >
        {isResetting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting Data...
          </>
        ) : (
          'Reset Program Data'
        )}
      </Button>
    </div>
  );
};

export default ProgramDataReset;
