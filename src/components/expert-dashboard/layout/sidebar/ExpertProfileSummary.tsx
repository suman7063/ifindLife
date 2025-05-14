
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExpertProfile } from '@/types/database/unified';

export interface ExpertProfileSummaryProps {
  expert: ExpertProfile;
}

const ExpertProfileSummary: React.FC<ExpertProfileSummaryProps> = ({ expert }) => {
  return (
    <div className="flex items-center space-x-3 pb-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src={expert.profile_picture || ''} alt={expert.name} />
        <AvatarFallback>{expert.name?.substring(0, 2).toUpperCase() || 'EA'}</AvatarFallback>
      </Avatar>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{expert.name}</p>
        <p className="text-xs text-muted-foreground">Expert</p>
      </div>
    </div>
  );
};

export default ExpertProfileSummary;
