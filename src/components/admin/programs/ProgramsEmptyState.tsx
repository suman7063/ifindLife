
import React from 'react';
import { Button } from "@/components/ui/button";
import { Program } from '@/types/programs';

interface ProgramsEmptyStateProps {
  onAdd: () => void;
}

const ProgramsEmptyState: React.FC<ProgramsEmptyStateProps> = ({ onAdd }) => {
  return (
    <div className="text-center p-8 border border-dashed rounded-md">
      <p className="text-muted-foreground mb-4">No programs found for this category</p>
      <Button onClick={onAdd} variant="outline">Add Your First Program</Button>
    </div>
  );
};

export default ProgramsEmptyState;
