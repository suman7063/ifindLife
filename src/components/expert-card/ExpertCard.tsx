
import React from 'react';
import { Expert } from '@/types/expert';
import ExpertImage from './ExpertImage';
import ExpertInfo from './ExpertInfo';
import ExpertActions from './ExpertActions';

interface ExpertCardProps {
  expert: Expert;
  showFullProfile?: boolean;
  onViewProfile?: () => void;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ 
  expert, 
  showFullProfile = false,
  onViewProfile 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <ExpertImage expert={expert} />
      
      <div className="p-4 flex flex-col flex-1">
        <ExpertInfo expert={expert} showFullProfile={showFullProfile} />
        
        {/* Actions section - Always at bottom */}
        <div className="mt-auto pt-4">
          <ExpertActions expert={expert} onViewProfile={onViewProfile} />
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
