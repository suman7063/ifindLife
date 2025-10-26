import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const AppointmentCardSkeleton: React.FC = () => {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {/* Avatar skeleton */}
          <Skeleton className="h-12 w-12 rounded-full" />
          
          <div className="flex-1 space-y-2">
            {/* Name and time skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            
            {/* Type skeleton */}
            <Skeleton className="h-4 w-24" />
          </div>
          
          {/* Action button skeleton */}
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};
