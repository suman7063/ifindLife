
import React from 'react';
import { Lock } from 'lucide-react';
import ExpertCard from '@/components/expert-card/ExpertCard';
import { Expert } from './types';

interface ExpertGridProps {
  experts: Expert[];
  selectedExpert: Expert | null;
  isAuthProtected: boolean;
  onExpertCardClick: (expert: Expert) => void;
  onStartCall: (expert: Expert) => void;
}

const ExpertGrid: React.FC<ExpertGridProps> = ({
  experts,
  selectedExpert,
  isAuthProtected,
  onExpertCardClick,
  onStartCall
}) => {
  if (experts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No experts available for this service at the moment.</p>
        <p className="text-sm text-gray-400 mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {experts.map((expert) => (
        <div key={expert.id} className="relative">
          <ExpertCard
            expert={{
              id: expert.id.toString(),
              name: expert.name,
              profilePicture: expert.imageUrl,
              specialization: expert.specialization,
              experience: parseInt(expert.experience),
              averageRating: expert.rating,
              reviewsCount: expert.reviews,
              price: expert.price,
              verified: true,
              status: 'online',
              waitTime: 'Available Now'
            }}
            onConnectNow={(type) => onStartCall(expert)}
            onBookNow={() => onStartCall(expert)}
            onClick={() => onExpertCardClick(expert)}
          />
          
          {/* Show protection indicator for selected expert */}
          {selectedExpert?.id === expert.id && isAuthProtected && (
            <div className="absolute top-2 right-2">
              <div className="bg-green-100 border border-green-300 rounded-full p-1">
                <Lock className="h-4 w-4 text-green-600" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpertGrid;
