
import React from 'react';
import FreeAssessmentCTA from '../FreeAssessmentCTA';

interface HelpSectionProps {
  subtitle: string;
  description: string;
}

export const HelpSection: React.FC<HelpSectionProps> = ({ subtitle, description }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 sm:px-12 md:px-20 shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-3 sm:mb-0">
            <h2 className="text-xl font-medium text-center sm:text-left">
              {subtitle}
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl">
              {description} <span className="inline-flex items-center ml-1 text-xs">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                (12 Experts currently online)
              </span>
            </p>
          </div>
          <div className="flex-shrink-0">
            <FreeAssessmentCTA />
          </div>
        </div>
      </div>
    </div>
  );
};
