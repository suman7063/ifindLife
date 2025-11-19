
import React from 'react';
import ExpertCardSimplified from '../expert-card/ExpertCardSimplified';
import { ExpertCardData } from '../expert-card/types';
import UnifiedExpertConnection from '../expert-connection/UnifiedExpertConnection';

interface ExpertsGridProps {
  experts?: ExpertCardData[];
  loading?: boolean;
  onResetFilters?: () => void;
}

const ExpertsGrid: React.FC<ExpertsGridProps> = ({ 
  experts = [], 
  loading = false,
  onResetFilters
}) => {
  // Use provided experts or show empty state
  const displayExperts = experts;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="border rounded-md p-4 h-64 animate-pulse flex flex-col"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="ml-3 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="flex justify-end">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <UnifiedExpertConnection serviceTitle="Expert Consultation" serviceId="consultation">
      {({ state, handleExpertCardClick, handleConnectNow, handleBookNow, handleChat, handleShowConnectOptions }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayExperts.map((expert) => (
            <ExpertCardSimplified
              key={expert.auth_id?.toString() || ''}
              expert={expert}
              onClick={() => handleExpertCardClick(expert)}
              onConnectNow={(type) => handleConnectNow(expert, type)}
              onBookNow={() => handleBookNow(expert)}
              onChat={() => handleChat(expert)}
              showConnectOptions={state.expertConnectOptions[expert.auth_id?.toString() || ''] || false}
              onShowConnectOptions={(show) => handleShowConnectOptions(expert.auth_id?.toString() || '', show)}
              className="h-full"
            />
          ))}
        </div>
      )}
    </UnifiedExpertConnection>
  );
};

export default ExpertsGrid;
