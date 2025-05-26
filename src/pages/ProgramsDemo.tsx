
import React from 'react';
import HomepageIssueSessionsWithModal from '@/components/programs/HomepageIssueSessionsWithModal';

const ProgramsDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mental Health Programs
          </h1>
          <p className="text-lg text-gray-600">
            Explore our comprehensive programs designed to support your mental wellness journey.
          </p>
        </div>
        
        <HomepageIssueSessionsWithModal />
      </div>
    </div>
  );
};

export default ProgramsDemo;
