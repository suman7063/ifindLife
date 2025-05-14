
import React from 'react';

interface ProgramDescriptionProps {
  description: string;
}

const ProgramDescription: React.FC<ProgramDescriptionProps> = ({ description }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Description</h3>
      <div className="text-gray-700 whitespace-pre-line">
        {description}
      </div>
    </div>
  );
};

export default ProgramDescription;
