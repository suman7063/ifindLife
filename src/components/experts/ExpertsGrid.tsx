
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from '../expert-card';

import { ExpertCardData } from '../expert-card/types';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
  const [expertConnectOptions, setExpertConnectOptions] = useState<{[key: string]: boolean}>({});

  // Use provided experts or show empty state
  const displayExperts = experts;

  const handleExpertCardClick = (expert: ExpertCardData) => {
    // Navigate to dedicated expert page instead of opening modal
    navigate(`/experts/${expert.auth_id || expert.id}`);
  };

  const handleConnectNow = (expert: ExpertCardData, type: 'video' | 'voice') => {
    console.log(`Connecting to ${expert.name} via ${type}`);
    toast.success(`Initiating ${type} call with ${expert.name}...`);
    // Here you would integrate with Agora SDK for video/voice calls
  };

  const handleBookNow = (expert: ExpertCardData) => {
    console.log(`Booking session with ${expert.name}`);
    
    // Navigate to expert's booking page with booking tab active
    const expertUrl = `/experts/${expert.auth_id || expert.id}?book=true`;
    window.location.href = expertUrl;
  };

  const handleShowConnectOptions = (expertId: string, show: boolean) => {
    setExpertConnectOptions(prev => ({
      ...prev,
      [expertId]: show
    }));
  };


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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayExperts.map((expert) => (
          <ExpertCard
            key={expert.id.toString()}
            expert={expert}
            onClick={() => handleExpertCardClick(expert)}
            onConnectNow={(type) => handleConnectNow(expert, type)}
            onBookNow={() => handleBookNow(expert)}
            showConnectOptions={expertConnectOptions[expert.id.toString()] || false}
            onShowConnectOptions={(show) => handleShowConnectOptions(expert.id.toString(), show)}
            className="h-full"
          />
        ))}
      </div>

    </>
  );
};

export default ExpertsGrid;
