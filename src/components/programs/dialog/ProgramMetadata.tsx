
import React from 'react';
import { Clock, Calendar, Users } from 'lucide-react';
import { Program } from '@/types/programs';

interface ProgramMetadataProps {
  program: Program;
}

const ProgramMetadata: React.FC<ProgramMetadataProps> = ({ program }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
        <Clock className="h-4 w-4 text-ifind-teal" />
        <span className="text-sm">{program.duration}</span>
      </div>
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
        <Calendar className="h-4 w-4 text-ifind-teal" />
        <span className="text-sm">{program.sessions} sessions</span>
      </div>
      {program.enrollments && program.enrollments > 0 && (
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
          <Users className="h-4 w-4 text-ifind-teal" />
          <span className="text-sm">{program.enrollments} enrolled</span>
        </div>
      )}
    </div>
  );
};

export default ProgramMetadata;
