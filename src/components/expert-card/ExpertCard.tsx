
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ExpertCardProps {
  expert: {
    id: string;
    name: string;
    specialization?: string;
    profile_picture?: string;
    average_rating?: number;
  };
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  // Guard clause to prevent accessing properties of undefined
  if (!expert) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex-grow">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-100 rounded mt-2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            {expert.profile_picture ? (
              <img 
                src={expert.profile_picture} 
                alt={expert.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
                {expert.name?.charAt(0) || '?'}
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-medium">{expert.name || 'Expert'}</h3>
            {expert.specialization && (
              <p className="text-sm text-muted-foreground">{expert.specialization}</p>
            )}
            {expert.average_rating !== undefined && (
              <div className="flex items-center mt-1">
                <span className="text-sm text-amber-500 font-medium">
                  {expert.average_rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">★</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
