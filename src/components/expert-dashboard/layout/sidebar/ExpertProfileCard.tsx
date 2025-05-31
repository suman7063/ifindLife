
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ExpertProfileCardProps {
  expert: any;
}

const ExpertProfileCard: React.FC<ExpertProfileCardProps> = ({ expert }) => {
  if (!expert) return null;

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium truncate">{expert.name || expert.full_name || 'Expert'}</p>
      <Badge 
        variant={expert.status === 'approved' ? 'default' : 'secondary'}
        className="mt-1"
      >
        {expert.status === 'approved' ? 'Verified' : expert.status || 'Pending'}
      </Badge>
    </div>
  );
};

export default ExpertProfileCard;
