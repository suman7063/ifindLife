
import React from 'react';
import { Program } from '@/types/programs';

interface ProgramSummaryProps {
  program: Program;
}

const ProgramSummary: React.FC<ProgramSummaryProps> = ({ program }) => {
  return (
    <div className="flex items-center justify-between border p-4 rounded-lg">
      <div>
        <h3 className="font-medium">{program.title}</h3>
        <p className="text-sm text-muted-foreground">{program.duration} • {program.sessions} sessions</p>
      </div>
      <div className="text-lg font-semibold text-ifind-teal">₹{program.price}</div>
    </div>
  );
};

export default ProgramSummary;
