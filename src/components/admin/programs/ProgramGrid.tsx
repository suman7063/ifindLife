
import React from 'react';
import { Program } from '@/types/programs';
import { ProgramGridProps } from './types';
import ProgramCard from './ProgramCard';
import ProgramsEmptyState from './ProgramsEmptyState';
import ProgramsLoadingSkeleton from './ProgramsLoadingSkeleton';

const ProgramGrid: React.FC<ProgramGridProps> = ({ 
  programs, 
  isLoading, 
  onEdit, 
  onDelete,
  getCategoryColor 
}) => {
  if (isLoading) {
    return <ProgramsLoadingSkeleton />;
  }

  if (programs.length === 0) {
    return <ProgramsEmptyState onAdd={() => onEdit({} as Program)} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onEdit={onEdit}
          onDelete={onDelete}
          getCategoryColor={getCategoryColor}
        />
      ))}
    </div>
  );
};

export default ProgramGrid;
