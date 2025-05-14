
import React from 'react';
import { Program } from '@/types/programs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';

interface ProgramMetadataProps {
  program: Program;
}

const ProgramMetadata: React.FC<ProgramMetadataProps> = ({ program }) => {
  return (
    <div className="space-y-6 mb-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{program.title}</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-gray-100">
            {program.category}
          </Badge>
          {program.programType && (
            <Badge variant="outline" className="bg-gray-100">
              {program.programType}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <Clock className="h-5 w-5 text-gray-500 mb-1" />
          <span className="text-sm text-gray-600">{program.duration}</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <Calendar className="h-5 w-5 text-gray-500 mb-1" />
          <span className="text-sm text-gray-600">{program.sessions} sessions</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <Users className="h-5 w-5 text-gray-500 mb-1" />
          <span className="text-sm text-gray-600">{program.enrollments || 0} enrolled</span>
        </div>
      </div>
    </div>
  );
};

export default ProgramMetadata;
