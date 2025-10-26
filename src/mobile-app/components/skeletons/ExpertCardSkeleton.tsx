import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const ExpertCardSkeleton: React.FC = () => {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Avatar skeleton */}
          <Skeleton className="h-16 w-16 rounded-full" />
          
          <div className="flex-1 space-y-2">
            {/* Name skeleton */}
            <Skeleton className="h-5 w-32" />
            
            {/* Specialty skeleton */}
            <Skeleton className="h-4 w-24" />
            
            {/* Rating skeleton */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          
          {/* Badge skeleton */}
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};
